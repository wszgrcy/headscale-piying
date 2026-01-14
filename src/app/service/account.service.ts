import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { catchError, firstValueFrom, tap } from 'rxjs';
import { LocalSaveService } from './local-save.service';
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  router = inject(Router);
  http = inject(HttpClient);
  api = inject(ApiService);
  apiKey = inject(LocalSaveService);
  login(data: { apiKey: string; prefix?: string }) {
    this.apiKey.setKey(data.apiKey);
    if (data.prefix) {
      this.apiKey.setPrefix(data.prefix);
    }
    return firstValueFrom(this.api.Health())
      .then(() => {
        return this.router.navigateByUrl('/web/user');
      })
      .catch(() => {
        this.apiKey.clearKey();
      });
  }
  logout() {
    this.apiKey.clearKey();
    return this.router.navigateByUrl('/web/login');
  }
}
