import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieStorageService } from '../services/cookie-storage-service';
import { SpotifyLoginService } from '../services/spotify-api/spotify-login-service';
import { catchError, switchMap, throwError } from 'rxjs';

export const addAuthHeaderInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {

  if (req.url.includes('api.spotify.com/v1')) {  
    const _cookieService: CookieStorageService = inject(CookieStorageService);
    const _loginService: SpotifyLoginService = inject(SpotifyLoginService);

    if (!_cookieService.isCookieValid('access_token')) {
      console.log('Token inválido, renovando...');
      
      return _loginService.getToken().pipe(
        switchMap(() => {
          const access_token = _cookieService.getCookieValue('access_token');
          
          const reqWHeaders = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${access_token}`),
          });
          
          console.log('Token renovado, continuando con la petición');
          return next(reqWHeaders);
        }),
        catchError(error => {
          console.error('Error al renovar token:', error);
          return throwError(() => error);
        })
      );
    }

    const access_token = _cookieService.getCookieValue('access_token');

    const reqWHeaders = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${access_token}`),
    });

    return next(reqWHeaders);
  }
  
  return next(req);
};
