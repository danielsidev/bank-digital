import {Transaction} from "model/interfaces/transaction.interface";
import { MySQLConn, PoolConnection } from "../database/mysql.client.model";

class TransactionDao extends MySQLConn {
    private table: string;
    constructor() {
        super();
        this.table = "transactions"
    }
    public insert(transaction: Transaction ):Promise<object | number> {
        return new Promise((resolve, reject)=>{
            this.getConnection().then((connection: PoolConnection) => {
                connection.query(`INSERT INTO ${this.table}  VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,[
                    transaction.transaction_id,
                    transaction.transaction_origin,
                    transaction.transaction_destiny,
                    transaction.transaction_type,
                    transaction.transaction_value,
                    transaction.transaction_value_original,
                    transaction.transaction_deposit_fee,
                    transaction.transaction_withdrawal_fee,
                    transaction.transaction_type_operation,
                    transaction.transaction_account,
                    transaction.transaction_created_at,
                    transaction.transaction_updated_at
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
    public selectByAccount(account_number: string ) {
        return new Promise((resolve, reject)=>{
            this.getConnection().then((connection: PoolConnection) => {
                connection.query(`SELECT * FROM ${this.table} as t 
                INNER JOIN transaction_type as tt ON t.transaction_type=tt.transaction_type_id
                INNER JOIN transaction_type_operation as tto ON t.transaction_type_operation=tto.transaction_type_operation_id 
                INNER JOIN account as a ON t.transaction_account=a.account_id
                WHERE a.account_number=?`, [account_number], (err, rows) => {
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
    public selectAll(init:number, limit:number) {
        return new Promise((resolve, reject)=>{
            this.getConnection().then((connection: PoolConnection) => {
                connection.query(`SELECT * FROM ${this.table} as t 
                INNER JOIN transaction_type as tt ON t.transaction_type=tt.transaction_type_id
                INNER JOIN transaction_type_operation as tto ON t.transaction_type_operation=tto.transaction_type_operation_id 
                INNER JOIN account as a ON t.transaction_account=a.account_id limit ?, ?`, [init, limit], (err, rows) => {
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
    public delete(transaction_id:number){
        return new Promise((resolve, reject)=>{
            this.getConnection().then((connection: PoolConnection) => {
                connection.query(`DELETE FROM ${this.table}  WHERE transaction_id=?`, [transaction_id], (err, rows) => {
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

export {TransactionDao};
