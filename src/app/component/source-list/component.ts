import { Component, forwardRef, inject, input, signal, viewChild } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControl, PI_INPUT_OPTIONS_TOKEN, PiyingView } from '@piying/view-angular';
import {
  DefaultOptionConvert,
  OptionConvert,
  ResolvedOption,
  SelectOption,
  transformOption,
} from '@piying-lib/angular-core';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { StrOrTemplateComponent } from '@piying-lib/angular-core';
import { SelectorlessOutlet } from '@cyia/ngx-common/directive';
import { PurePipe } from '@cyia/ngx-common/pipe';
import { SourceOption } from './type';
@Component({
  selector: 'app-source-list',
  templateUrl: './component.html',
  imports: [FormsModule, NgTemplateOutlet, SelectorlessOutlet, PurePipe, AsyncPipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SourceListFCC),
      multi: true,
    },
  ],
})
export class SourceListFCC extends BaseControl {
  static __version = 2;
  readonly StrOrTemplateComponent = StrOrTemplateComponent;
  readonly PiyingView = PiyingView;

  templateRef = viewChild.required('templateRef');
  options = input<SourceOption[], SourceOption[] | undefined>([], {
    transform: (input) => input ?? [],
  });

  optionInput = (content: any) => {
    return {
      content: signal(content),
    };
  };
  selectOption(item: SourceOption) {
    this.valueAndTouchedChange(item.value);
  }

  parentPyOptions = inject(PI_INPUT_OPTIONS_TOKEN, { optional: true });
  getInput$$ = (schema: any) => {
    return {
      schema: schema,
      options: this.parentPyOptions!,
      selectorless: true,
    } as any;
  };
  modelOutput = (option: SourceOption) => {
    return {
      modelChange: (value: any) => {
        console.log(option, value);
      },
    };
  };
  activateClass = (a: any, b: any) => {
    return a === b ? 'menu-active' : '';
  };
}

