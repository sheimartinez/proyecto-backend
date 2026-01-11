const mysql = require('mysql2'); /*importa la librería mysql2*/

const conexion = mysql.createPool({ /*Crea una conexión individual a la base de datos.*/
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

conexion.getConnection((error, conexion) => { /*Intenta inicializar la conexión con la base de datos.*/
  if (error) {
    console.error('Error conectando a MySQL:', error); /*Muestra por consola un mensaje de error y el objeto error con detalles (puede incluir código, mensaje, etc.)*/
    return;
  }
  console.log('Conectado a MySQL'); /*Si no hubo error, imprime que la conexión fue exitosa (Aiven).*/
  connection.release();
});

module.exports = conexion; /*Hace que la variable conexion pueda ser usada desde otros archivos del proyecto.*/
