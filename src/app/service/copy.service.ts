import { inject, Injectable } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

@Injectable({
  providedIn: 'root',
})
export class CopyService {
  #clipboard = inject(Clipboard);

  copy(content: string) {
    return this.#clipboard.copy(content);
  }
}
