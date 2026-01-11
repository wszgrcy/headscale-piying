import * as v from 'valibot';
import {
  _PiResolvedCommonViewFieldConfig,
  actions,
  asControl,
  NFCSchema,
  nonFieldControl,
  renderConfig,
  setComponent,
} from '@piying/view-angular-core';
import { SourceOption } from '../component/source-list/type';
import { of } from 'rxjs';
import { AclSourceService } from '../service/acl-source.service';
import ms from 'ms';
export const IP_CIDR_REGEX: RegExp =
  /^(?:(?:[1-9]|1\d|2[0-4])?\d|25[0-5])(?:\.(?:(?:[1-9]|1\d|2[0-4])?\d|25[0-5])){3}\/(?:\d|[1|2]\d|3[0-2])$|^(?:(?:[\da-f]{1,4}:){7}[\da-f]{1,4}|(?:[\da-f]{1,4}:){1,7}:|(?:[\da-f]{1,4}:){1,6}:[\da-f]{1,4}|(?:[\da-f]{1,4}:){1,5}(?::[\da-f]{1,4}){1,2}|(?:[\da-f]{1,4}:){1,4}(?::[\da-f]{1,4}){1,3}|(?:[\da-f]{1,4}:){1,3}(?::[\da-f]{1,4}){1,4}|(?:[\da-f]{1,4}:){1,2}(?::[\da-f]{1,4}){1,5}|[\da-f]{1,4}:(?::[\da-f]{1,4}){1,6}|:(?:(?::[\da-f]{1,4}){1,7}|:)|fe80:(?::[\da-f]{0,4}){0,4}%[\da-z]+|::(?:f{4}(?::0{1,4})?:)?(?:(?:25[0-5]|(?:2[0-4]|1?\d)?\d)\.){3}(?:25[0-5]|(?:2[0-4]|1?\d)?\d)|(?:[\da-f]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1?\d)?\d)\.){3}(?:25[0-5]|(?:2[0-4]|1?\d)?\d))\/(?:\d|[1-9]\d|1(?:[0|1]\d|2[0-8]))$/iu;
const SrcList: (field: _PiResolvedCommonViewFieldConfig) => SourceOption[] = (field) => {
  let aclSource = field.context['aclSource'] as AclSourceService;
  return [
    { value: '*', label: 'Any' },
    { label: 'User', children$$: aclSource.user$ },
    // todo 应该需要先定义
    // { label: 'Group', children$$: of([]) },
    { label: 'Ip', children: [], define: v.pipe(v.string(), v.ip(), setComponent('source-input')) },

    {
      label: 'Cidr',
      children: [],
      define: v.pipe(
        v.string(),
        v.check((value) => {
          return IP_CIDR_REGEX.test(value);
        }),
        setComponent('source-input'),
      ),
    },
    {
      label: 'Host',
      // 根据后面的定义
      children: [],
    },
    {
      label: 'Tag',
      prefix: 'tag:',
      // 根据后面的定义
      children: [],
      define: v.pipe(v.string(), setComponent('source-input')),
    },
    {
      label: 'Autogroup',
      // 根据后面的定义
      children: [],
    },
  ];
};
const AddDefine = v.pipe(
  v.any(),
  setComponent('picker-ref'),
  actions.inputs.patch({
    overlayConfig: {
      panelClass: 'bg-base-100',
    },
    changeClose: true,
  }),
  actions.inputs.patch({
    trigger: v.pipe(
      NFCSchema,
      setComponent('button'),
      actions.inputs.patch({
        color: 'primary',
        shape: 'circle',
      }),
      actions.inputs.patchAsync({
        content: (field) => {
          return {
            icon: { fontIcon: 'add' },
          };
        },
      }),
    ),
    content: v.pipe(
      v.any(),
      setComponent('source-list'),
      actions.inputs.patchAsync({
        options: (field) => {
          return SrcList(field);
        },
      }),
    ),
  }),
);
// todo dst是host:port,所以之间选择不行
const DstList: (field: _PiResolvedCommonViewFieldConfig) => SourceOption[] = (field) => {
  let aclSource = field.context['aclSource'] as AclSourceService;
  return [
    { value: '*', label: 'Any' },
    { label: 'User', children$$: aclSource.user$ },
    // todo 应该需要先定义
    // { label: 'Group', children$$: of([]) },
    { label: 'Ip', children: [], define: v.pipe(v.string(), v.ip(), setComponent('source-input')) },

    {
      label: 'Cidr',
      children: [],
      define: v.pipe(
        v.string(),
        v.check((value) => {
          return IP_CIDR_REGEX.test(value);
        }),
        setComponent('source-input'),
      ),
    },
    {
      label: 'Host',
      // 根据后面的定义
      children: [],
    },
    {
      label: 'Tag',
      prefix: 'tag:',
      // 根据后面的定义
      children: [],
      define: v.pipe(v.string(), setComponent('source-input')),
    },
    {
      label: 'Autogroup',
      // 根据后面的定义
      children: [
        'self',
        'member',
        'admin',
        'network-admin',
        'it-admin',
        'billing-admin',
        'auditor',
        'owner',
      ].map((item) => {
        return {
          value: item,
        };
      }),
    },
  ];
};
const DstDefine = v.pipe(
  v.any(),
  setComponent('picker-ref'),
  actions.inputs.patch({
    overlayConfig: {
      panelClass: 'bg-base-100',
    },
    changeClose: true,
  }),
  actions.inputs.patch({
    trigger: v.pipe(
      NFCSchema,
      setComponent('button'),
      actions.inputs.patch({
        color: 'primary',
        shape: 'circle',
      }),
      actions.inputs.patchAsync({
        content: (field) => {
          return {
            icon: { fontIcon: 'add' },
          };
        },
      }),
    ),
    content: v.pipe(
      v.any(),
      setComponent('source-list'),
      actions.inputs.patchAsync({
        options: (field) => {
          return DstList(field);
        },
      }),
    ),
  }),
);
export const ACLSchema = v.object({
  // 有
  acls: v.pipe(
    v.optional(
      v.array(
        v.object({
          action: v.pipe(v.literal('accept'), renderConfig({ hidden: true }), setComponent('')),
          src: v.pipe(
            v.array(v.pipe(v.string(), setComponent('editable-badge'))),
            setComponent('column-group'),
            actions.inputs.patch({
              addDefine: AddDefine,
            }),
          ),
          dst: v.array(v.string()),
          proto: v.pipe(
            v.optional(
              v.union([
                v.string(),
                v.picklist([
                  'igmp',
                  'ipv4',
                  'ip-in-ip',
                  'tcp',
                  'egp',
                  'igp',
                  'udp',
                  'gre',
                  'esp',
                  'ah',
                  'sctp',
                ]),
              ]),
            ),
            setComponent('editable-select'),
            asControl(),
            actions.class.component('min-w-20'),
            actions.inputs.patch({
              inputEnable: true,
              options: [
                'igmp',
                'ipv4',
                'ip-in-ip',
                'tcp',
                'egp',
                'igp',
                'udp',
                'gre',
                'esp',
                'ah',
                'sctp',
              ],
            }),
          ),
        }),
      ),
    ),
    actions.inputs.patch({
      defaultValue: () => {
        return {
          action: ['accept'],
          src: [],
          dst: [],
        };
      },
    }),
    setComponent('row-group'),
  ),
  ssh: v.optional(
    v.array(
      v.object({
        action: v.picklist(['accept', 'check']),
        src: v.array(v.string()),
        dst: v.array(v.string()),
        users: v.optional(v.array(v.string())),
        checkPeriod: v.pipe(
          v.optional(
            v.pipe(
              v.string(),
              v.transform((value) => {
                return ms(value as ms.StringValue);
              }),
            ),
          ),
        ),
      }),
    ),
  ),
  hosts: v.optional(v.pipe(v.record(v.string(), v.string()), setComponent('edit-group'))),
  groups: v.optional(
    v.pipe(
      v.record(
        v.pipe(
          v.string(),
          v.transform((input) => {
            return `group:${input}`;
          }),
        ),
        v.pipe(
          v.array(v.pipe(v.string(), setComponent('editable-badge'))),
          setComponent('column-group'),
        ),
      ),
      // todo 更新kv定义
      setComponent('edit-group'),
    ),
  ),
  tagOwners: v.optional(v.record(v.string(), v.array(v.string()))),
  autoApprovers: v.optional(
    v.object({
      routes: v.optional(v.record(v.string(), v.array(v.string()))),
      exitNode: v.optional(v.array(v.string())),
    }),
  ),
});
