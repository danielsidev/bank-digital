import { Connection, createPool ,createConnection, FieldInfo, MysqlError, Pool, PoolConnection} from 'mysql';

class MySQLConn {
    private readonly connection: Connection;
    private pool: Pool;
    private config: object;
    constructor() {
        this.config = {
            connectionLimit:10,
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            timezone: 'utc'
        };
        this.pool = createPool(this.config);
    }
    public getConnection(){
        return new Promise((resolve, reject )=>{
            this.pool.getConnection((err, connection:PoolConnection) => {
                if (err) {
                    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                        console.error('Database connection was closed.')
                        reject('error connecting: ' + err.stack);
                    }
                    if (err.code === 'ER_CON_COUNT_ERROR') {
                        console.error('Database has too many connections.')
                        reject('error connecting: ' + err.stack);
                    }
                    if (err.code === 'ECONNREFUSED') {
                        console.error('Database connection was refused.')
                        reject('error connecting: ' + err.stack);
                    }else{
                        console.log(`ERROR Connect: ${JSON.stringify(err)}`);
                        reject('error connecting: ' + err.stack);
                    }
                }
                if (connection){
                    connection.release()
                    console.log("MySQL pool connected: threadId " + connection.threadId);
                    resolve(connection);
                } 
            });
        });
    }



}
export {MySQLConn, PoolConnection}

// let bd = new MySQLConn();
// bd.getConnection().then((connection:PoolConnection)=>{
// connection.query('INSERT INTO products  VALUES(?, ?)',[10,"Smartphone"], (err, rows) => {
//     if(err){
//         console.log(`ERROR QUERY: ${JSON.stringify(err)}`);
//     }else{
//         console.log(`Result: ${JSON.stringify(rows)}`);
//         // res.json(rows);
//     } 
// })
// }).catch();


