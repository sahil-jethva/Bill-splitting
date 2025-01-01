import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

interface GroupList {
    id: number
    name: string
    participants: string[]
    expenses?: Expense[];
    bgClass?: string
}
interface Expense {
    expense?: number;
    reason?: string;
}
interface User {
    id: number
    name: string
}
@Injectable({
    providedIn: 'root',
})

export class GroupService {
    constructor(private httpClient: HttpClient) { }
    getGroup(): Observable<GroupList[]> {
        return this.httpClient.get<GroupList[]>('http://localhost:3000/groups');
    }
    getUsers(): Observable<User[]> {
        return this.httpClient.get<User[]>('http://localhost:3000/users')
    }
}
