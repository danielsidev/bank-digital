import { AccountController } from '../../controller/core/account.controller';
import { Request, Response, NextFunction } from "express-serve-static-core";
/**
* Represents  a class of account for the account routes
* @class AccountBusiness
*/
export class AccountBusiness{

    constructor(){}

    /**
     * Represent the business method for the route Register a new account
     * @name post /schedule
     * @param req {express.Request} The request.
     * @param res {express.Response} The response.
     * @param req.body {Object: Account} The JSON payload.
     * @param req.body.fullname {string } - Name of client 
     * @param req.body.cpf {string} - Identified document
     */    
    public async setNewAccount(req:Request, res:Response){        
        try {
            if(!!req.body.cpf && !!req.body.fullname){
                let cpf  = req.body.cpf;
                let nome = req.body.fullname;
                let user = {user_fullname:nome, user_cpf:cpf};
                let ac = new AccountController();
                let newAccount = await ac.create(user);
                if(newAccount.result){
                    res.status(200).json(newAccount);     
                }else{
                    res.status(400).json(newAccount);     
                }                
            }else{
                res.status(400).json({result:false, response: 'Invalid fields'});    
            }            
        } catch (error) {
            res.status(400).json({result:false, response: 'Error on create account', data:error});
        }
    }
    /**
     * Represent the business method for the route that get accounts
     * @name post /transactions/{init}/{limit}
     * @param req {express.Request} The request.
     * @param res {express.Response} The response.
     * @param req.params.init  {integer} - Initial position of cursor for pagination. Ex:0 for start from first register 
     * @param req.params.limit {integer} - Quantity of registers. Ex: 10 for return 10 transactions
     */    
    public async getAllAccounts(req:Request, res:Response){        
        try {
            if(!!req.params.init && !!req.params.limit  ){
                let init  = parseInt(req.params.init);
                let limit = parseInt(req.params.limit);
                let ac = new AccountController();
                let result = await ac.getAllAccounts(init, limit);
                res.status(200).json(result);     
            }else{
                res.status(400).json({result:false, response: 'Invalid fields'});    
            }            
        } catch (error) {
            res.status(400).json({result:false, response:'Error on get all accounts', data:error});
        }
    }
}