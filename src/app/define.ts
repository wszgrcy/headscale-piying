import * as NFCCGroup from '@piying-lib/angular-daisyui/non-field-control';
import * as FCCGroup from '@piying-lib/angular-daisyui/field-control';
import * as FGCGroup from '@piying-lib/angular-daisyui/field-group';
import { reflectComponentType, Type } from '@angular/core';
import { PiViewConfig, PiyingViewGroup } from '@piying/view-angular';
import { RouterOutlet } from '@angular/router';
import { DivWC } from './component/div-wrapper/component';
import { DivNFCC } from './component/div/component';
import { ExtComponentGroup, ExtWrapperGroup } from '@piying-lib/angular-daisyui/extension';
import * as WrapperGroup from '@piying-lib/angular-daisyui/wrapper';
import { InputFCC } from '@piying-lib/angular-daisyui/field-control';
import { StrOrTemplateComponent } from '@piying-lib/angular-core';
import { actions, setComponent } from '@piying/view-angular-core';
import { NodeTagFCC } from './component/node-tag/component';
import { UlGroup } from './component/ul/component';
import { NodeRouterNFCC } from './component/routes/component';
import { ACLTxtEditorFCC } from './component/acl-text-editor/component';
import { InputButtonNFCC } from './component/input-button/component';
import { RowGroupFGC } from './component/row-group/component';
import { ArrayGroupFGC } from './component/column-group/component';
import { SourceListFCC } from './component/source-list';
import { SourceInputFCC } from './component/source-input';
import { EditableBadgeFCC } from './component/edit-badge';
import { EditableSelectFCC } from './component/select/component';
import { EditGroupFGC } from './component/edit-group/component';
import { ValidateTooltipbWC } from './component/wrapper/validate-tooltip/component';
const selectorPrefix = 'app-';

const list = [
  ...Object.values(NFCCGroup),
  ...Object.values(FCCGroup),
  ...Object.values(FGCGroup),
  ...Object.values(ExtComponentGroup),
] as Type<any>[];

const types = list.reduce(
  (obj, item) => {
    const result = reflectComponentType(item);
    if (!result) {
      return obj;
    }
    obj[
      result.selector.startsWith(selectorPrefix)
        ? result.selector.slice(selectorPrefix.length)
        : result.selector
    ] = {
      type: item,
    };
    return obj;
  },
  {} as Record<string, any>,
);
const defaultWrapper = [...Object.values(WrapperGroup), ...Object.values(ExtWrapperGroup)].reduce(
  (obj, item) => {
    const result = reflectComponentType(item as any);
    if (!result) {
      return obj;
    }
    obj[
      result.selector.startsWith(selectorPrefix)
        ? result.selector.slice(selectorPrefix.length)
        : result.selector
    ] = {
      type: item,
    };
    return obj;
  },
  {} as Record<string, any>,
);
export const FormDefine = {
  string: {
    actions: [
      setComponent(InputFCC),
      actions.wrappers.set(['label-wrapper', 'validate-tooltip-wrapper']),
    ],
  },
  number: {
    actions: [
      setComponent(InputFCC),
      actions.inputs.set({ type: 'number' }),
      actions.wrappers.set(['label-wrapper']),
    ],
  },
  range: {
    actions: [setComponent(FCCGroup.RangeFCC), actions.wrappers.set(['label-wrapper'])],
  },
  date: {
    actions: [
      setComponent(InputFCC),
      actions.inputs.set({ type: 'date' }),
      actions.wrappers.set(['label-wrapper']),
    ],
  },
  boolean: {
    actions: [
      setComponent(FCCGroup.CheckboxFCC),
      actions.wrappers.set(['label-wrapper']),
      actions.props.patch({
        labelPosition: 'right',
      }),
    ],
  },
  toggle: {
    actions: [
      setComponent(FCCGroup.ToggleFCC),
      actions.wrappers.set(['label-wrapper']),
      actions.props.patch({
        labelPosition: 'right',
      }),
    ],
  },
  select: {
    actions: [setComponent(FCCGroup.SelectFCC), actions.wrappers.set(['label-wrapper'])],
  },
  picklist: {
    actions: [setComponent(FCCGroup.SelectFCC), actions.wrappers.set(['label-wrapper'])],
  },
  radio: {
    actions: [setComponent(FCCGroup.RadioFCC), actions.wrappers.set(['label-wrapper'])],
  },
  textarea: {
    actions: [setComponent(FCCGroup.TextareaFCC), actions.wrappers.set(['label-wrapper'])],
  },
  array: {
    actions: [setComponent(PiyingViewGroup)],
  },
  record: {
    actions: [setComponent(PiyingViewGroup)],
  },
  tuple: {
    actions: [setComponent(PiyingViewGroup)],
  },
  'row-group': {
    actions: [setComponent(RowGroupFGC)],
  },
  'column-group': {
    actions: [setComponent(ArrayGroupFGC)],
  },
  'editable-badge': {
    actions: [setComponent(EditableBadgeFCC)],
  },
  'editable-select': {
    actions: [setComponent(EditableSelectFCC)],
  },
  'edit-group': {
    actions: [setComponent(EditGroupFGC)],
  },
} as PiViewConfig['types'];

export const FieldGlobalConfig: PiViewConfig = {
  types: {
    ...types,
    ...FormDefine,
    'router-outlet': { type: RouterOutlet },
    object: { type: PiyingViewGroup },
    div: {
      type: DivNFCC,
    },

    'common-data': {
      type: StrOrTemplateComponent,
    },
    'node-tag': {
      type: NodeTagFCC,
    },
    ul: {
      type: UlGroup,
    },
    'node-router': {
      type: NodeRouterNFCC,
    },
    'acl-text-editor': {
      type: ACLTxtEditorFCC,
    },
    'input-button': {
      type: InputButtonNFCC,
    },
    'source-list': {
      type: SourceListFCC,
    },
    'source-input': {
      actions: [setComponent(SourceInputFCC)],
    },
  },
  wrappers: {
    ...defaultWrapper,
    div: {
      type: DivWC,
    },
    'validate-tooltip-wrapper': {
      type: ValidateTooltipbWC,
    },
  },
};
