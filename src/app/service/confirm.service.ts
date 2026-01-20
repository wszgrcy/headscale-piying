import { Injectable, signal } from '@angular/core';

export interface AlertItem {
  id: number;
  title: string;
  message: string;
  close: (value: any) => Promise<any>;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  readonly #list$ = signal<AlertItem[]>([]);
  private nextId = 0;

  list$$ = this.#list$.asReadonly();

  open(options: Omit<AlertItem, 'id' | 'close'>) {
    const id = this.nextId++;
    let p = Promise.withResolvers();
    this.#addToList({
      ...options,
      id,
      close: async (value) => {
        p.resolve(value);
        this.remove(id);
      },
    });

    return p.promise;
  }
  #addToList(item: AlertItem) {
    this.#list$.update((current) => [...current, item]);
  }

  remove(id: number): void {
    this.#list$.update((current) => current.filter((item) => item.id !== id));
  }
}
