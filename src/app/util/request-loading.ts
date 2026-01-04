import {
  _PiResolvedCommonViewFieldConfig,
  KeyPath,
  PiResolvedCommonViewFieldConfig,
} from '@piying/view-angular-core';
import { ApiService } from '../service/api.service';
import { untracked } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
export function requestLoading(
  field: _PiResolvedCommonViewFieldConfig,
  keyPath: KeyPath,
  request: () => Promise<any>
) {
  const defineField = field.get(keyPath)!;
  return async () => {
    const props = defineField.props;

    untracked(() => {
      props.update((value) => {
        return { ...value, isLoading: true };
      });
    });
    let result = await request();
    untracked(() => {
      props.update((value) => {
        return { ...value, isLoading: false };
      });
    });
    return result;
  };
}
