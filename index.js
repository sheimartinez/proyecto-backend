// LOGIN - Pauta 3
const jwt = require("jsonwebtoken");

//en base a https://www.youtube.com/watch?v=FyxyxyPTPhU + bastante info externa
//en esta parte importamos express y cors
const express = require('express');
const cors = require('cors'); 

const app = express(); //express() es una función de express que devuelve un objeto de aplicación que también tiene métodos y propiedades.

app.use(cors()); //asegura que todas las respuestas que salgan del servidor incluyan las cabeceras cors necesarias.
app.use(express.json()); //deja que el servidor entienda datos en JSON que vengan desde el cliente.

app.get('/cart', (req, res) => { //le pongo una ruta (la llamé /cart)
    const data = require('./data/cart/buy.json');//importo la ubicación del json.
    res.json(data); //envío el json al navegador como respuesta.
});

app.get('/cats', (req, res) => {
    const data = require('./data/cats/cat.json');
    res.json(data);
});

app.get('/cats_products/:id', (req, res) => { //le pongo una ruta pero con un parámetro (el id)
    const id = req.params.id; //agarro y guardo el valor
    const data = require(`./data/cats_products/${id}.json`); //importa el json que tenga el mismo valor que el id
    res.json(data);
});

app.get('/products/:id', (req, res) => {
    const id = req.params.id; //toma de la parte request(la info que llega del navegador), params son los parámetros de la url y el id el valor que ponga en la url. (basicamente toma el id de la url y lo guarda)
    const data = require(`./data/products/${id}.json`);
    res.json(data);
});

app.get('/products_comments/:product', (req, res) => {
    const id = req.params.product;
    const data = require(`./data/products_comments/${id}.json`);
    res.json(data);
});

app.get('/sell', (req, res) => {
    const data = require('./data/sell/publish.json');
    res.json(data);
});

app.get('/user_cart', (req, res) => {
    const data = require('./data/user_cart/25801.json');
    res.json(data);
});

const PORT = 3000; //le damos un puerto.

// LOGIN - Pauta 3
const usuarios = [
  { usuario: "admin@admin.com", password: "1234" },
  { usuario: "lucas@gmail.com", password: "abcd" }
];

app.post("/login", (req, res) => {
    const { usuario, password } = req.body;

    // Busca usuario coincidente
    const userFound = usuarios.find(
      u => u.usuario === usuario && u.password === password
    );

    // Si no existe → error
    if (!userFound) {
        return res.status(401).json({
            mensaje: "Usuario o contraseña incorrectos"
        });
    }

    // Si existe → generar token
    const token = jwt.sign(
        { usuario: userFound.usuario }, 
        "CLAVE_SUPER_SECRETA_123", 
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
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});