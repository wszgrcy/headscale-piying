import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LocalSaveService } from '../service/local-save.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apikey = inject(LocalSaveService);
  const url = req.url;

  if (url.startsWith(environment.prefix)) {
    const modifiedReq = req.clone({
      headers: req.headers.append('authorization', `Bearer ${apikey.key$$()}`),
    });
    return next(modifiedReq);
  }
  return next(req);
};
