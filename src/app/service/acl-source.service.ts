import { inject, Injectable, resource } from '@angular/core';
import { ApiService } from './api.service';
import { firstValueFrom, map } from 'rxjs';
import { SourceOption } from '../component/source-list/type';

@Injectable({
  providedIn: 'root',
})
export class AclSourceService {
  api = inject(ApiService);
  user$ = resource({
    loader: () => {
      return firstValueFrom(
        this.api.ListUsers().pipe(
          map((item) =>
            (item.users ?? []).map((item) => {
              return {
                label: item.displayName || item.name || '',
                value: `${item.name}@`,
              } as SourceOption;
            }),
          ),
        ),
      );
    },
    defaultValue: [],
  });
}
