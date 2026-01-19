import { Component, inject, input, signal, viewChild, WritableSignal } from '@angular/core';
import { PiyingViewGroupBase, PiyingView, PI_INPUT_OPTIONS_TOKEN } from '@piying/view-angular';
import { MatIconModule } from '@angular/material/icon';
import { SelectorlessOutlet } from '@cyia/ngx-common/directive';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurePipe } from '@cyia/ngx-common/pipe';
@Component({
  selector: 'app-row-group',
  templateUrl: './component.html',
  imports: [MatIconModule, SelectorlessOutlet, NgTemplateOutlet, FormsModule, PurePipe],
})
export class EditGroupFGC extends PiyingViewGroupBase {
  static __version = 2;
  templateRef = viewChild.required('templateRef');
  PiyingView = PiyingView;
  defaultValue = input<(index: number) => any>();
  newKey$ = signal(undefined);
  newValue$ = signal(undefined);
  parentPyOptions = inject(PI_INPUT_OPTIONS_TOKEN, { optional: true });
  schemaOptions$$ = (define: any) => {
    return {
      schema: define,
      options: {
        ...this.parentPyOptions!(),
        context: {
          ...this.parentPyOptions!().context,
        },
      },
      selectorless: true,
    };
  };
  addNew(keyF: SelectorlessOutlet<PiyingView>, valueF: SelectorlessOutlet<PiyingView>) {
    this.field$$().action.set(this.newValue$(), this.newKey$());
    keyF.componentInstance!.form$$()!.root.reset();
    valueF.componentInstance!.form$$()!.root.reset();
  }

  removeItem(key: string) {
    this.field$$().action.remove(key);
  }
  modelOutput(input: WritableSignal<any>) {
    return {
      modelChange: (value: any) => {
        input.set(value);
      },
    };
  }
}
