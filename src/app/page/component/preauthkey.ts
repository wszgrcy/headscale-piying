import * as v from 'valibot';
import {
  asControl,
  formConfig,
  NFCSchema,
  setAlias,
  setComponent,
} from '@piying/view-angular-core';
import { computed, effect, untracked } from '@angular/core';
import { actions } from '@piying/view-angular';
import { firstValueFrom, map } from 'rxjs';
import { ApiService } from '../../service/api.service';
import { PreAuthKeys, User } from '../../../api/item.type';
import { DialogService } from '../../service/dialog.service';
import { CopyService } from '../../service/copy.service';
import { localRequest } from '../../util/local-request';
import { formatDatetimeToStr } from '../../util/time-to-str';
import { timeCompare } from '../../util/time';
import { TableResourceService } from '@piying-lib/angular-daisyui/extension';
import { Clipboard } from '@angular/cdk/clipboard';
import { ConfirmService } from '../../service/confirm.service';
import { ToastService } from '../../service/toast.service';

// todo dynamic
const newDate = new Date();
newDate.setDate(newDate.getDate() + 90);
const CreateDefine = v.pipe(
  v.object({
    reusable: v.pipe(v.optional(v.boolean(), true), v.title('reusable')),
    ephemeral: v.pipe(v.optional(v.boolean(), false), v.title('ephemeral')),
    expiration: v.pipe(
      v.optional(v.string(), newDate.toISOString()),
      setComponent('date'),
      v.title('expiration'),
      formConfig({
        transfomer: {
          toModel(value, control) {
            return value ? value.toISOString() : value;
          },
          toView(value, control) {
            return value ? new Date(value) : value;
          },
        },
      }),
    ),
    aclTags: v.pipe(
      v.optional(v.array(v.string())),
      asControl(),
      setComponent('node-tag'),
      v.title('aclTags'),
      actions.wrappers.set(['label-wrapper']),
    ),
  }),
);
export const PreAuthkeyPageDefine = v.pipe(
  v.object({
    table: v.pipe(
      NFCSchema,
      setAlias('preauthkey-table'),
      setComponent('table'),
      actions.class.component('bg-base-200 rounded-box'),
      actions.inputs.patchAsync({
        define: (field) => {
          return {
            row: {
              head: [
                {
                  columns: [
                    'id',
                    'key',
                    'reusable',
                    'ephemeral',
                    'used',
                    'aclTags',
                    'createdAt',
                    'expiration',
                    'actions',
                  ],
                },
              ],
              body: [
                {
                  define: v.pipe(v.tuple([]), setComponent('tr')),
                  columns: [
                    'id',
                    'key',
                    'reusable',
                    'ephemeral',
                    'used',
                    'aclTags',
                    'createdAt',
                    'expiration',
                    'actions',
                  ],
                },
              ],
            },
            columns: {
              id: {
                head: 'id',
                body: (data: PreAuthKeys) => {
                  return data.id;
                },
              },

              key: {
                head: 'key',
                body: v.pipe(
                  NFCSchema,
                  setComponent('badge'),
                  actions.wrappers.set(['td']),
                  actions.class.component(
                    'whitespace-nowrap overflow-hidden text-ellipsis min-w-20 cursor-pointer',
                  ),
                  actions.inputs.patch({
                    color: 'info',
                  }),
                  actions.inputs.patchAsync({
                    content: (field) => {
                      return computed(() => {
                        return (field.context['item$']() as PreAuthKeys).key;
                      });
                    },
                  }),
                  actions.events.patchAsync({
                    click: (field) => {
                      const copy = field.context['copy'] as CopyService;
                      return () => {
                        const key = (field.context['item$']() as PreAuthKeys).key!;
                        copy.copy(key);
                      };
                    },
                  }),
                ),
              },
              reusable: {
                head: 'reusable',
                body: (data: PreAuthKeys) => {
                  return data.reusable ? '✔️' : '❌';
                },
              },
              ephemeral: {
                head: 'ephemeral',
                body: (data: PreAuthKeys) => {
                  return data.ephemeral ? '✔️' : '❌';
                },
              },
              used: {
                head: 'used',
                body: (data: PreAuthKeys) => {
                  return data.used ? '✔️' : '❌';
                },
              },
              createdAt: {
                head: 'createdAt',
                body: (data: PreAuthKeys) => {
                  return formatDatetimeToStr(data.createdAt);
                },
              },
              expiration: {
                head: 'expiration',
                body: (data: PreAuthKeys) => {
                  const icon = timeCompare(data.expiration!) ? '✔️' : '❌';
                  return `${icon}${formatDatetimeToStr(data.expiration)}`;
                },
              },
              aclTags: {
                head: 'aclTags',
                body: (data: PreAuthKeys) => {
                  return data.aclTags?.join(',') ?? '';
                },
              },

              actions: {
                head: ' ',
                body: v.pipe(
                  v.object({
                    expire: v.pipe(
                      NFCSchema,
                      setComponent('button'),
                      actions.inputs.patch({
                        content: { icon: { fontIcon: 'update_disabled' } },
                        shape: 'circle',
                        size: 'sm',
                      }),
                      actions.class.top('text-error'),
                      actions.inputs.patchAsync({
                        clicked: (field) => {
                          return async () => {
                            const api: ApiService = field.context['api'];
                            const item = field.context['item$']() as PreAuthKeys;
                            await firstValueFrom(api.ExpirePreAuthKey({ id: item.id }));
                            field.injector.get(TableResourceService).needUpdate();
                          };
                        },
                      }),
                    ),
                    delete: v.pipe(
                      NFCSchema,
                      setComponent('button'),
                      actions.inputs.patch({
                        content: { icon: { fontIcon: 'delete' } },
                        shape: 'circle',
                        size: 'sm',
                      }),
                      actions.class.top('text-error'),
                      actions.inputs.patchAsync({
                        clicked: (field) => {
                          return async () => {
                            const api: ApiService = field.context['api'];
                            const item = field.context['item$']() as PreAuthKeys;
                            await firstValueFrom(api.DeletePreAuthKey({ id: item.id }));
                            field.injector.get(TableResourceService).needUpdate();
                          };
                        },
                      }),
                    ),
                  }),
                  actions.wrappers.set(['td']),
                  actions.class.top('flex gap-2'),
                ),
              },
            },
          };
        },
        data: (field) => {
          return field.injector.get(TableResourceService).list$$;
        },
      }),
      actions.hooks.merge({
        allFieldsResolved: (field) => {
          let tableResource = field.injector.get(TableResourceService);
          const defineField = field.get(['@preauthkey'])!;

          const user$$ = computed(() => (defineField.props()['user$$']() as User).id);
          effect(
            () => {
              user$$();

              tableResource.needUpdate();
            },
            { injector: field.injector },
          );
        },
      }),
    ),

    bottom: v.pipe(
      v.object({
        add: v.pipe(
          NFCSchema,
          setComponent('button'),
          actions.inputs.patch({ content: { icon: { fontIcon: 'add' }, title: 'add' } }),
          actions.inputs.patchAsync({
            clicked: (field) => {
              const tableField = field.get(['@preauthkey-table'])!;
              const defineField = field.get(['@preauthkey'])!;
              return () => {
                const dialog: DialogService = field.context['dialog'];
                dialog.openDialog({
                  title: 'new',
                  schema: v.pipe(CreateDefine),
                  applyValue: async (value) => {
                    const defineProps = defineField?.props()['user$$']() as User;
                    const api: ApiService = field.context['api'];
                    let result = await firstValueFrom(
                      api.CreatePreAuthKey({ ...value, user: defineProps.id! }),
                    );

                    field.injector.get(ConfirmService).open({
                      title: 'apikey',
                      message: result.preAuthKey!.key!,
                      buttons: [
                        {
                          label: 'copy',
                          close: async () => {
                            let a = field.injector.get(Clipboard).copy(result.preAuthKey!.key!);
                            if (a) {
                              field.injector
                                .get(ToastService)
                                .add('Copy Success', { type: 'success' });
                            }
                            await new Promise(() => {});
                          },
                          class: 'btn-primary',
                        },
                        { label: 'close', close: async () => false, class: 'btn-error' },
                      ],
                    });
                    field.injector.get(TableResourceService).needUpdate();
                  },
                });
              };
            },
          }),
        ),
        page: v.pipe(
          NFCSchema,
          setComponent('pagination'),
          actions.class.top('mt-4 flex justify-end'),
          actions.inputs.patch({
            value: {
              size: 10,
              index: 0,
            },
          }),
          actions.inputs.patchAsync({
            count: (field) => {
              return field.injector.get(TableResourceService).count$$;
            },
          }),
          actions.outputs.patchAsync({
            valueChange: (field) => {
              return (data) => {
                field.injector.get(TableResourceService).setParams('page', data);
              };
            },
          }),
        ),
      }),
      actions.wrappers.set(['div']),
      actions.class.top('flex justify-between items-center'),
    ),
  }),
  setAlias('preauthkey'),
  actions.providers.patch([TableResourceService]),
  actions.hooks.merge({
    allFieldsResolved: (field) => {
      const defineField = field.get(['@preauthkey'])!;

      let api = field.injector.get(ApiService);
      field.injector.get(TableResourceService).setRequest(
        localRequest(
          () => {
            const defineProps = untracked(() => defineField.props()['user$$']());

            return firstValueFrom(
              api.ListPreAuthKeys().pipe(
                map((item) => {
                  let list = (item.preAuthKeys ?? []).filter(
                    (item) => item.user?.id === defineProps.id,
                  );
                  return [list.length, list];
                }),
              ),
            );
          },
          () => {
            return true;
          },
        ),
      );
    },
  }),
);
