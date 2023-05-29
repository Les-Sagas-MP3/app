/// <reference types="@angular/localize" />

import { APP_INITIALIZER, enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

import { JwtInterceptor } from './app/interceptors/jwt.interceptor';
import { ConfigService } from './app/services/config/config.service';

const appConfig = (config: ConfigService) => {
  return () => {
    return config.loadConfig();
  };
};

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot({})),
    importProvidersFrom(HttpClientModule),
    provideRouter(routes),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: appConfig,
      multi: true,
      deps: [ConfigService],
    }
  ],
});
