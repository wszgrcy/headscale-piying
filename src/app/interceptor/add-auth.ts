import { inject } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiKeyService } from '../service/apikey.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let apikey = inject(ApiKeyService);
  const url = req.url;

  if (url.startsWith(environment.prefix)) {
    const modifiedReq = req.clone({
      headers: req.headers.append('authorization', `Bearer ${apikey.key$$()}`),
    });
    return next(modifiedReq);
  }
  return next(req);
};
