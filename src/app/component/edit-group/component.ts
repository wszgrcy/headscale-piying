import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { ThemeService } from '@piying-lib/angular-daisyui/service';
import {
  EventsDirective,
  AttributesDirective,
  PiyingViewGroupBase,
  PiyingView,
  PI_INPUT_OPTIONS_TOKEN,
} from '@piying/view-angular';
import { MergeClassPipe } from '@piying-lib/angular-daisyui/pipe';
import { MatIconModule } from '@angular/material/icon';
import { SelectorlessOutlet } from '@cyia/ngx-common/directive';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurePipe } from '@cyia/ngx-common/pipe';
@Component({
  selector: 'app-row-group',
  templateUrl: './component.html',
  imports: [
    EventsDirective,
    AttributesDirective,
    MergeClassPipe,
    MatIconModule,
    SelectorlessOutlet,
    NgTemplateOutlet,
    FormsModule,
    PurePipe,
  ],
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
          parent: this.field$$(),
          parentCtx: this.parentPyOptions!().context,
          root: this.parentPyOptions!().context?.['root'] ?? this.field$$(),
          rootCtx: this.parentPyOptions!().context?.['rootCtx'] ?? this.parentPyOptions!().context,
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
