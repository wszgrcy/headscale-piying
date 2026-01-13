import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { catchError, tap } from 'rxjs';
import { ApiKeyService } from './apikey.service';
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  router = inject(Router);
  http = inject(HttpClient);
  api = inject(ApiService);
  apiKey = inject(ApiKeyService);
  login(data: any) {
    this.apiKey.set(data.apiKey);
    return this.api.Health().subscribe({
      next: () => {
        return this.router.navigateByUrl('/web/user');
      },
      error: () => {
        this.apiKey.clear();
      },
    });
  }
}
