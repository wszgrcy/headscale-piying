import * as v from 'valibot';
import { actions, NFCSchema, setComponent } from '@piying/view-angular-core';
import { AccountService } from '../../service/account.service';
import { LocalSaveService } from '../../service/local-save.service';
import { ApiService } from '../../service/api.service';
export const StatusDefine = v.pipe(
  v.object({
    prefix: v.pipe(
      NFCSchema,
      setComponent('common-data'),
      actions.inputs.patchAsync({
        content: (field) => {
          const ls: LocalSaveService = field.context['localSave'];
          return ls.prefix$$;
        },
      }),
      v.title('prefix'),
      actions.wrappers.set(['label-wrapper', 'div']),
      actions.props.patch({ labelPosition: 'left' }),

      actions.class.top('w-full *:last:w-full gap-4'),
      actions.class.component('w-full'),
    ),
    apiKey: v.pipe(
      NFCSchema,
      setComponent('common-data'),
      actions.inputs.patchAsync({
        content: (field) => {
          const ls: LocalSaveService = field.context['localSave'];
          return ls.key$$();
        },
      }),
      v.title('apiKey'),
      actions.wrappers.set(['label-wrapper', 'div']),
      actions.props.patch({ labelPosition: 'left' }),
      actions.class.top('w-full *:last:w-full gap-4'),
      actions.class.component('w-full'),
    ),
    status: v.pipe(
      v.object({
        databaseConnectivity: v.pipe(
          NFCSchema,
          setComponent('common-data'),
          actions.wrappers.set(['label-wrapper', 'div']),
          actions.props.patch({ labelPosition: 'left' }),
          actions.class.top('gap-4'),

          v.title('databaseConnectivity'),
          actions.inputs.patch({ content: '' }),
        ),
      }),
      actions.hooks.merge({
        allFieldsResolved: (field) => {
          const api: ApiService = field.context['api'];
          api.Health().subscribe((result) => {
            field.get(['databaseConnectivity'])!.inputs.update((value) => {
              return {
                ...value,
                content: result.databaseConnectivity,
              };
            });
          });
        },
      }),
    ),
    __button: v.pipe(
      NFCSchema,
      setComponent('button'),
      actions.inputs.patch({ content: 'Logout', color: 'primary' }),
      actions.inputs.patchAsync({
        clicked: (field) => {
          return () => {
            return (field.context['account'] as AccountService).logout();
          };
        },
      }),
    ),
  }),
  setComponent('fieldset'),
);
