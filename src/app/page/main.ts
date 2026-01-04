import * as v from 'valibot';
import { NFCSchema, setComponent } from '@piying/view-angular-core';
import { actions } from '@piying/view-angular';
import { RouterOutlet } from '@angular/router';
export const MainPage = v.pipe(
  v.object({
    content: v.object({
      navbar: v.pipe(
        v.object({
          start: v.object({
            menu: v.pipe(
              NFCSchema,
              setComponent('button'),
              actions.inputs.patch({
                content: { icon: { fontIcon: 'menu' } },
                shape: 'square',
                style: 'ghost',
              }),
              actions.attributes.patch({
                for: 'drawer-0',
              })
            ),
          }),
        }),
        setComponent('navbar'),
        actions.class.top('sticky top-0 bg-base-100 z-9')
      ),
      router: v.pipe(
        NFCSchema,
        setComponent('div'),
        actions.directives.patch([{ type: RouterOutlet }])
      ),
    }),
    side: v.pipe(
      v.object({
        list: v.pipe(
          NFCSchema,
          setComponent('menu-tree'),
          actions.inputs.patch({
            list: [
              { title: 'form', router: { routerLink: './component/form' } },
              { title: 'table', router: { routerLink: './component/table' } },
              { title: 'category', router: { routerLink: './component/category' } },
              { title: 'login', router: { routerLink: './component/login' } },
              { title: 'calendar', router: { routerLink: './component/calendar' } },
              { title: 'select', router: { routerLink: './component/select' } },
              { title: 'tabs', router: { routerLink: './component/tabs' } },
              { title: 'card', router: { routerLink: './component/card' } },
              { title: 'stat', router: { routerLink: './component/stat' } },
              { type: 'divider' },
              {
                type: 'group',
                title: 'PAGE',
                children: [{ title: 'login', router: { routerLink: '/login' } }],
              },
              { type: 'divider' },
              {
                type: 'group',
                title: 'DEMO',
                children: [{ title: 'Query Table', router: { routerLink: './demo/query-table' } }],
              },
              { type: 'divider' },
            ],
          }),
          actions.class.top('min-w-[250px]')
        ),
      }),
      actions.wrappers.set([{ type: 'div' }]),
      actions.class.top('bg-base-100 h-full z-9')
    ),
  }),
  setComponent('drawer'),

  actions.class.top('lg:drawer-open')
);
