CREATE DATABASE ecommerce; /*crea la base de datos con nombre ecommerce*/
USE ecommerce;  /*instrucción para usar esa base de datos*/


CREATE TABLE Cliente ( /*crea una tabla con nombre cliente*/
    Cliente_ID INT AUTO_INCREMENT PRIMARY KEY,/*Cliente_ID nombre de la columna, _ID indica que es un identificador. INT tipo de dato entero. autoincrementa en 1. PRIMARY KEY identifica de forma unica cada fila en la tabla*/
    Nombre VARCHAR(100) NOT NULL, /*nombre es el nombre de la columna, vachar texto variable (100) longitud máxima permitida, no puede estar vacío*/
    Apellido VARCHAR(100) NOT NULL, /*apellido es el nombre de la columna, vachar texto variable (100) longitud máxima permitida, no puede estar vacío*/
    Correo VARCHAR(150), /*columna para mail, max 150 caracteres y puede estar vacío*/
    Direccion VARCHAR(200), /*mismo a correo*/
    Telefono VARCHAR(50) /*mismo a correo*/
);

CREATE TABLE Producto (
    Producto_ID INT AUTO_INCREMENT PRIMARY KEY,
    Cantidad INT NOT NULL,
    Tipo_producto VARCHAR(100) NOT NULL
);

CREATE TABLE Pedido (
    Numero_pedido INT AUTO_INCREMENT PRIMARY KEY,
    Cliente_ID INT,
    Fecha_envio DATE,
    Telefono VARCHAR(50),
    FOREIGN KEY (Cliente_ID) REFERENCES Cliente(Cliente_ID) /*declara una llave foránea. indica la tabla y columna de referencia: Cliente y su Cliente_ID. Significa: el valor que pongas en Pedido.Cliente_ID debe existir en Cliente.Cliente_ID.*/
);

CREATE TABLE Detalle_Pedido (
    Detalle_ID INT AUTO_INCREMENT PRIMARY KEY,
    Numero_pedido INT NOT NULL,
    Producto_ID INT NOT NULL,
    Cantidad INT NOT NULL,
    Precio_unitario DECIMAL(10,2),
    FOREIGN KEY (Numero_pedido) REFERENCES Pedido(Numero_pedido),/*Declara llave foránea sobre Numero_pedido en esta tabla.(Numero_pedido) Columna local que referencia. REFERENCES Pedido(Numero_pedido) Tabla y columna referenciada: Pedido.Numero_pedido.*/
    FOREIGN KEY (Producto_ID) REFERENCES Producto(Producto_ID) /*Igual que la anterior, pero referenciando Producto.Producto_ID.*/
);
