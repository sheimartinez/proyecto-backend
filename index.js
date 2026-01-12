// LOGIN - Pauta 3
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "CLAVE_DEV";

// parte4
function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ mensaje: "Falta token" });

    const parts = header.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ mensaje: "Formato Authorization inválido. Debe ser: Bearer <token>" });
    }
    const token = parts[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ mensaje: "Token inválido" });
        req.user = decoded;
        next();
    });
}

//en base a https://www.youtube.com/watch?v=FyxyxyPTPhU + bastante info externa
//en esta parte importamos express y cors
const express = require('express');
const cors = require('cors'); 

//parte del desafiate 
const conexion = require('./conexion'); //hasta acá

const app = express(); //express() es una función de express que devuelve un objeto de aplicación que también tiene métodos y propiedades.

app.use(cors()); //asegura que todas las respuestas que salgan del servidor incluyan las cabeceras cors necesarias.
app.use(express.json()); //deja que el servidor entienda datos en JSON que vengan desde el cliente.

app.get('/cart', authMiddleware, (req, res) => { //le pongo una ruta (la llamé /cart)
    const data = require('./data/cart/buy.json');//importo la ubicación del json.
    res.json(data); //envío el json al navegador como respuesta.
});

app.get('/cats', authMiddleware, (req, res) => {
    const data = require('./data/cats/cat.json');
    res.json(data);
});

app.get('/cats_products/:id', authMiddleware, (req, res) => { //le pongo una ruta pero con un parámetro (el id)
    const id = req.params.id; //agarro y guardo el valor
    const data = require(`./data/cats_products/${id}.json`); //importa el json que tenga el mismo valor que el id
    res.json(data);
});

app.get('/products/:id', authMiddleware, (req, res) => {
    const id = req.params.id; //toma de la parte request(la info que llega del navegador), params son los parámetros de la url y el id el valor que ponga en la url. (basicamente toma el id de la url y lo guarda)
    const data = require(`./data/products/${id}.json`);
    res.json(data);
});

app.get('/products_comments/:product', authMiddleware, (req, res) => {
    const id = req.params.product;
    const data = require(`./data/products_comments/${id}.json`);
    res.json(data);
});

app.get('/sell', authMiddleware, (req, res) => {
    const data = require('./data/sell/publish.json');
    res.json(data);
});

app.get('/user_cart', authMiddleware, (req, res) => {
    const data = require('./data/user_cart/25801.json');
    res.json(data);
});

//pauta desafiate
//endpoint POST/cart
app.post('/cart', authMiddleware, (req, res) => {
    const carrito = req.body; //guardo en una variable los datos que llegan del frontend.
    const sqlCliente = "INSERT INTO Cliente (Nombre, Apellido, Correo, Direccion, Telefono) VALUES ('Cliente', 'Generico', ? , 'direccion', '0000')";//primero creamos un cliente simple
    const mailUnico = `cliente_${Date.now()}@mail.com`;
    
    conexion.query(sqlCliente, [mailUnico], (errorCliente, resultadoCliente) => {
        if (errorCliente) {
            console.log("Error al crear cliente:", errorCliente);
            res.status(500).json({ error: "No se pudo crear el cliente", detalle: errorCliente.sqlMessage});
            return;
        }
        
        const clienteID = resultadoCliente.insertId; // ID del cliente creado
        
        const sqlPedido = "INSERT INTO Pedido (Cliente_ID, Fecha_envio, Telefono) VALUES (?, ?, ?)"; //inserto un pedido nuevo en la tabla Pedido.
        const valoresPedido = [clienteID, "2025-11-30", "00000000"];
        
        conexion.query(sqlPedido, valoresPedido, (error, resultadoPedido) => {
            if (error) {
                console.log("Error al crear pedido:", error);
                res.status(500).json({ error: "No se pudo crear el pedido" });
                return;
            }
            
            const numeroPedido = resultadoPedido.insertId; //guardo el ID del pedido recién creado.
            
            carrito.forEach(item => {
                const sqlProducto = `INSERT INTO Producto (Cantidad, Tipo_producto)VALUES (?, ?)`;
                const valoresProducto = [
                    item.cantidad,
                    item.nombre || "Producto"
                ];
                
                conexion.query(sqlProducto, valoresProducto, (errorProducto, resultadoProducto) => {
                    if (errorProducto) {
                        console.log("Error al insertar producto:", errorProducto);
                        return;
                    }
                    
                    const productoID = resultadoProducto.insertId;
                    const sqlDetalle = `INSERT INTO Detalle_Pedido (Numero_pedido, Producto_ID, Cantidad, Precio_unitario)VALUES (?, ?, ?, ?)`;
                    
                    const valoresDetalle = [
                        numeroPedido,
                        productoID,
                        item.cantidad,
                        parseFloat(item.precio.split(" ")[1]) //convierte un texto (string) en un número decimal.
                    ];
                    
                    conexion.query(sqlDetalle, valoresDetalle, (errorDetalle) => {
                        if (errorDetalle) {
                            console.log("Error al agregar detalle:", errorDetalle);
                        }
                    });
                });
            });
            
            res.json({ mensaje: "Carrito guardado correctamente" });//respondo al frontend diciendo que salió bien.
        });
    });
});

const PORT = process.env.PORT || 3000; //le damos un puerto.

app.post("/login", (req, res) => {
    const { usuario, password } = req.body;

    // Si no existe → error
    if (!usuario || !password) {
        return res.status(400).json({
            mensaje: "Usuario o contraseña incorrectos"
        });
    }

    if (!usuario.includes("@") || !usuario.includes(".")) {
        return res.status(400).json({
            mensaje: "Email inválido"
        });
    }

    if (password.length < 4) {
        return res.status(400).json({
            mensaje: "La contraseña debe tener al menos 4 caracteres"
        });
    }

    // Si existe → generar token
    const token = jwt.sign(
        { usuario }, 
        JWT_SECRET, 
        { expiresIn: "1h" }
    );

    res.json({
        mensaje: "Login exitoso",
        token: token
    });
});

// Pauta 3 - Ruta para recibir datos de envío desde el frontend
app.post('/envio', (req, res) => {
    const datos = req.body;

    console.log("Datos recibidos en /envio:", datos);

    // Respuesta al frontend
    res.json({
        status: "ok",
        mensaje: "Datos de envío recibidos correctamente",
        datos: datos
    });
});

//ponemos a escuchar al servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en ${PORT}`);
});