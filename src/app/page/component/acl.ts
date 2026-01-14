import * as v from 'valibot';
import {
  _PiResolvedCommonViewFieldConfig,
  FieldLogicGroup,
  NFCSchema,
  setAlias,
  setComponent,
} from '@piying/view-angular-core';
import { actions } from '@piying/view-angular';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../service/api.service';
import { ACLSchema } from '../../define/acl';
async function requestACL(field: _PiResolvedCommonViewFieldConfig) {
  const api = field.context['api'] as ApiService;

  const value = await firstValueFrom(api.GetPolicy());

  const editorField = field.get(['@editor'])!;
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
          const control = (field.form.control as FieldLogicGroup).fixedControls$()[index];
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
              const api = field.context['api'] as ApiService;
              const editorField = field.get(['@aclContent'])!;
              const content = editorField.form.control!.value;

              await firstValueFrom(api.SetPolicy({ policy: JSON.stringify(content) }));
            };
          },
        }),
      ),
    }),
    actions.wrappers.set(['div']),
    actions.class.top('flex gap-2 justify-end'),
  ),
});
