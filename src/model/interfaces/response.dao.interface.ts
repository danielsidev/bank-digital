import {Account} from './account.interface';
import {User} from './user.interface';
import {UserAccount} from './user_account.interface';
import {Transaction} from './transaction.interface';
export interface ResponseDao{
    result: boolean,
    response:string,
    data?:any
}