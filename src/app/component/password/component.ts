import { Component, computed, forwardRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControl, PI_VIEW_FIELD_TOKEN } from '@piying/view-angular';

import { MatIconModule } from '@angular/material/icon';
import { MergeClassPipe } from '@piying-lib/angular-daisyui/pipe';
@Component({
  selector: 'app-password-input',
  templateUrl: './component.html',
  imports: [FormsModule, MatIconModule, MergeClassPipe, MatIconModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputFCC),
      multi: true,
    },
  ],
})
export class PasswordInputFCC extends BaseControl {
  static __version = 2;
  templateRef = viewChild.required('templateRef');

  pendingValue$ = signal('');
  #field$$ = inject(PI_VIEW_FIELD_TOKEN);
  see$ = signal(false);
  type$$ = computed(() => {
    return this.see$() ? 'text' : 'password';
  });
  toggleSee() {
    this.see$.update((a) => !a);
  }
}
