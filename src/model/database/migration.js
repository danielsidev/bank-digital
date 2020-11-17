var sql = require('./sql_create_tables');
var mysql = require('mysql'); 
var connection = mysql.createConnection({
    // host: 'localhost',
    // user: 'root',
    // password: 'apolo1',
    // database: 'donus_credit',
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    debug: false,
    multipleStatements: true
});
connection.connect();
connection.query(sql, [], function(error, results, fields) {
    if (error) {
        console.log(error);
    }
    console.log(results);
});
 
connection.end();
