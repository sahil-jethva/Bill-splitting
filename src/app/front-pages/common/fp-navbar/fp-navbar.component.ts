import { NgClass } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { UserLoginDetail } from '../../../modals/modal';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-fp-navbar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, NgClass],
    templateUrl: './fp-navbar.component.html',
    styleUrl: './fp-navbar.component.scss'
})
export class FpNavbarComponent implements OnInit {
    constructor(
        public themeService: CustomizerSettingsService,
        private httpClient: HttpClient
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }
    // Toggle Class
    classApplied = false;
    toggleClass() {
        this.classApplied = !this.classApplied;
    }
    details: UserLoginDetail | null | undefined = null;
    ngOnInit(): void {
        this.userLoggedInDetail()
    }
    userLoggedInDetail() {
        const url = 'http://localhost:3000/me'
        this.httpClient.get<{ user: UserLoginDetail }>(url).subscribe(
            (res) => {
                this.details = res.user
            }
        )
    }
    gi(para: string | undefined) {
        const img = `https://avatar.iran.liara.run/public/boy?username=${para}`
        return img
    }
    // Navbar Sticky
    isSticky: boolean = false;
    @HostListener('window:scroll', ['$event'])
    checkScroll() {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (scrollPosition >= 50) {
            this.isSticky = true;
        } else {
            this.isSticky = false;
        }
    }

    // isToggled
    isToggled = false;



}
