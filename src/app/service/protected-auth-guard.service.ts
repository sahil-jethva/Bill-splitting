import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageTokenService } from './localStorageToken.service';

@Injectable({
  providedIn: 'root'
})
export class ProtectedAuthGuardService implements CanActivate {

    constructor(private router: Router, private localStorageService: LocalStorageTokenService) { }
    canActivate() {
        const token = this.localStorageService.getToken()
        if (!token) {
            this.router.navigate([''])
            return false
        }
        return true
    }

}
