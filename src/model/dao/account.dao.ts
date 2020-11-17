import { Account } from "model/interfaces/account.interface";
import {UserAccount} from "model/interfaces/user_account.interface";
import { MySQLConn, PoolConnection } from "../database/mysql.client.model";

class AccountDao extends MySQLConn {
    private table: string;
    constructor() {
        super();
        this.table = "account"
    }
    public insert(account: Account ): Promise<object> {
        return new Promise((resolve, reject)=>{
            this.getConnection().then((connection: PoolConnection) => {
                connection.query(`INSERT INTO ${this.table}  VALUES(?, ?, ?, ?, ?, ?)`,[
                    account.account_id, 
                    account.account_number, 
                    account.account_agency,
                    account.user_id,
                    account.account_balance,
                    account.account_type
                ], (err, rows) => {
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

    public updateBalance(account_balance:number, account_id:number ): Promise<object> {
        return new Promise((resolve, reject)=>{
            this.getConnection().then((connection: PoolConnection) => {
                connection.query(`UPDATE ${this.table} SET  account_balance=? WHERE account_id=?`,[
                    account_balance,
                    account_id                    
                ], (err, rows) => {
                    if (err) {
                        console.log(`ERROR QUERY: ${JSON.stringify(err)}`);
                        reject(err);
                    } else {
                        console.log(`Result: ${JSON.stringify(rows)}`);
                        resolve(rows.affectedRows);
                    }
                })
            }).catch((err)=>{
                console.log(`CATCH: ERROR EXECUTION => ${JSON.stringify(err)}`);
                reject(err);
            });
        });        
    }

    public selectById(account_id: number ):Promise<[Account]> {
        return new Promise((resolve, reject)=>{
            this.getConnection().then((connection: PoolConnection) => {
                connection.query(`SELECT * FROM ${this.table}  WHERE account_id=?`, [account_id], (err, rows) => {
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

    public selectByNumber(account_number: string ):Promise<[UserAccount]> {
        return new Promise((resolve, reject)=>{
            this.getConnection().then((connection: PoolConnection) => {
                connection.query(`SELECT * FROM ${this.table} as a INNER JOIN user as u ON a.user_id=u.user_id WHERE account_number=?`, [account_number], (err, rows) => {
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

    public selectByUser(user_id:number ):Promise<[UserAccount]> {
        return new Promise((resolve, reject)=>{
            this.getConnection().then((connection: PoolConnection) => {
                connection.query(`SELECT * FROM ${this.table} as a INNER JOIN user as u ON a.user_id=u.user_id WHERE user_id=?`, [user_id], (err, rows) => {
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

    public checkAccountExist(account_number:string):Promise<[{}]>{
        return new Promise((resolve, reject)=>{
            this.getConnection().then((connection: PoolConnection) => {
                connection.query(`SELECT account_id FROM ${this.table} WHERE account_number=?`, [account_number], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(`Result: ${JSON.stringify(rows)}`);
                        resolve(rows);
                    }
                })
            }).catch((err)=>{
                console.log(`CATCH: ERROR EXECUTION => ${JSON.stringify(err)}`);
                reject(err);
            });
        });        
    }
    public selectAll(init:number, limit:number):Promise<[UserAccount]> {
        return new Promise((resolve, reject)=>{
            this.getConnection().then((connection: PoolConnection) => {
                connection.query(`SELECT * FROM ${this.table} as a INNER JOIN user as u ON a.user_id=u.user_id limit ?, ?`, [init, limit], (err, rows) => {
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
}
export {AccountDao} ;
