import { Component, viewChild } from '@angular/core';
import { AttributesDirective, InsertFieldDirective } from '@piying/view-angular';

@Component({
  selector: 'app-div',
  template: `<ng-template #templateRef let-attr="attributes">
    <div [attributes]="attr()"><ng-container insertField></ng-container></div>
  </ng-template>`,
  imports: [AttributesDirective, InsertFieldDirective],
})
export class DivWC {
  static __version = 2;
  templateRef = viewChild.required('templateRef');
}
