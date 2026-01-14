import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { LocalSaveService } from '../service/local-save.service';

export const localStorageGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
  const apiKey = inject(LocalSaveService);
  const router = inject(Router);
  if (state.url === '/login') {
    return true;
  }

  if (apiKey.key$$()) {
    return true;
  } else {
    return router.createUrlTree(['/login']);
  }
};
