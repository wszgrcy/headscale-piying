import * as v from 'valibot';
import { NFCSchema, setAlias, setComponent } from '@piying/view-angular-core';
import { computed } from '@angular/core';
import { actions } from '@piying/view-angular';
import { firstValueFrom, map } from 'rxjs';
import { ApiService } from '../../service/api.service';
import { ApiKey } from '../../../api/item.type';
import { DialogService } from '../../service/dialog.service';
import { formatDatetimeToStr } from '../../util/time-to-str';
import { timeCompare } from '../../util/time';
import { TableResourceService } from '@piying-lib/angular-daisyui/extension';
import { localRequest } from '../../util/local-request';
import { ConfirmService } from '../../service/confirm.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastService } from '../../service/toast.service';
// todo dynamic
const newDate = new Date();
newDate.setDate(newDate.getDate() + 90);
const CreateApiKeyDefine = v.pipe(
  v.object({
    expiration: v.pipe(
      v.optional(v.date(), newDate),
      v.title('expiration'),
      v.transform((input) => {
        return input.toISOString();
      }),
    ),
  }),
);
export const ApiKeyPageDefine = v.pipe(
  v.object({
    table: v.pipe(
      NFCSchema,
      setAlias('table'),
      setComponent('table'),

      actions.inputs.patchAsync({
        define: (field) => {
          return {
            row: {
              head: [
                {
                  columns: ['id', 'prefix', 'expiration', 'lastSeen', 'createdAt', 'actions'],
                },
              ],
              body: [
                {
                  define: v.pipe(
                    v.tuple([]),
                    setComponent('tr'),
                    // actions.directives.set([
                    //   {
                    //     type: ExpandRowDirective,
                    //   },
                    // ])
                  ),
                  columns: ['id', 'prefix', 'expiration', 'lastSeen', 'createdAt', 'actions'],
                },
                // { define: v.pipe(v.tuple([]), setComponent('tr')), columns: ['extra'] },
              ],
            },
            columns: {
              // checkbox: {
              //   head: ' ',
              //   body: v.pipe(
              //     v.boolean(),
              //     setComponent('checkbox'),
              //     actions.wrappers.set(['td', 'table-checkbox-body']),
              //   ),
              // },
              // index: {
              //   head: '索引',
              //   body: (node: any, index: number) => {
              //     const { pageQueryParams } = pageFiled!.props();
              //     return `${index + 1 + pageQueryParams.index * pageQueryParams.size}`;
              //   },
              // },
              id: {
                head: 'id',
                body: (data: ApiKey) => {
                  return data.id;
                },
              },
              prefix: {
                head: 'prefix',
                body: (data: ApiKey) => {
                  return data.prefix;
                },
              },
              expiration: {
                head: 'expiration',
                body: (data: ApiKey) => {
                  const icon = timeCompare(data.expiration!) ? '✔️' : '❌';
                  return `${icon}${formatDatetimeToStr(data.expiration)}`;
                },
              },
              createdAt: {
                head: 'createdAt',
                body: (data: ApiKey) => {
                  return formatDatetimeToStr(data.createdAt);
                },
              },
              lastSeen: {
                head: 'lastSeen',
                body: (data: ApiKey) => {
                  return formatDatetimeToStr(data.lastSeen);
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
                      actions.inputs.patchAsync({
                        clicked: (field) => {
                          return async () => {
                            const api: ApiService = field.context['api'];
                            const item = field.context['item$']() as ApiKey;
                            await firstValueFrom(api.ExpireApiKey({ id: item.id }));
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
                            const item = field.context['item$']() as ApiKey;
                            await firstValueFrom(api.DeleteApiKey(item.prefix!.slice(0, -3)));
                            field.injector.get(TableResourceService).needUpdate();
                          };
                        },
                      }),
                    ),
                  }),
                  actions.wrappers.set(['td']),
                ),
              },

              // extra: {
              //   body: v.pipe(
              //     NFCSchema,
              //     setComponent('button'),
              //     actions.wrappers.set(['td']),
              //     hideWhen({
              //       listen(fn, field) {
              //         return (field.context.status.expanded as Subject<any>).pipe(
              //           map((item) => {
              //             return item !== field.context.item$();
              //           }),
              //           startWith(true)
              //         );
              //       },
              //     })
              //   ),
              // },
            },
          };
        },
        data: (field) => {
          return field.injector.get(TableResourceService).list$$;
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
              return () => {
                const dialog: DialogService = field.context['dialog'];
                dialog.openDialog({
                  title: 'new',
                  schema: v.pipe(CreateApiKeyDefine),
                  applyValue: async (value) => {
                    const api: ApiService = field.context['api'];
                    let result = await firstValueFrom(api.CreateApiKey(value));
                    field.injector.get(ConfirmService).open({
                      title: 'apikey',
                      message: 'copy apikey',
                      buttons: [
                        {
                          label: 'copy',
                          close: async () => {
                            let a = field.injector.get(Clipboard).copy(result.apiKey!);
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
  actions.wrappers.set([{ type: 'loading-wrapper' }]),
  actions.props.patchAsync({
    isLoading: (field) => field.injector.get(TableResourceService).isLoading$$,
  }),
  setAlias('table-block'),
  actions.providers.patch([TableResourceService]),
  actions.hooks.merge({
    allFieldsResolved: (field) => {
      let api = field.injector.get(ApiService);
      field.injector.get(TableResourceService).setRequest(
        localRequest((input) => {
          return firstValueFrom(
            api.ListApiKeys().pipe(
              map((item) => {
                let list = item.apiKeys ?? [];
                return [list.length, list];
              }),
            ),
          );
        }),
      );
    },
  }),
);
