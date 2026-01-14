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
              }),
            ),
          }),
          end: v.object({
            theme: v.pipe(NFCSchema, setComponent('theme-controller')),
          }),
        }),
        setComponent('navbar'),
        actions.class.top('sticky top-0 bg-base-100 z-9'),
      ),
      router: v.pipe(
        NFCSchema,
        setComponent('div'),
        actions.directives.patch([{ type: RouterOutlet }]),
      ),
    }),
    side: v.pipe(
      v.object({
        list: v.pipe(
          NFCSchema,
          setComponent('menu-tree'),
          actions.inputs.patch({
            list: [
              { title: 'user', router: { routerLink: './user' } },
              { title: 'node', router: { routerLink: './node' } },
              { title: 'apikey', router: { routerLink: './apikey' } },
              { title: 'acl', router: { routerLink: './acl' } },

              { type: 'divider' },
              { title: 'status', router: { routerLink: './status' } },
            ],
          }),
          actions.class.top('min-w-[250px]'),
        ),
      }),
      actions.wrappers.set([{ type: 'div' }]),
      actions.class.top('bg-base-100 h-full z-9'),
    ),
  }),
  setComponent('drawer'),
  actions.inputs.patch({
    contentClass: 'flex flex-col *:last:flex-1',
  }),
  actions.class.top('lg:drawer-open'),
);
