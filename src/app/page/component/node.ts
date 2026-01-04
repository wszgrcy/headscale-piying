import * as v from 'valibot';
import { asControl, hideWhen, NFCSchema, setAlias, setComponent } from '@piying/view-angular-core';
import { computed } from '@angular/core';
import { actions } from '@piying/view-angular';
import { filter, firstValueFrom, map, Observable, skip, startWith, Subject } from 'rxjs';
import { ExpandRowDirective, TableStatusService } from '@piying-lib/angular-daisyui/extension';
import { ApiService } from '../../service/api.service';
import { ListUsersRes } from '../../../api/type';
import { NodeItem } from '../../../api/item.type';
import { DialogService } from '../../service/dialog.service';
import { SelectionModel } from '@angular/cdk/collections';
import { metadataList } from '@piying/valibot-visit';
import { requestLoading } from '../../util/request-loading';
let newDate = new Date();
const ExpireNodeDefine = v.pipe(
  v.object({
    expiry: v.pipe(
      v.optional(v.date(), newDate),
      v.title('expiration'),
      v.transform((input) => {
        return input.toISOString();
      })
    ),
  })
);
const RenameNodeDefine = v.pipe(
  v.object({
    name: v.pipe(v.string(), v.title('name')),
  })
);
const ROSTRLabelWrapper = metadataList<any>([
  actions.class.top('[&_label]:w-30'),
  actions.wrappers.set(['label-wrapper']),
  actions.props.patch({
    labelPosition: 'left',
  }),
]);
// todo dynamic
const ROStrItemDefine = v.pipe(NFCSchema, setComponent('common-data'), ROSTRLabelWrapper);
export const NodeItemPageDefine = v.pipe(
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
                  columns: [
                    'expand',
                    'online',
                    'id',
                    'givenName',
                    'registerMethod',
                    'createdAt',
                    'lastSeen',
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
                    'createdAt',
                    'lastSeen',
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
                  actions.wrappers.set(['td'])
                ),
              },
              id: {
                head: 'id',
                body: (data: NodeItem) => {
                  return data.id;
                },
              },
              givenName: {
                head: 'givenName',
                body: (data: NodeItem) => {
                  return data.givenName;
                },
              },
              createdAt: {
                head: 'createdAt',
                body: (data: NodeItem) => {
                  return data.createdAt;
                },
              },
              lastSeen: {
                head: 'lastSeen',
                body: (data: NodeItem) => {
                  return data.lastSeen;
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
                        (context.item$() as NodeItem).online ? 'success' : 'error'
                      );
                    },
                  })
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
                  })
                ),
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
                      })
                    ),
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
                      })
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
                      })
                    ),
                  }),
                  actions.wrappers.set(['td', { type: 'div', attributes: { class: 'flex gap-2' } }])
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
                      })
                    ),
                    machineKey: v.pipe(
                      ROStrItemDefine,
                      v.title('machineKey'),
                      actions.inputs.patchAsync({
                        content: (field) => {
                          return computed(() => field.context['item$']().machineKey);
                        },
                      })
                    ),
                    discoKey: v.pipe(
                      ROStrItemDefine,
                      v.title('discoKey'),
                      actions.inputs.patchAsync({
                        content: (field) => {
                          return computed(() => field.context['item$']().discoKey);
                        },
                      })
                    ),
                    name: v.pipe(
                      ROStrItemDefine,
                      v.title('name'),
                      actions.inputs.patchAsync({
                        content: (field) => {
                          return computed(() => field.context['item$']().name);
                        },
                      })
                    ),
                    ipAddresses: v.pipe(
                      v.array(v.pipe(v.string(), setComponent('common-data'))),
                      setComponent('ul'),
                      v.title('ipAddresses'),
                      ROSTRLabelWrapper
                    ),
                    routes: v.pipe(
                      NFCSchema,
                      setComponent('node-router'),
                      v.title('routes'),
                      ROSTRLabelWrapper
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
                      })
                    ),
                  }),

                  actions.hooks.merge({
                    allFieldsResolved: (field) => {
                      let item = field.context!['item$']() as NodeItem;

                      setTimeout(() => {
                        field.form.control!.updateValue({
                          nodeTag: item.forcedTags,
                          ipAddresses: item.ipAddresses,
                        });
                        let api: ApiService = field.context['api'];
                        field
                          .get(['nodeTag'])!
                          .form.control!.valueChanges.pipe(skip(1), filter(Boolean))
                          .subscribe(async (value) => {
                            await firstValueFrom(api.SetTags(item.id!, { tags: value }));
                          });
                      }, 0);
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
                      return sm.pipe(
                        map((value) => {
                          return !value.isSelected(field.context.item$());
                        }),
                        startWith(true)
                      );
                    },
                  })
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
          return requestLoading(field, ['@table-block'], () => {
            return firstValueFrom(
              api.ListNodes().pipe(
                map((item) => {
                  return item.nodes ?? [];
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
              let tableField = field.get(['@table'])!;
              return () => {
                const dialog: DialogService = field.context['dialog'];
                // dialog.openDialog({
                //   title: 'new',
                //   schema: v.pipe(CreateNodeItemDefine),
                //   applyValue: async (value) => {
                //     let api: ApiService = field.context['api'];
                //     await firstValueFrom(api.CreateNodeItem(value));
                //     let status: TableStatusService = tableField.props()['status'];
                //     status.needUpdate();
                //   },
                // });
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
  actions.wrappers.set([{ type: 'loading-wrapper' }]),
  setAlias('table-block')
);
