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
  ],
})
export class RowGroupFGC extends PiyingViewGroupBase {
  static __version = 2;
  templateRef = viewChild.required('templateRef');
  PiyingView = PiyingView;
  defaultValue = input<(index: number) => any>();

  addNew() {
    const index = this.children$$().length;
    this.field$$().action.set(this.defaultValue()?.(index), index);
  }
}
