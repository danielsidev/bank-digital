import { ResponseDao } from 'model/interfaces/response.dao.interface';
import {UserDao} from '../../model/dao/user.dao';
import {User} from '../../model/interfaces/user.interface';

export class UserController extends UserDao{

    private users:[User];
    private response:ResponseDao;

    constructor(){
        super();
        this.response = {result:false, response:''};
    }

    public async create(user:User):Promise<ResponseDao>{
        this.response = {result:false, response:'We need of the cpf and fullname'};
        if(!!user.user_cpf && !!user.user_fullname){
            this.response = {result:false, response:'User already exists', data:null};
            this.users = await this.selectByCpf(user.user_cpf);
            if(!this.users.length){
                let inserted = await this.insert(user);
                this.response = {result:true, response:inserted.toString(), data:inserted.toString()};   
            }
        }
        return this.response;
    }

    public async getByCpf(cpf:string):Promise<[User]>{
        this.users = await  this.selectByCpf(cpf);
        return this.users;
    }

    public async getAll(int:number, limit: number):Promise<[User]>{
        this.users = await this.selectAll(int, limit);
        return this.users;
    }

    public async remove(user_id: number):Promise<ResponseDao>{
        this.response = {result:false, response:'We can not to remove the user'};   
        if(user_id){
            let removed = await this.delete(user_id);
            if(removed>0){
                this.response = {result:true, response:'User removed with success'};   
            }else{
                this.response = {result:false, response:'We can not to remove the user'};   
            }            
        }
        return this.response;
    }
    
}

// let user = {"user_fullname":"Daniel ", "user_cpf":"110.356.737-73"}
// let u = new UserController();

// try {
//     u.create(user).then((res)=>{
//       console.log(`Created: ${JSON.stringify(res)}`);
//     });
    
// } catch (error) {
//     console.log(`error: ${error}`);
// }