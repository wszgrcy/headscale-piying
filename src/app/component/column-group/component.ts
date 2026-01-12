import { Component, computed, inject, input, OnInit, signal, viewChild } from '@angular/core';
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
import { PurePipe } from '@cyia/ngx-common/pipe';
@Component({
  selector: 'app-column-group',
  templateUrl: './component.html',
  imports: [
    EventsDirective,
    AttributesDirective,
    MergeClassPipe,
    MatIconModule,
    SelectorlessOutlet,
    NgTemplateOutlet,
    PurePipe,
  ],
})
export class ArrayGroupFGC extends PiyingViewGroupBase {
  static __version = 2;
  templateRef = viewChild.required('templateRef');
  PiyingView = PiyingView;
  addDefine = input();
  parentPyOptions = inject(PI_INPUT_OPTIONS_TOKEN, { optional: true });
  schemaOptions$$ = computed(() => {
    return {
      schema: this.addDefine() ?? this.field$$().form.control!.config$().groupValueSchema,
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
  });

  modelOutput = (newItem: any) => {
    return {
      modelChange: (value: any) => {
        const index = this.children$$().length;
        this.field$$().action.set(value, index);
        (newItem.componentInstance as PiyingView).form$$()!.reset();
      },
    };
  };
}
