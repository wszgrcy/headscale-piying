import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { PiyingView } from '@piying/view-angular';

@Component({
  templateUrl: './component.html',
  imports: [PiyingView],
})
export class PiDialogContainer {
  ref = inject(DialogRef);
  data = inject(DIALOG_DATA);
  changedValue = signal(this.data.value);
  loading$ = signal(false);

  async apply() {
    this.loading$.set(true);
    try {
      const result = await this.data.applyValue(this.changedValue());
      this.ref.close(result);
    } catch (error) {
      throw error;
    } finally {
      this.loading$.set(false);
    }
  }
  close() {
    this.ref.close();
  }
  modelChange(value: any) {
    this.changedValue.set(value);
  }
}
