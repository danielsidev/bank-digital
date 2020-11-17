import { TransactionController } from '../../controller/core/transaction.controller';
import { AccountController } from '../../controller/core/account.controller';
import { Request, Response, NextFunction } from "express-serve-static-core";

/**
* Represents  a class of Transaction for the Transaction routes
* @class TransactionBusiness
*/
export class TransactionBusiness{

    constructor(){}

    /**
     * Represent the business method for the route register a new transaction to deposit
     * @name post /transaction/deposit
     * @param req {express.Request} The request.
     * @param res {express.Response} The response.
     * @param req.body {Object: Transaction} The JSON payload.
     * @param req.body.value {float } - Monetary value for deposit. Ex: 5000.00 
     * @param req.body.account_number {string} - number of account. Ex: 693028-6
     * @param req.body.origin_transaction {string} - origin of transaction. Ex: Bank slip - Account deposit
     */    
    public async setDeposit(req:Request, res:Response){        
        try {
            if(!!req.body.value && 
               !!req.body.account_number && 
               !!req.body.origin_transaction){
                let value  = parseFloat(req.body.value);
                let account_number = req.body.account_number;
                let origin_transaction = req.body.origin_transaction;    
                let ac = new AccountController();
                let account = await ac.getAccountExist(account_number);            
                if(account.result){
                    let account_id = account.data[0].account_id;
                    let tc = new TransactionController();
                    let result = await tc.deposit(value, account_number, account_id, origin_transaction);
                    res.status(200).json(result);     
                }else{
                    res.status(404).json({result:false, resonse: 'Account Not found'});    
                }

            }else{
                res.status(400).json({result:false, response: 'Invalid fields'});    
            }            
        } catch (error) {
            res.status(400).json({result:false, response:'Error on set deposit', data: error});
        }
    }
     /**
     * Represent the business method for the route register a new transaction to withdraw
     * @name post /transaction/withdraw
     * @param req {express.Request} The request.
     * @param res {express.Response} The response.
     * @param req.body {Object: Transaction} The JSON payload.
     * @param req.body.value {float } - Monetary value for to withdraw. Ex: 50.00 
     * @param req.body.account_number {string} - number of account. Ex: 193820-5
     * @param req.body.origin_transaction {string} - origin of transaction. Ex: ATM 24h, Debit Card - Store ABC
     */    

    public async setWithdraw(req:Request, res:Response){        
        try {
            if(!!req.body.value && 
               !!req.body.account_number && 
               !!req.body.origin_transaction){
                let value  = parseFloat(req.body.value);
                let account_number = req.body.account_number;                
                let origin_transaction = req.body.origin_transaction;                
                let ac = new AccountController();
                let account = await ac.getAccountExist(account_number);            
                if(account.result){
                    let account_id = account.data[0].account_id;
                    let tc = new TransactionController();
                    let result = await tc.toWithdraw(value, account_number, account_id, origin_transaction);
                    if(result.result){
                        res.status(200).json(result);     
                    }else{
                        res.status(400).json(result);     
                    }
                    
                }else{
                    res.status(404).json({result:false, response: 'Account Not found'});  
                }
            }else{
                res.status(400).json({result:false, response: 'Invalid fields'});    
            }            
        } catch (error) {
            res.status(400).json({result:false,response:'Error on set withdraw', data: error});
        }
    }
     /**
     * Represent the business method for the route register a new transaction to transfer
     * @name post /transaction/tranfer
     * @param req {express.Request} The request.
     * @param res {express.Response} The response.
     * @param req.body {Object: Transaction} The JSON payload.
     * @param req.body.value {float } - Monetary value for to transfer. Ex: 100.00 
     * @param req.body.account_number_origin {string} - number of account. Ex:693028-6
     * @param req.body.account_number_destiny {string} - number of account. Ex:5193820-5
     * @param req.body.origin_transaction {string} - origin of transaction. Ex: transfer between 693028-6 => 5193820-5
     */    
    public async setTransfer(req:Request, res:Response){        
        try {
            if(!!req.body.value && 
               !!req.body.account_number_origin && 
               !!req.body.account_number_destiny ){
                let value  = parseFloat(req.body.value);
                let account_number_origin = req.body.account_number_origin;                
                let account_number_destiny = req.body.account_number_destiny;                
                let origin_transaction = `Bank Transfer ${account_number_origin} => ${account_number_destiny}`;
                let ac = new AccountController();
                let account_origin = await ac.getAccountExist(account_number_origin);            
                let account_destiny = await ac.getAccountExist(account_number_destiny);
                if(account_origin.result && account_destiny.result && account_number_origin!=account_number_destiny){ 
                    let account_id_destiny = account_destiny.data[0].account_id;
                    let account_id_origin  = account_origin.data[0].account_id;
                    let tc = new TransactionController();
                    let result = await tc.transfer(
                                                    value, 
                                                    account_number_origin,
                                                    account_id_origin, 
                                                    account_number_destiny,
                                                    account_id_destiny, 
                                                    origin_transaction
                                                  );                                              
                    res.status(200).json(result);     
                }else{
                    res.status(404).json({result:false, response: 'One of the accounts was not found'});  
                }
            }else{
                res.status(400).json({result:false, response: 'Invalid fields'});    
            }            
        } catch (error) {
            res.status(400).json({result:false, response:'Error on set transfer', data: error});
        }
    }
    /**
     * Represent the business method for the route that get transactions
     * @name post /transactions/{init}/{limit}
     * @param req {express.Request} The request.
     * @param res {express.Response} The response.
     * @param req.params.init  {integer} - Initial position of cursor for pagination. Ex:0 for start from first register 
     * @param req.params.limit {integer} - Quantity of registers. Ex: 10 for return 10 transactions
     */    
    public async getAllTransactions(req:Request, res:Response){        
        try {
            if(!!req.params.init && !!req.params.limit  ){
                let init  = parseInt(req.params.init);
                let limit = parseInt(req.params.limit);
                let tc = new TransactionController();
                let result = await tc.getAllTransactions(init, limit)
                    res.status(200).json(result);     
            }else{
                res.status(400).json({result:false, data: 'Invalid fields'});    
            }            
        } catch (error) {
            res.status(400).json({result:false, response:'Error on get all transactions', data: error});
        }
    }
 
}