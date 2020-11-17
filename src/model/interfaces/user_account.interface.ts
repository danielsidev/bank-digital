import { User } from "./user.interface";
import { Account } from "./account.interface";

export interface UserAccount{
    user_id?: number,
    user_fullname:string,
    user_cpf:string,
    account_id?: number,
    account_number:string,
    account_agency:string,
    account_balance: number,
    account_type:string
}