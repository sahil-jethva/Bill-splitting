import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { LocalStorageTokenService } from '../../service/localStorageToken.service';

@Component({
    selector: 'app-logout',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './logout.component.html',
    styleUrl: './logout.component.scss'
})
export class LogoutComponent {

    // isToggled
    isToggled = false;

    constructor(
        public themeService: CustomizerSettingsService, private localStorageService: LocalStorageTokenService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    logout() {
        this.localStorageService.removeToken()
        console.log('user logged out');
    }

}
