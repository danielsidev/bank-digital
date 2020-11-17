import { User } from 'model/interfaces/user.interface';
import { ResponseDao } from 'model/interfaces/response.dao.interface';
import {AccountDao} from '../../model/dao/account.dao';
import {UserController} from'./user.controller';
import { Account } from 'model/interfaces/account.interface';
import { UserAccount } from 'model/interfaces/user_account.interface';

export class AccountController extends AccountDao{

    private user:UserController;
    private response:ResponseDao;
    private accounts: [Account];
    private userAccounts:[UserAccount];

    constructor(){
       super();
       this.user = new UserController();
       this.response = { result:false, response:''}; 
    }
    public async createAccountNumber():Promise<string>{
        let number = Math.floor(Math.random() * 10000000).toString();
        let digit = Math.floor(Math.random() * 10).toString();
        let account_number = `${number}-${digit}`;
        let accountExist:ResponseDao = await this.getAccountExist(account_number);
        if(accountExist.result){
            this.createAccountNumber();
        }
        return account_number;
    }
    public async create(
        user:User, 
        account:string ='', 
        agency:string='0001',
        balance:number = 0.00, 
        type:string = 'pf'): Promise<ResponseDao>
    {
        try {
            let userRes:ResponseDao = await this.user.create(user);
            if(userRes && userRes.result){
                let user_id = parseInt(userRes.response);
                if(account==''){
                   account = await this.createAccountNumber();
                }
                let newAccount: Account = {
                    account_number:account,
                    account_agency:agency, 
                    user_id:user_id,
                    account_balance:balance, 
                    account_type:type 
                  };
                  try {
                      let accountRes = this.insert(newAccount);
                      if(accountRes){
                        this.response = {result:true, response:'Create account with sucess!'};
                      }
                  } catch (error) {
                    let res:ResponseDao = await this.user.remove(user_id);
                        console.log(`ERROR On Create Account: ${res.result}`);                            
                        console.log(`ERROR - Account: ${JSON.stringify(error)}`);
                        this.response.result = false;
                        this.response.response = 'We can not create account in this moment';
                        return this.response;
                  }                        
            }else{
                console.log(`Account Controller: ${JSON.stringify(userRes)}`);
                this.response.result   = userRes.result;
                this.response.response = userRes.response;                
                return this.response;
            } 
            
            return this.response;
        } catch (error) {
            console.log(`error on create user for new account: ${error}`);
            this.response.result = false;
            this.response.response = 'We can not create account in this moment';
            return this.response;   
        }
    }

    public async renewBalance(value: number, id: number){
        this.response = { result:false, response:'We cannot update account balance'};
        let balance = await this.updateBalance(value, id); 
        if(balance){
            this.response = {result:true, response:'Account balance update with success'};
        }
        return this.response;
    }

    public async getById(id:number):Promise<ResponseDao>{
        this.response = { result:false, response:'We cannot get account by id: '+id.toString()};
        this.accounts = await this.selectById(id);
        console.log(`accounts: ${JSON.stringify(this.accounts)}`);  
        if(this.accounts && this.accounts.length>0){
            this.response.result=true;
            this.response.response="Get account by id with success";
            this.response.data = this.accounts;
        }
        return this.response;  
    }
    public async getAccountExist(account_number:string):Promise<ResponseDao>{
        this.response = { result:false, response:'Account do not exist'}; 
        let existAccount = await this.checkAccountExist(account_number);
        if(existAccount && existAccount.length >0){
            this.response = {result:true, response:'Account Exist', data:existAccount};
        }
        return this.response;        
    }
    public async getAllAccounts(init:number, limit:number):Promise<ResponseDao>{
        this.response = { result:false, response:'We cannot get accounts'};
        this.userAccounts = await this.selectAll(init,limit);
        if(this.userAccounts && this.userAccounts.length>0){
            this.response.result=true;
            this.response.response=`Get accounts by init:${init} and limit:${limit} with success`;
            this.response.data = this.userAccounts;
        }
        return this.response;  
    }
  
    
}