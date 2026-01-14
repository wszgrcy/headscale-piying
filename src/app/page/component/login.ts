import * as v from 'valibot';
import { actions, NFCSchema, setComponent } from '@piying/view-angular-core';
import { AccountService } from '../../service/account.service';
export const LoginDefine = v.pipe(
  v.object({
    prefix: v.pipe(
      v.optional(v.string()),
      v.title('prefix'),
      actions.class.top('w-full *:last:w-full'),
      actions.class.component('w-full'),
    ),
    apiKey: v.pipe(
      v.string(),
      setComponent('password'),
      v.title('apiKey'),
      actions.class.top('w-full *:last:w-full'),
      actions.class.component('w-full'),
    ),
    __button: v.pipe(
      NFCSchema,
      setComponent('input-button'),
      actions.inputs.patch({ type: 'submit', color: 'primary' }),
      actions.inputs.patchAsync({
        clicked: (field) => {
          return () => {
            return (field.context['account'] as AccountService).login(
              field.get(['..'])!.form.control!.value,
            );
          };
        },
      }),
    ),
  }),
  setComponent('fieldset'),
);
