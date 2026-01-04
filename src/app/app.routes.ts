import { Routes } from '@angular/router';
import { SchemaViewRC } from './schema-view/component';
import { MainPage } from './page/main';
import { TableDefine } from './page/component/table';
import { LoginDefine } from './page/component/login';
import { LoginPageDefine } from './page/login';
import { inject } from '@angular/core';
import { CategoryDefine } from './page/component/category';
import { CalendarDefine } from './page/component/calendar';
import { SelectDefine } from './page/component/select';
import { TabsDefine } from './page/component/tabs';
import { range } from 'es-toolkit';
import { StatsDefine } from './page/component/stats';
import { FormDefine } from './page/component/form';

import { FieldGlobalConfig } from './define';
import { AccountService } from './service/account.service';
import { UserPageDefine } from './page/component/user';
import { ApiService } from './service/api.service';
import { DialogService } from './service/dialog.service';
import { ApiKeyPageDefine } from './page/component/apikey';
import { NodeItemPageDefine } from './page/component/node';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/web/user',
    pathMatch: 'full',
  },
  {
    path: 'web',
    data: {
      schema: () => MainPage,
    },
    component: SchemaViewRC,
    children: [
      {
        path: 'login',
        component: SchemaViewRC,
        data: {
          schema: () => LoginPageDefine,
          context: () => {
            return {
              account: inject(AccountService),
            };
          },
        },
      },
      {
        path: 'user',
        component: SchemaViewRC,
        data: {
          schema: () => UserPageDefine,
          context: () => {
            return {
              api: inject(ApiService),
              dialog: inject(DialogService),
            };
          },
        },
      },
      {
        path: 'apikey',
        component: SchemaViewRC,
        data: {
          schema: () => ApiKeyPageDefine,
          context: () => {
            return {
              api: inject(ApiService),
              dialog: inject(DialogService),
            };
          },
        },
      },
      {
        path: 'node',
        component: SchemaViewRC,
        data: {
          schema: () => NodeItemPageDefine,
          context: () => {
            return {
              api: inject(ApiService),
              dialog: inject(DialogService),
            };
          },
        },
      },
    ],
  },

  {
    path: 'main',
    data: {
      schema: () => MainPage,
    },
    component: SchemaViewRC,
    children: [
      // {
      //   path: '',

      // },
      {
        path: 'component',
        children: [
          {
            path: '',
            redirectTo: 'table',
            pathMatch: 'full',
          },
          {
            path: 'table',
            component: SchemaViewRC,
            data: {
              schema: () => TableDefine,
            },
          },
          {
            path: 'category',
            component: SchemaViewRC,
            data: {
              schema: () => CategoryDefine,
            },
          },
          {
            path: 'login',
            component: SchemaViewRC,
            data: {
              schema: () => LoginDefine,
            },
          },
          {
            path: 'calendar',
            component: SchemaViewRC,
            data: {
              schema: () => CalendarDefine,
            },
          },
          {
            path: 'select',
            component: SchemaViewRC,
            data: {
              schema: () => SelectDefine,
            },
          },
          {
            path: 'tabs',
            component: SchemaViewRC,
            data: {
              schema: () => TabsDefine,
            },
          },

          {
            path: 'form',
            component: SchemaViewRC,
            data: {
              schema: () => FormDefine,
            },
          },
        ],
      },
    ],
  },
];
