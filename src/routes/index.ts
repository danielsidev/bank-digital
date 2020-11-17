import {Request, Response, Application} from "express";
import {AccountBusiness} from '../business/account/index';
import {TransactionBusiness} from '../business/transaction/index';
export class Register {
    public app: Application;
    public ac: AccountBusiness;
    public tc: TransactionBusiness;

    constructor(app: Application) { 
        this.app = app;
        this.ac = new AccountBusiness();
        this.tc = new TransactionBusiness();
    }
    public setRoutes() {
        this.app.get( "/", ( req: Request, res: Response ) => res.render( "index" ) );
        this.app.post("/account", this.ac.setNewAccount);
        this.app.get("/accounts/all/:init/:limit", this.ac.getAllAccounts);
        this.app.post("/transaction/deposit", this.tc.setDeposit);
        this.app.post("/transaction/withdraw", this.tc.setWithdraw);
        this.app.post("/transaction/transfer", this.tc.setTransfer);
        this.app.get("/transactions/all/:init/:limit", this.tc.getAllTransactions);
    }
}
