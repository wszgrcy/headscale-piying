import * as v from 'valibot';
import { actions, NFCSchema, setComponent } from '@piying/view-angular-core';
import { LoginDefine } from './component/login';
export const LoginPageDefine = v.pipe(
  v.object({
    __logo: v.pipe(
      NFCSchema,
      setComponent('common-data'),
      actions.inputs.patch({
        content: {
          icon: { fontSet: 'icon', fontIcon: 'icon-logo' },
        },
      }),
    ),
    __login: v.pipe(LoginDefine, actions.class.top('max-w-[50vw] w-full')),
  }),
  actions.wrappers.set(['div']),
  actions.class.top('flex items-center justify-center h-full flex-col'),
);
