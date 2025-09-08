import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { provideZonelessChangeDetection } from '@angular/core';
import { authInterceptor } from './app/core/auth/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthSessionService } from './app/core/auth/auth-session.service';

import { provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    AuthSessionService,
    provideEchartsCore({ echarts })
  ]
}).catch(err => console.error(err));
