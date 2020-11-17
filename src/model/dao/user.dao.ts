import { User } from "model/interfaces/user.interface";
import { MySQLConn, PoolConnection } from "../database/mysql.client.model";

class UserDao extends MySQLConn {
    private table: string;
    constructor() {
        super();
        this.table = "user"
    }
    public insert(user: User ): Promise<object> {
        return new Promise((resolve, reject)=>{
            this.getConnection().then((connection: PoolConnection) => {
                connection.query(`INSERT INTO ${this.table}  VALUES(?, ?, ?)`, [user.user_id, user.user_fullname, user.user_cpf], (err, rows) => {
                    if (err) {
                        console.log(`ERROR QUERY: ${JSON.stringify(err)}`);
                        reject(err);
                    } else {
                        resolve(rows.insertId);
                    }
                })
            }).catch((err)=>{
                console.log(`CATCH: ERROR EXECUTION => ${JSON.stringify(err)}`);
                reject(err);
            });
        });        
    }
    public selectByCpf(cpf: string ): Promise<[User]> {
        return new Promise((resolve, reject)=>{
            this.getConnection().then((connection: PoolConnection) => {
                connection.query(`SELECT * FROM ${this.table} WHERE user_cpf=?`, [cpf], (err, rows) => {
                    if (err) {
                        console.log(`ERROR QUERY: ${JSON.stringify(err)}`);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                })
            }).catch((err)=>{
                console.log(`CATCH: ERROR EXECUTION => ${JSON.stringify(err)}`);
                reject(err);
            });
        });        
    }
    public selectAll(init:number, limit:number): Promise<[User]> {
        return new Promise((resolve, reject)=>{
            this.getConnection().then((connection: PoolConnection) => {
                connection.query(`SELECT * FROM ${this.table} limit ?, ?`, [init, limit], (err, rows) => {
                    if (err) {
                        console.log(`ERROR QUERY: ${JSON.stringify(err)}`);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                })
            }).catch((err)=>{
                console.log(`CATCH: ERROR EXECUTION => ${JSON.stringify(err)}`);
                reject(err);
            });
        });        
    }
    public delete(user_id){
        return new Promise((resolve, reject)=>{
            this.getConnection().then((connection: PoolConnection) => {
                connection.query(`DELETE FROM ${this.table}  WHERE user_id=?`, [user_id], (err, rows) => {
                    if (err) {
                        console.log(`ERROR QUERY: ${JSON.stringify(err)}`);
                        reject(err);
                    } else {
                        resolve(rows.affectedRows);
                    }
                })
            }).catch((err)=>{
                console.log(`CATCH: ERROR EXECUTION => ${JSON.stringify(err)}`);
                reject(err);
            });
        });  
    }
}

export {UserDao};
