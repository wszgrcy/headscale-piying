import * as v from 'valibot';
import { hideWhen, NFCSchema, setAlias, setComponent } from '@piying/view-angular-core';
import { computed } from '@angular/core';
import { actions } from '@piying/view-angular';
import { firstValueFrom, map, startWith, Subject } from 'rxjs';
import { ExpandRowDirective, TableStatusService } from '@piying-lib/angular-daisyui/extension';
import { ApiService } from '../../service/api.service';
import { ListUsersRes } from '../../../api/type';
import { User } from '../../../api/item.type';
import { DialogService } from '../../service/dialog.service';
const RenameDefine = v.pipe(
  v.object({
    name: v.pipe(v.string(), v.title('newName')),
  })
);
const CreateUserDefine = v.pipe(
  v.object({
    name: v.pipe(v.optional(v.string()), v.title('name')),
    displayName: v.pipe(v.optional(v.string()), v.title('displayName')),
    email: v.pipe(v.optional(v.pipe(v.string(), v.email())), v.title('email')),
    pictureUrl: v.pipe(v.optional(v.pipe(v.string(), v.url())), v.title('pictureUrl')),
  })
);
export const UserPageDefine = v.object({
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
                  'id',
                  'name',
                  'createdAt',
                  'displayName',
                  'email',
                  'providerId',
                  'provider',
                  'profilePicUrl',
                  'actions',
                ],
              },
            ],
            body: [
              {
                define: v.pipe(
                  v.tuple([]),
                  setComponent('tr')
                  // actions.directives.set([
                  //   {
                  //     type: ExpandRowDirective,
                  //   },
                  // ])
                ),
                columns: [
                  'id',
                  'name',
                  'createdAt',
                  'displayName',
                  'email',
                  'providerId',
                  'provider',
                  'profilePicUrl',
                  'actions',
                ],
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
              head: 'createdAt',
              body: (data: User) => {
                return data.createdAt;
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
                          console.log(field.context);

                          const dialog: DialogService = field.context['dialog'];
                          let ref = dialog.openDialog({
                            title: 'rename',
                            schema: RenameDefine,
                            async applyValue(value) {
                              console.log(value);
                              let api: ApiService = field.context['api'];
                              let item = field.context['item$']();
                              await firstValueFrom(api.RenameUser(item.id, value.name));
                              let status: TableStatusService = field.context['status'];
                              status.needUpdate();
                              return true;
                            },
                          });
                          // let result = await firstValueFrom(ref.closed);
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
                          let item = field.context['item$']();
                          await firstValueFrom(api.DeleteUser(item.id));
                          let status: TableStatusService = field.context['status'];
                          status.needUpdate();
                        };
                      },
                    })
                  ),
                })
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
        return () =>
          firstValueFrom(
            api.ListUsers().pipe(
              map((item) => {
                return item.users ?? [];
              })
            )
          );
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
              dialog.openDialog({
                title: 'new',
                schema: v.pipe(CreateUserDefine),
                applyValue: async (value) => {
                  let api: ApiService = field.context['api'];
                  await firstValueFrom(api.CreateUser(value));
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
});
