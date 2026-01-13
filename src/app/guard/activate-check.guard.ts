import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalSaveService } from '../service/apikey.service';

export const localStorageGuard: CanActivateFn = () => {
  let apiKey = inject(LocalSaveService);
  const router = inject(Router);
  if (apiKey.key$$()) {
    return true;
  } else {
    // router.navigate(['/login']);
    return false;
  }
};
