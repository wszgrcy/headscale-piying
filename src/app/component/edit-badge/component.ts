import { Component, forwardRef, linkedSignal, signal, viewChild } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControl } from '@piying/view-angular';

import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-editable-badge',
  templateUrl: './component.html',
  imports: [FormsModule, MatIconModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditableBadgeFCC),
      multi: true,
    },
  ],
})
export class EditableBadgeFCC extends BaseControl {
  static __version = 2;
  templateRef = viewChild.required('templateRef');
  isEdit$ = signal(false);
  editContent$ = linkedSignal(this.value$);

  valueChange2() {
    this.isEdit$.set(false);
    this.valueChange(this.editContent$());
    this.editContent$.set('');
  }
}
