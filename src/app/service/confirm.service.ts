import { Injectable, signal } from '@angular/core';

export interface AlertItem {
  id: number;
  title: string;
  message: string;
  buttons: {
    label: string;
    class?: string;
    close?: () => Promise<any>;
  }[];
  close: (value: any) => Promise<any>;
  modal?: boolean;
}
const Undefined$$ = Promise.resolve(undefined);
@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  readonly #list$ = signal<AlertItem[]>([]);
  private nextId = 0;

  list$$ = this.#list$.asReadonly();

  open(options: Omit<AlertItem, 'id' | 'close'>) {
    const id = this.nextId++;
    const p = Promise.withResolvers();
    this.#addToList({
      ...options,
      id,
      close: async (index: number | undefined) => {
        (index === undefined
          ? Undefined$$
          : options.buttons[index].close
            ? options.buttons[index].close()
            : Undefined$$
        ).then((value) => {
          p.resolve(value);
          this.remove(id);
        });
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
