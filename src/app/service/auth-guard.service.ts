import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageTokenService } from './localStorageToken.service';
import { StorageKeys } from '../Enums/enum';


@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(private router: Router,private localStorageService:LocalStorageTokenService) { }
    canActivate() {
        const token = localStorage.getItem(StorageKeys.TOKEN)
        if (token) {
            this.router.navigate(['/Home'])
            return false
        }
        return true
    }
}
