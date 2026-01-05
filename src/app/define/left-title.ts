import { metadataList } from '@piying/valibot-visit';
import { actions } from '@piying/view-angular';
export const LeftTitleAction = metadataList<any>([
  actions.wrappers.set(['label-wrapper']),
  actions.props.patch({
    labelPosition: 'left',
  }),
  actions.class.top('gap-2'),
]);
