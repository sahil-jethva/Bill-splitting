export interface GroupList {
    id: number;
    participants: string[];
    name: string;
    bgClass?: string;
    expenses?: Expense[];
}
export interface Expense {
    expense?: number;
    reason?: string;
    perHead?: PerHead[]
}
export interface User {
    id: number
    name: string
}
export interface PerHead {
    name?: string
    amount?: number
    isPaid?: boolean
}
export interface UserLoginDetail {
    id: number
    email: string
    password: number
    name: string
    role: string
}
export interface Token{
    token: string
    user:UserLoginDetail
}
