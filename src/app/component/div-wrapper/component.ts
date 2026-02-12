import { Component, viewChild } from '@angular/core';
import { AttributesDirective, EventsDirective, InsertFieldDirective } from '@piying/view-angular';

@Component({
  selector: 'app-div',
  template: `<ng-template #templateRef let-attr="attributes" let-events="events">
    <div [attributes]="attr()" [events]="events()"><ng-container insertField></ng-container></div>
  </ng-template>`,
  imports: [AttributesDirective, InsertFieldDirective, EventsDirective],
})
export class DivWC {
  static __version = 2;
  templateRef = viewChild.required('templateRef');
}
