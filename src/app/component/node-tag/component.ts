import { Component, effect, forwardRef, input, signal } from '@angular/core';
import { BaseControl } from '@piying/view-angular';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
@Component({
  selector: 'node-tag',
  templateUrl: './component.html',
  imports: [MatIconModule, FormsModule],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NodeTagFCC), multi: true },
  ],
})
export class NodeTagFCC extends BaseControl {
  isAddEdit$ = signal(false);
  editContent = signal('');
  addNew() {
    let list: string[] = this.value$() ?? [];
    let item = `tag:${this.editContent()}`;
    if (!list.includes(item)) {
      list.push(item);
      this.valueAndTouchedChange(list);
    }
    this.editContent.set('');
    this.isAddEdit$.set(false);
  }
  removeItem(index: number) {
    let list: string[] = this.value$();
    list.splice(index, 1);
    this.valueAndTouchedChange(list);
  }
}
