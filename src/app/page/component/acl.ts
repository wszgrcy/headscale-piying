import * as v from 'valibot';
import {
  _PiResolvedCommonViewFieldConfig,
  FieldLogicGroup,
  formConfig,
  hideWhen,
  NFCSchema,
  setAlias,
  setComponent,
} from '@piying/view-angular-core';
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
import { ACLSchema } from '../../define/acl';
async function requestACL(field: _PiResolvedCommonViewFieldConfig) {
  let api = field.context['api'] as ApiService;

  let value = await firstValueFrom(api.GetPolicy());

  let editorField = field.get(['@editor'])!;
  editorField.form.control!.updateValue(JSON.parse(value.policy ?? '{}'));
}
export const ACLPageDefine = v.object({
  acl: v.pipe(
    v.union([
      v.pipe(
        ACLSchema,
        v.title('View'),
        actions.wrappers.patchAsync('div', [actions.class.component('*:w-full')]),
      ),
      v.pipe(
        v.any(),
        setComponent('acl-text-editor'),
        setAlias('editor'),
        actions.class.component('h-100'),
        actions.hooks.merge({
          allFieldsResolved: async (field) => {
            requestACL(field);
          },
        }),
        v.title('Editor'),
      ),
    ]),
    actions.inputs.patch({
      isUnion: true,
    }),
    actions.inputs.patchAsync({
      beforeChange: (field) => {
        return (index: number) => {
          let control = (field.form.control as FieldLogicGroup).fixedControls$()[index];
          control.updateValue(field.form.control!.value$$());
        };
      },
    }),
    setAlias('aclContent'),
    setComponent('tabs'),
  ),

  bottom: v.pipe(
    v.object({
      reset: v.pipe(
        NFCSchema,
        setComponent('input-button'),
        actions.inputs.patch({ type: 'reset', color: 'error' }),
        actions.inputs.patchAsync({
          clicked: (field) => {
            return () => {
              return requestACL(field);
            };
          },
        }),
      ),
      submit: v.pipe(
        NFCSchema,
        setComponent('input-button'),
        actions.inputs.patch({ type: 'submit', color: 'primary' }),
        actions.inputs.patchAsync({
          clicked: (field) => {
            return async () => {
              let api = field.context['api'] as ApiService;
              let editorField = field.get(['@aclContent'])!;
              let content = editorField.form.control!.value;
              console.log(content);

              // await firstValueFrom(api.SetPolicy({ policy: JSON.stringify(content) }));
            };
          },
        }),
      ),
    }),
    actions.wrappers.set(['div']),
    actions.class.top('flex gap-2 justify-end'),
  ),
});
