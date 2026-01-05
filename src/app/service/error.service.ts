import { ErrorHandler, inject, Injectable } from '@angular/core';
import { ToastService } from './toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  #toast = inject(ToastService);

  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      this.#toast.add(`${JSON.stringify(error.error)}\n${error.message}`, { type: 'error' });
    }
  }
}
