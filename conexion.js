const mysql = require('mysql2'); /*importa la librería mysql2*/

const conexion = mysql.createConnection({ /*Crea una conexión individual a la base de datos.*/
  host: 'localhost',
  user: 'root', /*Usuario de la base de datos.*/
  password: '1234', /*Contraseña del usuario.*/
  database: 'ecommerce'
});

conexion.connect(error => { /*Intenta inicializar la conexión con la base de datos.*/
  if (error) {
    console.error('Error conectando a MariaDB:', error); /*Muestra por consola un mensaje de error y el objeto error con detalles (puede incluir código, mensaje, etc.)*/
    return;
  }
  console.log('Conectado a MariaDB'); /*Si no hubo error, imprime que la conexión fue exitosa.*/
});

module.exports = conexion; /*Hace que la variable conexion pueda ser usada desde otros archivos del proyecto.*/
