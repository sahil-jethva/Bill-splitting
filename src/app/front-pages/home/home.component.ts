import { Component } from '@angular/core';
import { FpCtaComponent } from '../common/fp-cta/fp-cta.component';
import { FpNavbarComponent } from '../common/fp-navbar/fp-navbar.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [ FpCtaComponent,FpNavbarComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {}
