import { computed, Injectable, linkedSignal } from '@angular/core';
const KEY = '__apikey';
const Prefix = '__prefix';
@Injectable({
  providedIn: 'root',
})
export class LocalSaveService {
  #key$ = linkedSignal(
    computed(() => {
      return typeof localStorage !== 'undefined'
        ? (localStorage.getItem(KEY) ?? undefined)
        : undefined;
    }),
  );
  #prefix$ = linkedSignal(
    computed(() => {
      let saved =
        typeof localStorage !== 'undefined'
          ? (localStorage.getItem(Prefix) ?? undefined)
          : undefined;
      return saved;
    }),
  );
  key$$ = this.#key$.asReadonly();
  prefix$$ = computed(() => {
    return this.#prefix$() ?? '';
  });
  setKey(value: string) {
    this.#key$.set(value);
    localStorage.setItem(KEY, value);
  }
  clearKey() {
    this.#key$.set(undefined);
    localStorage.removeItem(KEY);
  }
  setPrefix(value: string) {
    this.#prefix$.set(value);
    localStorage.setItem(Prefix, value);
  }
  clearPrefix() {
    this.#prefix$.set(undefined);
    localStorage.removeItem(Prefix);
  }
}
