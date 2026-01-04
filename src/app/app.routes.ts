import { Routes } from '@angular/router';
import { SchemaViewRC } from './schema-view/component';
import { MainPage } from './page/main';
import { LoginDefine } from './page/component/login';
import { LoginPageDefine } from './page/login';
import { inject } from '@angular/core';

import { range } from 'es-toolkit';

import { FieldGlobalConfig } from './define';
import { AccountService } from './service/account.service';
import { UserPageDefine } from './page/component/user';
import { ApiService } from './service/api.service';
import { DialogService } from './service/dialog.service';
import { ApiKeyPageDefine } from './page/component/apikey';
import { NodeItemPageDefine } from './page/component/node';
import { CopyService } from './service/copy.service';

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
              copy: inject(CopyService),
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
];
