import { computed, inject, Injectable } from '@angular/core';
import { PI_VIEW_FIELD_TOKEN } from '@piying/view-angular';
import { AclSourceService } from '../../../service/acl-source.service';

@Injectable()
export class AclService {
  #field$$ = inject(PI_VIEW_FIELD_TOKEN);
  #aclSource = inject(AclSourceService);

  groups$$ = computed(() => {
    let value = this.#field$$().get(['groups'])!.form.control!.value$$();
    return Object.keys(value).map((value) => {
      return {
        label: value.slice('group:'.length),
        value: value,
      };
    });
  });
  user$$ = computed(() => {
    return this.#aclSource.user$.value();
  });
}
