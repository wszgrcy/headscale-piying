import { Component, forwardRef, signal } from '@angular/core';
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
    const list: string[] = this.value$() ?? [];
    const item = `tag:${this.editContent()}`;
    if (!list.includes(item)) {
      list.push(item);
      this.valueAndTouchedChange(list);
    }
    this.editContent.set('');
    this.isAddEdit$.set(false);
  }
  removeItem(index: number) {
    const list: string[] = this.value$();
    list.splice(index, 1);
    this.valueAndTouchedChange(list);
  }
}
