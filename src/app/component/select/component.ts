import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { BaseControl, AttributesDirective } from '@piying/view-angular';
import { MergeClassPipe } from '@piying-lib/angular-daisyui/pipe';
export interface DaisyuiOption {
  label: string;
  value: any;
  class?: string;
  type?: string;
}
@Component({
  selector: 'dai-select',
  templateUrl: './component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditableSelectFCC),
      multi: true,
    },
  ],
  imports: [
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    MatIconModule,
    FormsModule,
    NgTemplateOutlet,
    NgClass,
    NgStyle,
    AttributesDirective,
    MergeClassPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableSelectFCC<T> extends BaseControl {
  static __version = 2;
  templateRef = viewChild.required('templateRef');
  valueToDisplay = input((a: any) => a);
  options = input<T[]>();
  /** can input value instanof select */
  inputEnable = input<boolean>();
  filterEnable = input<boolean>();
  inputPlaceholder = input<string>('Search...');
  filterFn = input<(list: any[], filterContent: string) => any[]>((list, filterContent) => {
    filterContent = filterContent.toLowerCase();
    return list.filter((item) => {
      if (item && typeof item === 'object' && 'label' in item) {
        return `${item.label}`.toLowerCase().includes(filterContent);
      }
      return `${item}`.toLowerCase().includes(filterContent);
    });
  });
  optionTemplate = input<TemplateRef<any>>();
  triggerTemplate = input<TemplateRef<any>>();
  maxHeight = input<string>('300px');
  selectedOption$$ = computed(() => {
    return (
      this.resolvedOptions$$().find((item) => item.value === this.value$()) ||
      (this.inputEnable() ? this.inputOption$$() : undefined)
    );
  });
  selectedLabel$$ = computed(() => {
    return this.selectedOption$$()?.label ?? '';
  });
  inputOption$$ = computed(() => {
    const options = this.showOptions$$();
    const value = this.value$()?.trim();
    if (!value || options.some((item) => item.value === this.value$())) {
      return undefined;
    }
    return {
      label: value,
      value: value,
      type: 'input',
    } as DaisyuiOption;
  });
  resolvedOptions$$ = computed<DaisyuiOption[]>(() => {
    const options = this.options() ?? [];
    return options.map((item: any) => {
      return item && typeof item === 'object' && 'label' in item && 'value' in item
        ? item
        : { label: item, value: item };
    });
  });
  showOptions$$ = computed(() => {
    const options = this.resolvedOptions$$();
    const content = this.inputContent$().trim();
    if (!content) {
      return options;
    }
    return this.filterFn()(options, content);
  });
  inputContent$ = signal('');
  ulStyle$$ = computed(() => {
    if (!this.maxHeight()) {
      return;
    }
    return {
      'max-height': this.maxHeight(),
    };
  });
  addInputOption() {
    this.valueChange(this.inputContent$());
    this.inputContent$.set('');
  }

  stopKeyboardListen(event: KeyboardEvent) {
    event.stopPropagation();
  }
}
