import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { customInterceptor } from './interceptor/custom.interceptor';
import { AuthGuardService } from './service/auth-guard.service';
import { GroupService } from './service/groups.service';
import { ProtectedAuthGuardService } from './service/protected-auth-guard.service';
import { LocalStorageTokenService } from './service/localStorageToken.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideClientHydration(),
        provideAnimationsAsync(),
        provideHttpClient(withInterceptors([customInterceptor])),
        AuthGuardService,
        GroupService,
        ProtectedAuthGuardService,
        LocalStorageTokenService
    ]
};
