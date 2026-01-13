import {
  Component,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  BaseControl,
  PI_INPUT_OPTIONS_TOKEN,
  PI_VIEW_FIELD_TOKEN,
  PiyingView,
} from '@piying/view-angular';
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
import {
  CdkMenu,
  CdkMenuBar,
  CdkMenuGroup,
  CdkMenuItem,
  CdkMenuItemCheckbox,
  CdkMenuItemRadio,
  CdkMenuTrigger,
} from '@angular/cdk/menu';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import * as v from 'valibot';
import { formConfig } from '@piying/view-angular-core';
type a = ConnectedPosition;
@Component({
  selector: 'app-source-list',
  templateUrl: './component.html',
  imports: [
    FormsModule,
    NgTemplateOutlet,
    SelectorlessOutlet,
    PurePipe,
    AsyncPipe,
    CdkMenu,
    CdkMenuTrigger,
    CdkMenuItem,
    MatIconModule,
    CdkMenuItem,
    CdkMenuTrigger,
    CdkMenu,
  ],
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
  usePort = input(false);
  hostValue$ = signal('');
  #portValue$ = signal('');
  root$$ = computed<SourceOption>(() => {
    return {
      children: this.options(),
    };
  });
  optionInput = (content: any) => {
    return {
      content: signal(content),
    };
  };
  selectOption(item: SourceOption) {
    this.hostValue$.set(item.value!);
  }
  constructor() {
    super();
    effect(() => {
      let value = this.hostValue$();
      if (this.usePort()) {
        let portValue = this.#portValue$();
        if (value && portValue) {
          this.valueAndTouchedChange(`${value}:${portValue}`);
        }
      } else {
        if (value) {
          this.valueAndTouchedChange(value);
        }
      }
    });
  }
  parentPyOptions = inject(PI_INPUT_OPTIONS_TOKEN, { optional: true });
  field$$ = inject(PI_VIEW_FIELD_TOKEN);
  getInput$$ = (schema: v.BaseSchema<any, any, any>) => {
    return {
      schema: v.pipe(
        v.tuple([v.pipe(schema, formConfig({ updateOn: 'change' }))]),
        formConfig({ updateOn: 'submit' }),
      ),
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
    } as any;
  };
  modelOutput = (option: SourceOption) => {
    return {
      modelChange: ([value]: any) => {
        let emitValue = option.prefix ? `${option.prefix}${value}` : value;
        this.hostValue$.set(emitValue);
      },
    };
  };
  activateClass = (a: any, b: any) => {
    return a === b ? 'menu-active' : '';
  };
  listContenxt(list: any, parent?: any) {
    return { list: list, parent };
  }
  submitPort(value: any) {
    this.#portValue$.set(value);
  }
}
