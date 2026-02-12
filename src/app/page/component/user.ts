import * as v from 'valibot';
import {
  _PiResolvedCommonViewFieldConfig,
  formConfig,
  hideWhen,
  NFCSchema,
  setAlias,
  setComponent,
} from '@piying/view-angular-core';
import { computed } from '@angular/core';
import { actions } from '@piying/view-angular';
import { combineLatest, firstValueFrom, map, Observable, startWith } from 'rxjs';
import {
  SortService,
  TableExpandService,
  TableResourceService,
} from '@piying-lib/angular-daisyui/extension';
import { ApiService } from '../../service/api.service';
import { User } from '../../../api/item.type';
import { DialogService } from '../../service/dialog.service';
import { SelectionModel } from '@angular/cdk/collections';
import { PreAuthkeyPageDefine } from './preauthkey';
import { localRequest } from '../../util/local-request';
import { timeInRange } from '../../util/time-in-range';
import { PickerTimeRangeDefine } from '../../define/picker-time-range';
import { LeftTitleAction } from '../../define/left-title';
import { toObservable } from '@angular/core/rxjs-interop';
import { formatDatetimeToStr } from '../../util/time-to-str';
import { deepEqual } from 'fast-equals';
const RenameDefine = v.pipe(
  v.object({
    name: v.pipe(v.string(), v.title('newName')),
  }),
);
const CreateUserDefine = v.pipe(
  v.object({
    name: v.pipe(v.optional(v.string()), v.title('name')),
    displayName: v.pipe(v.optional(v.string()), v.title('displayName')),
    email: v.pipe(v.optional(v.pipe(v.string(), v.email())), v.title('email')),
    pictureUrl: v.pipe(v.optional(v.pipe(v.string(), v.url())), v.title('pictureUrl')),
  }),
);
const FilterCondition = v.pipe(
  v.object({
    params: v.pipe(
      v.object({
        name: v.pipe(v.optional(v.string()), v.title('name'), LeftTitleAction),
        createdAt: v.pipe(v.optional(PickerTimeRangeDefine), v.title('createdAt'), LeftTitleAction),
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
            field.injector.get(TableResourceService).setParams('query', result.value);
          };
        },
      }),
    ),
  }),
  actions.wrappers.set(['div']),
  actions.class.top('flex gap-2'),
);
export const UserPageDefine = v.pipe(
  v.object({
    query: FilterCondition,
    table: v.pipe(
      NFCSchema,
      setAlias('userTable'),
      setComponent('table'),
      actions.inputs.patchAsync({
        define: (field) => {
          return {
            row: {
              head: [
                {
                  columns: [
                    'expand',
                    'id',
                    'name',
                    'displayName',
                    'email',
                    'providerId',
                    'provider',
                    'profilePicUrl',
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
                    'id',
                    'name',
                    'displayName',
                    'email',
                    'providerId',
                    'provider',
                    'profilePicUrl',
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
                head: 'id',
                body: (data: User) => {
                  return data.id;
                },
              },
              name: {
                head: 'name',
                body: (data: User) => {
                  return data.name;
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
                  }),
                ),
                body: (data: User) => {
                  return formatDatetimeToStr(data.createdAt);
                },
              },
              displayName: {
                head: 'displayName',
                body: (data: User) => {
                  return data.displayName;
                },
              },
              email: {
                head: 'email',
                body: (data: User) => {
                  return data.email;
                },
              },
              providerId: {
                head: 'providerId',
                body: (data: User) => {
                  return data.providerId;
                },
              },
              provider: {
                head: 'provider',
                body: (data: User) => {
                  return data.provider;
                },
              },
              profilePicUrl: {
                head: 'profilePicUrl',
                body: (data: User) => {
                  return data.profilePicUrl;
                },
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
                            const dialog: DialogService = field.context['dialog'];
                            const ref = dialog.openDialog({
                              title: 'rename',
                              schema: RenameDefine,
                              async applyValue(value) {
                                const api: ApiService = field.context['api'];
                                const item = field.context['item$']();
                                await firstValueFrom(api.RenameUser(item.id, value.name));

                                field.injector.get(TableResourceService).needUpdate();
                                return true;
                              },
                            });
                            // let result = await firstValueFrom(ref.closed);
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
                            const item = field.context['item$']();
                            await firstValueFrom(api.DeleteUser(item.id));
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

              extra: {
                body: v.pipe(
                  PreAuthkeyPageDefine,
                  actions.props.patchAsync({
                    user$$: (field) => {
                      return computed(() => field.context!['item$']);
                    },
                  }),

                  actions.wrappers.set([
                    {
                      type: 'td',
                      attributes: {
                        colspan: '10',
                      },
                    },
                    { type: 'label-wrapper' },
                    { type: 'loading-wrapper' },
                  ]),
                  v.title('Preauthkey'),
                  hideWhen({
                    listen(fn, field) {
                      let userTableField = field.context[
                        'parentField'
                      ]() as _PiResolvedCommonViewFieldConfig;
                      const sm = userTableField.injector.get(TableExpandService).selectionModel$$;
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
              const tableField = field.get(['@userTable'])!;
              return () => {
                const dialog: DialogService = field.context['dialog'];
                dialog.openDialog({
                  title: 'new',
                  schema: v.pipe(CreateUserDefine),
                  applyValue: async (value) => {
                    const api: ApiService = field.context['api'];
                    await firstValueFrom(api.CreateUser(value));
                    const status: TableResourceService = tableField.props()['status'];
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
  setAlias('table-block'),
  actions.wrappers.set([{ type: 'loading-wrapper' }]),
  actions.props.patchAsync({
    isLoading: (field) => field.injector.get(TableResourceService).isLoading$$,
  }),
  actions.providers.patch([TableResourceService, TableExpandService, SortService]),
  actions.hooks.merge({
    allFieldsResolved: (field) => {
      let sort = field.injector.get(SortService);
      sort.sortList.set(['createdAt']);
      sort.setInitValue({
        createdAt: -1,
      });
      sort.value$$.subscribe((value) => {
        field.injector.get(TableResourceService).setParams('sort', value);
      });
      field.injector.get(TableExpandService).init({ _multiple: true, compareWith: deepEqual });
      let api = field.injector.get(ApiService);
      field.injector.get(TableResourceService).setRequest(
        localRequest(
          (input) => {
            return firstValueFrom(
              api.ListUsers().pipe(
                map((item) => {
                  let list = item.users ?? [];
                  return [list.length, list];
                }),
              ),
            );
          },
          (item, queryParams?: Record<string, any>) => {
            if (!queryParams) {
              return true;
            }
            let result = true;
            if (queryParams['name'] && item.name) {
              result = item.name.toLowerCase().includes(queryParams['name']);
              if (!result) {
                return result;
              }
            }
            if (queryParams['createdAt'] && item.createdAt) {
              result = timeInRange(item.createdAt, queryParams['createdAt']);
              if (!result) {
                return result;
              }
            }
            return result;
          },
        ),
      );
    },
  }),
);
