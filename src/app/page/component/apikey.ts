import * as v from 'valibot';
import { hideWhen, NFCSchema, setAlias, setComponent } from '@piying/view-angular-core';
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
import { timeCompare } from '../../util/time';
// todo dynamic
let newDate = new Date();
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
      actions.wrappers.set(['table-status', 'sort-table', 'table-resource', 'checkbox-table']),

      actions.inputs.patchAsync({
        define: (field) => {
          const pageFiled = field.get(['..', 'page']);
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
                  let icon = timeCompare(data.expiration!) ? '✔️' : '❌';
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
                            let api: ApiService = field.context['api'];
                            let item = field.context['item$']() as ApiKey;
                            await firstValueFrom(api.ExpireApiKey({ prefix: item.prefix }));
                            let status: TableStatusService = field.context['status'];
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
                            let api: ApiService = field.context['api'];
                            let item = field.context['item$']() as ApiKey;
                            await firstValueFrom(api.DeleteApiKey(item.prefix!));
                            let status: TableStatusService = field.context['status'];
                            status.needUpdate();
                          };
                        },
                      }),
                    ),
                  }),
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
      }),
      actions.props.patch({ sortList: ['title1', 'badge1'] }),
      actions.props.patchAsync({
        data: (field) => {
          let api = field.context['api'] as ApiService;
          return requestLoading(field, ['@table-block'], () => {
            return firstValueFrom(
              api.ListApiKeys().pipe(
                map((item) => {
                  return item.apiKeys ?? [];
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
              let tableField = field.get(['@table'])!;
              return () => {
                const dialog: DialogService = field.context['dialog'];
                dialog.openDialog({
                  title: 'new',
                  schema: v.pipe(CreateApiKeyDefine),
                  applyValue: async (value) => {
                    let api: ApiService = field.context['api'];
                    await firstValueFrom(api.CreateApiKey(value));
                    let status: TableStatusService = tableField.props()['status'];
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
  actions.wrappers.set([{ type: 'loading-wrapper' }]),
  setAlias('table-block'),
);
