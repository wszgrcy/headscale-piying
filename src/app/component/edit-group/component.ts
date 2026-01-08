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
  newKey$ = signal('');
  newValue$ = signal('');
  parentPyOptions = inject(PI_INPUT_OPTIONS_TOKEN, { optional: true });
  schemaOptions$$ = (define: any) => {
    return {
      schema: define,
      options: this.parentPyOptions!(),
      selectorless: true,
    };
  };
  addNew() {
    this.field$$().action.set(this.newValue$(), this.newKey$());
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
