import { computed, inject, Injectable, resource } from '@angular/core';
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
      return firstValueFrom(this.api.ListUsers().pipe(map((result) => result.users ?? [])));
    },
    defaultValue: [],
  });
  user$$ = computed(() => {
    return this.user$.value().map((item) => {
      return {
        label: item.displayName || item.name || '',
        value: `${item.name}@`,
      } as SourceOption;
    });
  });
  getNodeList$ = resource({
    loader: () => {
      return firstValueFrom(
        this.api.ListNodes().pipe(
          map((result) => {
            return result.nodes ?? [];
          }),
        ),
      );
    },
    defaultValue: [],
  });

}
