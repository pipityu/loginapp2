import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {


  constructor(public authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('loginapp/auth')) {
      return next.handle(request);
   }
    const modrequest = request.clone({
      headers:request.headers.set("Authorization", "Bearer "+localStorage.getItem('token')),
      setHeaders:{"X-Requested-With": "XMLHttpRequest"},
      withCredentials:true,
    });
    return next.handle(modrequest);
  }
}
