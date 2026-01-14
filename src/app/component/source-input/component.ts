import { Component, computed, forwardRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControl, PI_VIEW_FIELD_TOKEN } from '@piying/view-angular';

import { fieldControlStatusClass } from '@piying/view-angular-core';
import { summarize } from 'valibot';
import { MatIconModule } from '@angular/material/icon';
import { MergeClassPipe } from '@piying-lib/angular-daisyui/pipe';
@Component({
  selector: 'app-source-input',
  templateUrl: './component.html',
  imports: [FormsModule, MatIconModule, MergeClassPipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SourceInputFCC),
      multi: true,
    },
  ],
})
export class SourceInputFCC extends BaseControl {
  static __version = 2;
  templateRef = viewChild.required('templateRef');

  pendingValue$ = signal('');
  #field$$ = inject(PI_VIEW_FIELD_TOKEN);
  errorStr$$ = computed(() => {
    const field = this.#field$$();
    const valibot = field.form.control!.errors!['valibot'];
    if (valibot) {
      return summarize(valibot);
    } else {
      return Object.values(field.form.control!.errors!)
        .map((item) => (typeof item === 'string' ? item : JSON.stringify(item)))
        .join('\n');
    }
  });

  submit() {
    this.#field$$().form.root.emitSubmit();
  }
  classStatus$$ = computed(() => fieldControlStatusClass(this.#field$$().form.control));
  isError$$ = computed(() => {
    const control = this.#field$$().form.control!;
    return control.invalid;
  });
}
