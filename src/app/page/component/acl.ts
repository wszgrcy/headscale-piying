import * as v from 'valibot';
import { hideWhen, NFCSchema, setAlias, setComponent } from '@piying/view-angular-core';
import { computed } from '@angular/core';
import { actions } from '@piying/view-angular';
import { firstValueFrom, map, startWith, Subject } from 'rxjs';
import { ExpandRowDirective, TableStatusService } from '@piying-lib/angular-daisyui/extension';
import { ApiService } from '../../service/api.service';
import { ListUsersRes } from '../../../api/type';
import { ApiKey } from '../../../api/item.type';
import { DialogService } from '../../service/dialog.service';
import { requestLoading } from '../../util/request-loading';
import { formatDatetimeToStr } from '../../util/time-to-str';
export const ACLPageDefine = v.object({
  editor: v.pipe(
    v.string(),
    setComponent('acl-text-editor'),
    actions.class.component('h-100'),
    actions.hooks.merge({
      allFieldsResolved: async (field) => {
        let api = field.context['api'] as ApiService;
        let value = await firstValueFrom(api.GetPolicy());
        console.log(value);
      },
    })
  ),
  bottom: v.pipe(
    v.object({
      submit: v.pipe(
        NFCSchema,
        setComponent('input-button'),
        actions.inputs.patch({ type: 'submit' })
      ),
    })
  ),
});
