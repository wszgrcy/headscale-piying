import { _PiResolvedCommonViewFieldConfig, KeyPath } from '@piying/view-angular-core';
import { RequestFn, SortList } from '@piying-lib/angular-daisyui/extension';

export function localRequest<
  T extends {
    page: {
      size: number;
      index: number;
    };
    query?: any;
    sort?: SortList;
  },
  Item extends Record<string, any>,
>(
  requestFn: (input: T, needUpdate: boolean) => Promise<readonly [number, Item[]]>,
  localSearch?: (item: Item, input: T['query']) => boolean,
): RequestFn {
  let lastData: readonly [number, Item[]] | undefined;
  return async (input: T, needUpdate: boolean) => {
    if (!input.page) {
      return [0, []];
    }
    const result = !lastData || needUpdate ? await requestFn(input, needUpdate) : lastData;
    lastData = result;
    let list = result[1].slice();
    if (localSearch) {
      list = list.filter((item) => {
        return localSearch(item, input.query);
      });
    }
    if (input.sort && input.sort.length > 0) {
      input.sort.forEach(({ key, value }) => {
        list.sort((a, b) => {
          const aValue = (a as any)[key];
          const bValue = (b as any)[key];
          if (aValue == null && bValue == null) return 0;
          if (aValue == null) return value;
          if (bValue == null) return -value;
          if (aValue < bValue) return value;
          if (aValue > bValue) return -value;
          return 0;
        });
      });
    }
    let start = input.page.index * input.page.size;
    list = list.slice(start, start + input.page.size);
    return [result[0], list];
  };
}
