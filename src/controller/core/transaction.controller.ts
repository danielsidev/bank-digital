// import { User } from 'model/interfaces/user.interface';
import { ResponseDao } from 'model/interfaces/response.dao.interface';
import {TransactionDao} from '../../model/dao/transaction.dao';
// import { Account } from 'model/interfaces/account.interface';
import { Transaction } from 'model/interfaces/transaction.interface';
import { AccountController } from './account.controller';

export class TransactionController extends TransactionDao{
    
    private response:ResponseDao;
    private fee:number;
    private transaction: Transaction;
    private depositValue:number;
    private withdrawValue:number;
    private accountControl: AccountController;
    private accounts:ResponseDao;
    private  depositOp:number | object;
    private withdrawOp:number | object;

    constructor(){
       super();
       this.response = { result:false, response:''}; 
       this.transaction = {
        transaction_origin:"",
        transaction_destiny:"",
        transaction_type: 0,
        transaction_value: 0,
        transaction_value_original:0,
        transaction_deposit_fee: 0,
        transaction_withdrawal_fee: 0,
        transaction_type_operation:0,
        transaction_account:0,
        transaction_created_at:this.generateDateTime(),
        transaction_updated_at:this.generateDateTime()
       };
       this.accountControl = new AccountController();
    }
    private setFee(type:string){
        switch (type) {
            case "deposit":
                this.fee = 0.0005;    
                break;
            case "withdraw":
                this.fee = 0.01;    
                break;
        }
    }
    private getFee():number{
        return this.fee;
    }
    private generateDateTime(): string{
    let dt = new Date();
    let h  = dt.getHours();
    let m  = (dt.getMinutes() < 10)?"0"+dt.getMinutes():dt.getMinutes();
    let s  = dt.getSeconds();
    let y  = dt.getFullYear();
    let mo = dt.getMonth()+1;
    let d  = (dt.getDate() < 10)?"0"+dt.getDate():dt.getDate();
    let datetime = `${y}-${mo}-${d} ${h}:${m}:${s}`;  
    return datetime;
    }
    private setFeeWithdraw(value: number){
        this.setFee("withdraw");
        this.withdrawValue = value + (value * this.getFee());
    }
    private getFeeWithdraw():number{
        return this.withdrawValue;
    }
    private setFeeDeposit(value: number){
        this.setFee("deposit");
        this.depositValue = value + (value * this.getFee());
    }
    private getFeeDeposit():number{
        return this.depositValue; 
    }
    public async deposit(
        value_original:number,
        account_destiny:string,
        account_id,
        origin:string='deposito_boleto', 
        type_operation:number = 1,  
               
        transaction_type:number=1,                      
        created_at:string = this.generateDateTime(),
        updated_at:string = this.generateDateTime())
    {
            this.response.result=false;
            this.response.response="We cannot make the deposit";

            this.transaction.transaction_account = account_id;
            this.transaction.transaction_origin = origin;
            this.transaction.transaction_destiny = account_destiny;
            this.transaction.transaction_type = transaction_type;          
            this.transaction.transaction_value_original = parseFloat(value_original.toString());

            if(type_operation===3){ /**Transfer : No charge*/
                this.transaction.transaction_value = this.transaction.transaction_value_original;
                this.transaction.transaction_deposit_fee = 0;
            }else{
                this.setFeeDeposit(this.transaction.transaction_value_original);
                this.transaction.transaction_value = this.getFeeDeposit();
                this.transaction.transaction_deposit_fee = this.getFee();
            }
                        
            this.transaction.transaction_type_operation = type_operation;
            this.transaction.transaction_created_at = created_at;
            this.transaction.transaction_updated_at = updated_at;
            
            try {
                this.depositOp = await this.insert(this.transaction);
                if(this.depositOp){
                    this.response.result=true;
                    this.response.response="Deposit done with success";
                    let accounts = await this.accountControl.getById(account_id);         
                    let currentBalance = accounts.data[0].account_balance;
                    let newBalance = currentBalance + this.transaction.transaction_value;
                    let renew = await this.accountControl.renewBalance(newBalance, account_id);
                    if(renew.result){
                        this.response.result=true;
                        this.response.response="Deposit done with success. Account Update!";
                    }else{
                        let transaction_id = parseInt(this.depositOp.toString());
                        await this.delete(transaction_id);
                        this.response.result=true;
                        this.response.response=" Account Not Update! Rollback Deposit!";
                    }
                }    
                return this.response;
            } catch (error) {
                console.log(`ERROR on Deposit: ${JSON.stringify(error)}`);
                this.response.result=false;
                this.response.response=" Account Not Update! Rollback Deposit!";
                let transaction_id = parseInt(this.depositOp.toString());
                await this.delete(transaction_id);
                return this.response;            
            }        
    }
    public async toWithdraw(
        value_original:number,
        account_destiny:string,
        account_id,
        origin:string='saque_caixa_24h', 
        type_operation:number = 2,              
        transaction_type:number=2,               
        created_at:string = this.generateDateTime(),
        updated_at:string = this.generateDateTime())
    {
        this.response.result=false;
        this.response.response="We cannot make the withdraw";

        this.transaction.transaction_account = account_id;
        this.transaction.transaction_origin = origin;
        this.transaction.transaction_destiny = account_destiny;
        this.transaction.transaction_type = transaction_type;
        this.transaction.transaction_value_original = parseFloat(value_original.toString());
        
        if(type_operation===3){ /**Transfer : No charge*/
            this.transaction.transaction_value = this.transaction.transaction_value_original;
            this.transaction.transaction_deposit_fee = 0;
        }else{
            this.setFeeWithdraw(this.transaction.transaction_value_original);
            this.transaction.transaction_value = this.getFeeWithdraw();
            this.transaction.transaction_deposit_fee = this.getFee();
        }
      
        this.transaction.transaction_type_operation = type_operation;
        this.transaction.transaction_created_at = created_at;
        this.transaction.transaction_updated_at = updated_at;
        
        try {
            let accounts = await this.accountControl.getById(account_id);         
            let currentBalance = accounts.data[0].account_balance;
            let newBalance = currentBalance - this.transaction.transaction_value;
            if(currentBalance<=0){
                this.response.result=false;
                this.response.response=" The current balance is insucient!";
                return this.response;
            }else if(newBalance<=0){
                this.response.result=false;
                this.response.response=" The new balance will be zero or negative!";
                return this.response;                
            }else{
                this.withdrawOp = await this.insert(this.transaction);
                if(this.withdrawOp){
                    this.response.result=true;
                    this.response.response="Withdraw done with success";
                    let renew = await this.accountControl.renewBalance(newBalance, account_id);
                    if(renew.result){
                        this.response.result=true;
                        this.response.response="Withdraw done with success. Account Update!";
                    }else{
                        let transaction_id = parseInt(this.withdrawOp.toString());
                        await this.delete(transaction_id);
                        this.response.result=false;
                        this.response.response="Account Not Update! Rollback Withdraw!";
                    }
                }                   
                return this.response;
            }       
        } catch (error) {
            console.log(`ERROR on Withdraw: ${JSON.stringify(error)}`);
            let transaction_id = parseInt(this.withdrawOp.toString());
            await this.delete(transaction_id);
            this.response.result=false;
            this.response.response="Account Not Update! Rollback Withdraw!";
            return this.response;            
        }  
    }
    public async transfer(
        value_original:number,
        account_origin:string,
        account_origin_id:number, 
        account_destiny:string,
        account_destiny_id:number,         
        origin,
        type_operation:number = 3
        )
    {
        let withdraw = await  this.toWithdraw(
            parseFloat(value_original.toString()),
            account_origin,            
            account_origin_id,
            origin,
            type_operation
        );
        if(withdraw.result){
            let deposit = await this.deposit(
                parseFloat(value_original.toString()),
                account_destiny,
                account_destiny_id,
                origin,
                type_operation
            );
            if(!deposit.result){
                /**Error on deposit, rollback deposit. 
                 * And withdral needs of rolback too */
                let transaction_id = parseInt(this.withdrawOp.toString());
                /** Rollback withdral */
                await this.delete(transaction_id);
                this.response.result=false;
                this.response.response="Error on Deposit! Rollback Transfer!";
                return this.response;
            }
            this.response.result=true;
            this.response.response="Transfered with success!";
        }else{
            this.response.result=false;
            this.response.response="Error on Withdraw! Rollback Transfer!";
        }
        return this.response;
    }
    public async remove(transaction_id: number):Promise<ResponseDao>{
        this.response = {result:false, response:'We can not to remove the user'};   
        if(transaction_id){
            let removed = await this.delete(transaction_id);
            if(removed>0){
                this.response = {result:true, response:'Transaction removed with success'};   
            }else{
                this.response = {result:false, response:'We can not to remove the transaction'};   
            }            
        }
        return this.response;
    }
    public async getAllTransactions(init:number, limit:number){
        let transactions = await this.selectAll(init, limit);
        this.response = {result:true, response:'Transactions loaded with success', data:transactions}; 
        return this.response;
    }    
}
