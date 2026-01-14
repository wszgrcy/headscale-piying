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
import {
  combineLatest,
  filter,
  firstValueFrom,
  map,
  Observable,
  skip,
  startWith,
  Subject,
} from 'rxjs';
import { ExpandRowDirective, TableStatusService } from '@piying-lib/angular-daisyui/extension';
import { ApiService } from '../../service/api.service';
import { ListUsersRes } from '../../../api/type';
import { NodeItem } from '../../../api/item.type';
import { DialogService } from '../../service/dialog.service';
import { SelectionModel } from '@angular/cdk/collections';
import { metadataList } from '@piying/valibot-visit';
import { requestLoading } from '../../util/request-loading';
import { formatDatetimeToStr } from '../../util/time-to-str';
import { toObservable } from '@angular/core/rxjs-interop';
import { LeftTitleAction } from '../../define/left-title';
import { PickerTimeRangeDefine } from '../../define/picker-time-range';
import { timeInRange } from '../../util/time-in-range';
let newDate = new Date();
const ExpireNodeDefine = v.pipe(
  v.object({
    expiry: v.pipe(
      v.optional(v.date(), newDate),
      v.title('expiration'),
      v.transform((input) => {
        return input.toISOString();
      }),
    ),
  }),
);
const RenameNodeDefine = v.pipe(
  v.object({
    name: v.pipe(v.string(), v.title('name')),
  }),
);
const ROSTRLabelWrapper = metadataList<any>([
  actions.class.top('[&_label]:w-30'),
  actions.wrappers.set(['label-wrapper']),
  actions.props.patch({
    labelPosition: 'left',
  }),
]);
const registerMethodList = [
  'REGISTER_METHOD_UNSPECIFIED',
  'REGISTER_METHOD_AUTH_KEY',
  'REGISTER_METHOD_CLI',
  'REGISTER_METHOD_OIDC',
].map((item) => {
  return {
    label: item.slice('REGISTER_METHOD_'.length),
    value: item,
  };
});
const FilterCondition = v.pipe(
  v.object({
    params: v.pipe(
      v.object({
        givenName: v.pipe(v.optional(v.string()), v.title('name'), LeftTitleAction),
        ip: v.pipe(v.optional(v.string()), v.title('ip'), LeftTitleAction),
        createdAt: v.pipe(v.optional(PickerTimeRangeDefine), v.title('createdAt'), LeftTitleAction),
        lastSeen: v.pipe(v.optional(PickerTimeRangeDefine), v.title('lastSeen'), LeftTitleAction),
        registerMethod: v.pipe(
          v.optional(v.string()),
          setComponent('select'),
          actions.class.component('min-w-20'),
          actions.inputs.patch({
            options: registerMethodList,
          }),
          v.title('lastSeen'),
          LeftTitleAction,
        ),
      }),
      formConfig({ updateOn: 'submit' }),
      actions.wrappers.set(['div']),
      actions.class.top('flex gap-4'),
      setAlias('filterParams'),
    ),
    __flex: v.pipe(NFCSchema, setComponent('div'), actions.class.top('flex-1')),
    reset: v.pipe(
      NFCSchema,
      setComponent('input-button'),
      actions.inputs.patch({ type: 'reset', color: 'error' }),
      actions.inputs.patchAsync({
        clicked: (field) => {
          return () => {
            const result = field.get(['..', 'params'])!.form.control!;
            result.reset();
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
          return () => {
            const result = field.get(['..', 'params'])!.form.control!;
            result.emitSubmit();
          };
        },
      }),
    ),
  }),
  actions.wrappers.set(['div']),
  actions.class.top('flex gap-2'),
);
// todo dynamic
const ROStrItemDefine = v.pipe(NFCSchema, setComponent('common-data'), ROSTRLabelWrapper);
export const NodeItemPageDefine = v.pipe(
  v.object({
    query: FilterCondition,
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
                  columns: [
                    'expand',
                    'online',
                    'id',
                    'givenName',
                    'registerMethod',
                    'lastSeen',
                    'createdAt',
                    'actions',
                  ],
                },
              ],
              body: [
                {
                  define: v.pipe(v.tuple([]), setComponent('tr')),
                  columns: [
                    'expand',
                    'online',
                    'id',
                    'givenName',
                    'registerMethod',
                    'lastSeen',
                    'createdAt',
                    'actions',
                  ],
                },
                { define: v.pipe(v.tuple([]), setComponent('tr')), columns: ['extra'] },
              ],
            },
            columns: {
              expand: {
                head: ' ',
                body: v.pipe(
                  NFCSchema,
                  setComponent('table-expand-cell'),
                  actions.wrappers.set(['td']),
                ),
              },
              id: {
                head: v.pipe(
                  NFCSchema,
                  setComponent('common-data'),
                  actions.inputs.patch({ content: 'id' }),
                  actions.wrappers.set(['td', 'sort-header']),
                  actions.props.patch({
                    key: 'id',
                  }),
                ),
                body: (data: NodeItem) => {
                  return data.id;
                },
              },
              givenName: {
                head: v.pipe(
                  NFCSchema,
                  setComponent('common-data'),
                  actions.inputs.patch({ content: 'givenName' }),
                  actions.wrappers.set(['td', 'sort-header']),
                  actions.props.patch({
                    key: 'givenName',
                  }),
                ),
                body: (data: NodeItem) => {
                  return data.givenName;
                },
              },
              createdAt: {
                head: v.pipe(
                  NFCSchema,
                  setComponent('common-data'),
                  actions.inputs.patch({ content: 'createdAt' }),
                  actions.wrappers.set(['td', 'sort-header']),
                  actions.props.patch({
                    key: 'createdAt',
                    direction: -1,
                  }),
                ),
                body: (data: NodeItem) => {
                  return formatDatetimeToStr(data.createdAt);
                },
              },
              lastSeen: {
                head: v.pipe(
                  NFCSchema,
                  setComponent('common-data'),
                  actions.inputs.patch({ content: 'lastSeen' }),
                  actions.wrappers.set(['td', 'sort-header']),
                  actions.props.patch({
                    key: 'lastSeen',
                  }),
                ),
                body: (data: NodeItem) => {
                  return formatDatetimeToStr(data.lastSeen);
                },
              },
              online: {
                head: ' ',
                body: v.pipe(
                  NFCSchema,
                  setComponent('status'),
                  actions.wrappers.set(['td']),
                  actions.inputs.patch({ content: '' }),
                  actions.inputs.patchAsync({
                    color: ({ context }) => {
                      return computed(() =>
                        (context.item$() as NodeItem).online ? 'success' : 'error',
                      );
                    },
                  }),
                ),
              },
              registerMethod: {
                head: 'registerMethod',
                body: v.pipe(
                  NFCSchema,
                  setComponent('badge'),
                  actions.wrappers.set(['td']),
                  actions.inputs.patch({
                    color: 'secondary',
                  }),
                  actions.inputs.patchAsync({
                    content: ({ context }) => {
                      return computed(() => {
                        let method = (context.item$() as NodeItem).registerMethod;
                        if (!method) {
                          return 'NONE';
                        } else {
                          //REGISTER_METHOD_
                          return method.slice(16);
                        }
                      });
                    },
                  }),
                ),
              },

              actions: {
                head: ' ',
                body: v.pipe(
                  v.object({
                    rename: v.pipe(
                      NFCSchema,
                      setComponent('button'),
                      actions.inputs.patch({
                        content: { icon: { fontIcon: 'edit' } },
                        shape: 'circle',
                        size: 'sm',
                      }),
                      actions.inputs.patchAsync({
                        clicked: (field) => {
                          return async () => {
                            let dialog: DialogService = field.context['dialog'];
                            let item = field.context['item$']() as NodeItem;
                            dialog.openDialog({
                              title: 'change givenName',
                              schema: RenameNodeDefine,
                              applyValue: async (value) => {
                                let api: ApiService = field.context['api'];
                                await firstValueFrom(api.RenameNode(item.id!, value.name));
                                let status: TableStatusService = field.context['status'];
                                status.needUpdate();
                              },
                            });
                          };
                        },
                      }),
                    ),
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
                            let dialog: DialogService = field.context['dialog'];
                            let item = field.context['item$']() as NodeItem;
                            dialog.openDialog({
                              title: 'new',
                              schema: v.pipe(ExpireNodeDefine),
                              applyValue: async (value) => {
                                let api: ApiService = field.context['api'];
                                await firstValueFrom(api.ExpireNode(item.id!, value));
                                let status: TableStatusService = field.context['status'];
                                status.needUpdate();
                              },
                            });
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
                            let item = field.context['item$']() as NodeItem;
                            await firstValueFrom(api.DeleteNode(item.id!));
                            let status: TableStatusService = field.context['status'];
                            status.needUpdate();
                          };
                        },
                      }),
                    ),
                  }),
                  actions.wrappers.set([
                    'td',
                    { type: 'div', attributes: { class: 'flex gap-2' } },
                  ]),
                ),
              },

              extra: {
                body: v.pipe(
                  v.object({
                    nodeTag: v.pipe(
                      v.array(v.string()),
                      setComponent('node-tag'),
                      asControl(),
                      actions.class.top('[&_label]:w-30'),
                      v.title('forcedTags'),
                      actions.wrappers.set(['label-wrapper']),
                      actions.props.patch({
                        labelPosition: 'left',
                      }),
                    ),
                    machineKey: v.pipe(
                      ROStrItemDefine,
                      v.title('machineKey'),
                      actions.inputs.patchAsync({
                        content: (field) => {
                          return computed(() => field.context['item$']().machineKey);
                        },
                      }),
                    ),
                    discoKey: v.pipe(
                      ROStrItemDefine,
                      v.title('discoKey'),
                      actions.inputs.patchAsync({
                        content: (field) => {
                          return computed(() => field.context['item$']().discoKey);
                        },
                      }),
                    ),
                    name: v.pipe(
                      ROStrItemDefine,
                      v.title('name'),
                      actions.inputs.patchAsync({
                        content: (field) => {
                          return computed(() => field.context['item$']().name);
                        },
                      }),
                    ),
                    ipAddresses: v.pipe(
                      v.array(v.pipe(v.string(), setComponent('common-data'))),
                      setComponent('ul'),
                      v.title('ipAddresses'),
                      ROSTRLabelWrapper,
                    ),
                    routes: v.pipe(
                      NFCSchema,
                      setComponent('node-router'),
                      v.title('routes'),
                      ROSTRLabelWrapper,
                    ),
                    user: v.pipe(
                      ROStrItemDefine,
                      v.title('user'),
                      actions.inputs.patchAsync({
                        content: (field) => {
                          return computed(() => {
                            let item = field.context['item$']() as NodeItem;
                            return (item.user?.displayName || item.user?.name) ?? '';
                          });
                        },
                      }),
                    ),
                  }),

                  actions.hooks.merge({
                    allFieldsResolved: (field) => {
                      effect(
                        (fn) => {
                          let item = field.context!['item$']() as NodeItem;

                          field.form.control!.updateValue({
                            nodeTag: item.forcedTags,
                            ipAddresses: item.ipAddresses,
                          });
                          let api: ApiService = field.context['api'];
                          untracked(() => {
                            let ref = field
                              .get(['nodeTag'])!
                              .form.control!.valueChanges.pipe(skip(1), filter(Boolean))
                              .subscribe(async (value) => {
                                await firstValueFrom(api.SetTags(item.id!, { tags: value }));
                              });
                            fn(() => {
                              ref.unsubscribe();
                            });
                          });
                        },
                        { injector: field.injector },
                      );
                    },
                  }),
                  actions.wrappers.set([
                    {
                      type: 'td',
                      attributes: {
                        colspan: '8',
                      },
                    },
                    { type: 'div', attributes: { class: 'flex flex-col gap-4' } },
                  ]),
                  hideWhen({
                    listen(fn, field) {
                      let sm = field.context.status['selectionModel$$'] as Observable<
                        SelectionModel<unknown>
                      >;
                      return combineLatest([
                        toObservable(field.context['item$'], {
                          injector: field.injector,
                        }),
                        sm,
                      ]).pipe(
                        map(([item, sm]) => {
                          return !sm.isSelected(item);
                        }),
                        startWith(true),
                      );
                    },
                  }),
                ),
              },
            },
          };
        },
      }),
      actions.props.patch({ sortList: ['createdAt', 'lastSeen', 'givenName', 'id'] }),
      actions.props.patchAsync({
        data: (field) => {
          let api = field.context['api'] as ApiService;
          return requestLoading(field, ['@table-block'], () => {
            return firstValueFrom(
              api.ListNodes().pipe(
                map((item) => {
                  return item.nodes ?? [];
                }),
              ),
            );
          });
        },
        localSearchOptions: (field) => {
          return {
            filterFn: (
              item: NodeItem,
              queryParams?: v.InferOutput<typeof FilterCondition>['params'],
            ) => {
              if (!queryParams) {
                return true;
              }
              let result = true;
              if (queryParams.givenName && item.givenName) {
                result = item.givenName.toLowerCase().includes(queryParams.givenName);
                if (!result) {
                  return result;
                }
              }
              if (queryParams.createdAt && item.createdAt) {
                result = timeInRange(item.createdAt, queryParams.createdAt);
                if (!result) {
                  return result;
                }
              }
              if (queryParams.lastSeen && item.lastSeen) {
                result = timeInRange(item.lastSeen, queryParams.lastSeen);
                if (!result) {
                  return result;
                }
              }
              if (queryParams.ip && item.ipAddresses) {
                let ip = queryParams.ip.toLowerCase();
                result = item.ipAddresses.some((item) => item.toLowerCase().includes(ip));
                if (!result) {
                  return result;
                }
              }
              if (queryParams.registerMethod) {
                result = item.registerMethod===queryParams.registerMethod
                if (!result) {
                  return result;
                }
              }
              return result;
            },
          };
        },
        filterParams: (field) => {
          return field.get(['@filterParams'])!.form.control!.valueChanges;
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
              filter: value['filterParams'],
            },
          };
        };
      }),
    ),

    bottom: v.pipe(
      v.object({
        _: v.pipe(NFCSchema, setComponent('div')),
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
