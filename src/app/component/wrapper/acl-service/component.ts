import { Component, inject, viewChild } from '@angular/core';
import { InsertFieldDirective, PI_VIEW_FIELD_TOKEN } from '@piying/view-angular';

import { AclService } from './service';
@Component({
  selector: 'app-acl-service-wrapper',
  templateUrl: './component.html',
  imports: [InsertFieldDirective],
  providers: [AclService],
})
export class AclServiceWC {
  static __version = 2;
  templateRef = viewChild.required('templateRef');
  #field$$ = inject(PI_VIEW_FIELD_TOKEN);
  #service = inject(AclService);
  constructor() {
    this.#field$$().props.update((value) => {
      return {
        ...value,
        service: this.#service,
      };
    });
  }
}
