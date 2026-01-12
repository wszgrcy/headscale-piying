import {
  Component,
  computed,
  forwardRef,
  inject,
  input,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControl, PI_VIEW_FIELD_TOKEN, PiyingView } from '@piying/view-angular';

import { StrOrTemplateComponent } from '@piying-lib/angular-core';
import { fieldControlStatusClass } from '@piying/view-angular-core';
import { summarize } from 'valibot';
import { MatIconModule } from '@angular/material/icon';
import { MergeClassPipe } from '@piying-lib/angular-daisyui/pipe';
@Component({
  selector: 'app-editable-badge',
  templateUrl: './component.html',
  imports: [FormsModule, MatIconModule, MergeClassPipe],
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
