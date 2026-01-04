import { computed, Injectable, linkedSignal } from '@angular/core';
const KEY = 'apikey';
@Injectable({
  providedIn: 'root',
})
export class ApiKeyService {
  #key$ = linkedSignal(
    computed(() => {
      return (typeof localStorage !== 'undefined' && localStorage.getItem(KEY)) ?? undefined;
    })
  );
  key$$ = this.#key$.asReadonly();
  set(value: string) {
    this.#key$.set(value);
    localStorage.setItem(KEY, value);
  }
  clear() {
    this.#key$.set(undefined);
    localStorage.removeItem(KEY);
  }
}
