import { _PiResolvedCommonViewFieldConfig, KeyPath } from '@piying/view-angular-core';
import { untracked } from '@angular/core';
export function requestLoading(
  field: _PiResolvedCommonViewFieldConfig,
  keyPath: KeyPath,
  request: () => Promise<any>,
) {
  const defineField = field.get(keyPath)!;
  return async () => {
    const props = defineField.props;

    untracked(() => {
      props.update((value) => {
        return { ...value, isLoading: true };
      });
    });
    const result = await request();
    untracked(() => {
      props.update((value) => {
        return { ...value, isLoading: false };
      });
    });
    return result;
  };
}
