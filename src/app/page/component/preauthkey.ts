import * as v from 'valibot';
import { asControl, NFCSchema, setAlias, setComponent } from '@piying/view-angular-core';
import { computed, effect, untracked } from '@angular/core';
import { actions } from '@piying/view-angular';
import { firstValueFrom, map } from 'rxjs';
import { TableStatusService } from '@piying-lib/angular-daisyui/extension';
import { ApiService } from '../../service/api.service';
import { PreAuthKeys, User } from '../../../api/item.type';
import { DialogService } from '../../service/dialog.service';
import { CopyService } from '../../service/copy.service';
import { requestLoading } from '../../util/request-loading';
import { formatDatetimeToStr } from '../../util/time-to-str';
import { timeCompare } from '../../util/time';
// todo dynamic
const newDate = new Date();
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
                            await firstValueFrom(
                              api.ExpirePreAuthKey({ user: item.user!.id!, key: item.key! }),
                            );
                            const status: TableStatusService = field.context['status'];
                            status.needUpdate();
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
                            await firstValueFrom(
                              api.DeletePreAuthKey({ user: item.user!.id!, key: item.key }),
                            );
                            const status: TableStatusService = field.context['status'];
                            status.needUpdate();
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
      }),
      actions.props.patch({ sortList: ['title1', 'badge1'] }),
      actions.hooks.merge({
        allFieldsResolved: (field) => {
          const defineField = field.get(['@preauthkey'])!;
          const status$ = computed(() => {
            return field.props()['status'];
          });
          const user$$ = computed(() => (defineField.props()['user$$']() as User).id);
          let init = false;
          effect(
            () => {
              const status = status$() as TableStatusService;
              if (!status) {
                return;
              }
              user$$();
              if (!init) {
                init = true;
                return;
              }
              status.needUpdate();
            },
            { injector: field.injector },
          );
        },
      }),
      actions.props.patchAsync({
        data: (field) => {
          const api = field.context['api'] as ApiService;
          const defineField = field.get(['@preauthkey'])!;
          return requestLoading(field, ['@preauthkey'], () => {
            const defineProps = untracked(() => defineField.props()['user$$']());
            return firstValueFrom(
              api.ListPreAuthKeys({ user: defineProps.id }).pipe(
                map((item) => {
                  return item.preAuthKeys ?? [];
                }),
              ),
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
                    await firstValueFrom(api.CreatePreAuthKey({ ...value, user: defineProps.id! }));
                    const status: TableStatusService = tableField.props()['status'];
                    status.needUpdate();
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
              const tableField = field.get(['..', '..', 'table'])!;
              return computed(() => {
                return tableField.props()['count$$']();
              });
            },
          }),
        ),
      }),
      actions.wrappers.set(['div']),
      actions.class.top('flex justify-between items-center'),
    ),
  }),
  setAlias('preauthkey'),
);
