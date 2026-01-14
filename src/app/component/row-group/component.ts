import { Component, input, viewChild } from '@angular/core';
import { PiyingViewGroupBase, PiyingView } from '@piying/view-angular';
import { MatIconModule } from '@angular/material/icon';
import { NgTemplateOutlet } from '@angular/common';
@Component({
  selector: 'app-row-group',
  templateUrl: './component.html',
  imports: [MatIconModule, NgTemplateOutlet],
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
