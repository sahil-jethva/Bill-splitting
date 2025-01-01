import { Routes } from '@angular/router';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { LogoutComponent } from './authentication/logout/logout.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { FrontPagesComponent } from './front-pages/front-pages.component';
import { HomeComponent } from './front-pages/home/home.component';
import { FeaturesComponent } from './front-pages/features/features.component';
import { FaqComponent } from './front-pages/faq/faq.component';
import { AuthGuardService } from './service/auth-guard.service';
import { ProtectedAuthGuardService } from './service/protected-auth-guard.service';
import { SplitBillComponent } from './front-pages/split-bill/split-bill.component';
import { ShowGroupComponent } from './front-pages/show-group/show-group.component';

export const routes: Routes = [
    {path: '', component: SignInComponent,canActivate: [AuthGuardService]},
    { path: 'Register', component: SignUpComponent },
    { path: 'Group', component: FeaturesComponent, canActivate: [ProtectedAuthGuardService] },
    { path: 'Group/:id', component: ShowGroupComponent, canActivate: [ProtectedAuthGuardService] },
    { path: 'Home', component: HomeComponent, canActivate: [ProtectedAuthGuardService]},
    { path: 'SplitBill', component: SplitBillComponent },
    { path: 'SplitBill/:id', component: SplitBillComponent },
    {path: 'logout', component: LogoutComponent},

    {
        path: '',
        component: FrontPagesComponent,
        // canActivateChild: [AuthGuardService],
        children: [
            // {path: '', component: HomeComponent},
            // {path: 'features', component: FeaturesComponent,canActivate:[AuthGuardService]}
            {path: 'faq', component: FaqComponent}
        ]
    },
    // Here add new pages component

    {path: '**', component: NotFoundComponent} // This line will remain down from the whole pages component list
];
