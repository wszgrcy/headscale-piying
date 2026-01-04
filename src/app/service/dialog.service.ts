import { inject, Injectable } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { PiDialogContainer } from '../component/dialog/component';
import { FieldGlobalConfig } from '../define';
import * as v from 'valibot';
@Injectable({
  providedIn: 'root',
})
export class DialogService {
  #dialog = inject(Dialog);
  #options = {
    fieldGlobalConfig: FieldGlobalConfig,
  };

  openDialog<T extends v.BaseSchema<any, any, any>>(data: {
    title: string;
    schema: T;
    applyValue?: (value: v.InferOutput<T>) => Promise<any>;
  }) {
    return this.#dialog.open(PiDialogContainer, {
      data: { ...data, options: this.#options },
      maxHeight: '80%',
    });
  }
}
