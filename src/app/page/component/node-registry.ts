import * as v from 'valibot';
import {
  asControl,
  formConfig,
  hideWhen,
  NFCSchema,
  setAlias,
  setComponent,
} from '@piying/view-angular-core';
import { computed, effect, untracked } from '@angular/core';
import { actions } from '@piying/view-angular';
import { ApiService } from '../../service/api.service';
import { firstValueFrom, map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

export const NodeRegistryDefine = v.pipe(
  v.object({
    form: v.pipe(
      v.object({
        user: v.pipe(
          v.string(),
          setComponent('editable-select'),
          actions.inputs.patch({
            filterEnable: true,
          }),
          actions.inputs.patchAsync({
            options: (field) => {
              let api: ApiService = field.context['api'];
              return api.ListUsers().pipe(
                map((item) => {
                  let list = item.users ?? [];
                  return list.map((item) => {
                    return {
                      label: item.displayName || item.name,
                      value: item.name,
                    };
                  });
                }),
              );
            },
          }),
          v.title('user'),
          actions.wrappers.set(['label-wrapper']),
          actions.props.patch({
            labelPosition: 'left',
          }),
        ),
        key: v.pipe(
          v.string(),
          actions.hooks.merge({
            allFieldsResolved: (field) => {
              let activatedRoute: ActivatedRoute = field.context['activatedRoute'];
              field.form.control!.updateValue(activatedRoute.snapshot.params['key']);
            },
          }),
          v.title('key'),
          actions.props.patch({
            labelPosition: 'left',
          }),
        ),
      }),
      setAlias('form'),
    ),
    bottom: v.pipe(
      v.object({
        submit: v.pipe(
          NFCSchema,
          setComponent('input-button'),
          actions.inputs.patch({ type: 'submit', color: 'primary' }),
          actions.inputs.patchAsync({
            clicked: (field) => {
              let tableField = field.get(['@form'])!;

              return async () => {
                const api: ApiService = field.context['api'];
                await firstValueFrom(api.RegisterNode(tableField.form.control!.value));
                const router: Router = field.context['router'];
                return router.navigateByUrl('/web/node');
              };
            },
            disabled: (field) => {
              let tableField = field.get(['@form'])!;
              return tableField.form.control!.statusChanges.pipe(
                map(() => {
                  return tableField.form.control!.invalid;
                }),
              );
            },
          }),
        ),
      }),
    ),
  }),
  actions.wrappers.patch(['fieldset-wrapper']),
  actions.class.top('bg-base-200 border-base-300 rounded-box w-xs border p-4'),
);
