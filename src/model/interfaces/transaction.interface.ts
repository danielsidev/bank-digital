
export interface Transaction{
    transaction_id?: number,
    transaction_origin:string,
    transaction_destiny:string,
    transaction_type: number,
    transaction_value: number,
    transaction_value_original:number,
    transaction_deposit_fee: number,
    transaction_withdrawal_fee: number,
    transaction_type_operation:number,
    transaction_account:number,
    transaction_created_at?:string,
    transaction_updated_at?:string
}