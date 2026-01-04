import * as v from 'valibot';
import { asControl, hideWhen, NFCSchema, setAlias, setComponent } from '@piying/view-angular-core';
import { computed, untracked } from '@angular/core';
import { actions } from '@piying/view-angular';
import { firstValueFrom, map, startWith, Subject } from 'rxjs';
import { ExpandRowDirective, TableStatusService } from '@piying-lib/angular-daisyui/extension';
import { ApiService } from '../../service/api.service';
import { ListUsersRes } from '../../../api/type';
import { PreAuthKeys, User } from '../../../api/item.type';
import { DialogService } from '../../service/dialog.service';
import { CopyService } from '../../service/copy.service';
import { requestLoading } from '../../util/request-loading';
// todo dynamic
let newDate = new Date();
newDate.setDate(newDate.getDate() + 90);
const CreateDefine = v.pipe(
  v.object({
    reusable: v.pipe(v.optional(v.boolean(), true), v.title('reusable')),
    ephemeral: v.pipe(v.optional(v.boolean(), false), v.title('ephemeral')),
    expiration: v.pipe(
      v.optional(v.date(), newDate),
      v.title('expiration'),
      v.transform((input) => {
        return input.toISOString();
      })
    ),
    aclTags: v.pipe(
      v.optional(v.array(v.string())),
      asControl(),
      setComponent('node-tag'),
      v.title('aclTags'),
      actions.wrappers.set(['label-wrapper'])
    ),
  })
);
export const PreAuthkeyPageDefine = v.pipe(
  v.object({
    table: v.pipe(
      NFCSchema,
      setAlias('preauthkey-table'),
      setComponent('table'),
      actions.class.component('bg-base-200 rounded-box'),
      actions.wrappers.set(['table-status', 'sort-table', 'table-resource', 'checkbox-table']),

      actions.inputs.patchAsync({
        define: (field) => {
          const pageFiled = field.get(['..', 'page']);
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
                    'whitespace-nowrap overflow-hidden text-ellipsis min-w-20 cursor-pointer'
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
                      let copy = field.context['copy'] as CopyService;
                      return () => {
                        let key = (field.context['item$']() as PreAuthKeys).key!;
                        copy.copy(key);
                      };
                    },
                  })
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
                  return data.createdAt;
                },
              },
              expiration: {
                head: 'expiration',
                body: (data: PreAuthKeys) => {
                  return data.expiration;
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
                        color: 'error',
                      }),
                      actions.inputs.patchAsync({
                        clicked: (field) => {
                          return async () => {
                            let api: ApiService = field.context['api'];
                            let item = field.context['item$']() as PreAuthKeys;
                            await firstValueFrom(
                              api.ExpirePreAuthKey({ user: item.user!.id!, key: item.key! })
                            );
                            let status: TableStatusService = field.context['status'];
                            status.needUpdate();
                          };
                        },
                      })
                    ),
                    delete: v.pipe(
                      NFCSchema,
                      setComponent('button'),
                      actions.inputs.patch({
                        content: { icon: { fontIcon: 'delete' } },
                        shape: 'circle',
                        size: 'sm',
                        color: 'error',
                      }),
                      actions.inputs.patchAsync({
                        clicked: (field) => {
                          return async () => {
                            let api: ApiService = field.context['api'];
                            let item = field.context['item$']() as PreAuthKeys;
                            await firstValueFrom(
                              api.DeletePreAuthKey({ user: item.user!.id!, key: item.key })
                            );
                            let status: TableStatusService = field.context['status'];
                            status.needUpdate();
                          };
                        },
                      })
                    ),
                  }),
                  actions.wrappers.set(['td']),
                  actions.class.top('flex gap-2')
                ),
              },
            },
          };
        },
      }),
      actions.props.patch({ sortList: ['title1', 'badge1'] }),
      actions.props.patchAsync({
        data: (field) => {
          let api = field.context['api'] as ApiService;
          let defineField = field.get(['@preauthkey'])!;
          return requestLoading(field, ['@preauthkey'], () => {
            let defineProps = untracked(() => defineField.props()['user'] as User);
            return firstValueFrom(
              api.ListPreAuthKeys({ user: defineProps.id }).pipe(
                map((item) => {
                  return item.preAuthKeys ?? [];
                })
              )
            );
          });
        },
      }),
      actions.props.mapAsync((field) => {
        const pageProps = field.get(['..', 'bottom', 'page'])!.props;
        return (value) => {
          return {
            ...value,
            queryParams: {
              // page field
              page: pageProps?.()['pageQueryParams'],
              // sort-table
              direction: value['sortQueryParams'],
            },
          };
        };
      })
    ),

    bottom: v.pipe(
      v.object({
        add: v.pipe(
          NFCSchema,
          setComponent('button'),
          actions.inputs.patch({ content: { icon: { fontIcon: 'add' }, title: 'add' } }),
          actions.inputs.patchAsync({
            clicked: (field) => {
              let tableField = field.get(['@preauthkey-table'])!;
              let defineField = field.get(['@preauthkey'])!;
              return () => {
                const dialog: DialogService = field.context['dialog'];
                dialog.openDialog({
                  title: 'new',
                  schema: v.pipe(CreateDefine),
                  applyValue: async (value) => {
                    let defineProps = defineField?.props()['user'] as User;
                    let api: ApiService = field.context['api'];
                    await firstValueFrom(api.CreatePreAuthKey({ ...value, user: defineProps.id! }));
                    let status: TableStatusService = tableField.props()['status'];
                    status.needUpdate();
                  },
                });
              };
            },
          })
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
              const tableField = field.get(['..', '..', 'table'])!;
              return computed(() => {
                return tableField.props()['count$$']();
              });
            },
          })
        ),
      }),
      actions.wrappers.set(['div']),
      actions.class.top('flex justify-between items-center')
    ),
  }),
  setAlias('preauthkey')
);
