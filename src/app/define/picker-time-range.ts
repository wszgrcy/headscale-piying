import { computed } from '@angular/core';
import { asControl, actions } from '@piying/view-angular';
import { setComponent, NFCSchema } from '@piying/view-angular-core';
import * as v from 'valibot';
import { timeRangeToStr } from '../util/time-range-to-str';

export const PickerTimeRangeDefine = v.pipe(
  v.tuple([v.date(), v.date()]),
  asControl(),
  setComponent('picker-ref'),
  actions.inputs.patch({
    trigger: v.pipe(
      NFCSchema,
      setComponent('button'),
      actions.inputs.patchAsync({
        content: (field) => {
          return computed(() => {
            const pickerValue = field.context['pickerValue']();
            return pickerValue ? `${timeRangeToStr(pickerValue)}` : '[empty]';
          });
        },
      })
    ),
    content: v.pipe(
      v.tuple([v.date(), v.date()]),
      asControl(),
      setComponent('calendar'),
      actions.inputs.patch({ type: 'range' })
    ),
  })
);
