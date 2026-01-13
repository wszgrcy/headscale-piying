import * as v from 'valibot';
import {
  _PiResolvedCommonViewFieldConfig,
  actions,
  asControl,
  NFCSchema,
  nonFieldControl,
  renderConfig,
  setAlias,
  setComponent,
} from '@piying/view-angular-core';
import { SourceOption } from '../component/source-list/type';
import { of } from 'rxjs';
import { AclSourceService } from '../service/acl-source.service';
import ms from 'ms';
import { AclServiceWC } from '../component/wrapper/acl-service/component';
import { AclService } from '../component/wrapper/acl-service/service';
import { computed } from '@angular/core';
export const IP_CIDR_REGEX: RegExp =
  /^(?:(?:[1-9]|1\d|2[0-4])?\d|25[0-5])(?:\.(?:(?:[1-9]|1\d|2[0-4])?\d|25[0-5])){3}\/(?:\d|[1|2]\d|3[0-2])$|^(?:(?:[\da-f]{1,4}:){7}[\da-f]{1,4}|(?:[\da-f]{1,4}:){1,7}:|(?:[\da-f]{1,4}:){1,6}:[\da-f]{1,4}|(?:[\da-f]{1,4}:){1,5}(?::[\da-f]{1,4}){1,2}|(?:[\da-f]{1,4}:){1,4}(?::[\da-f]{1,4}){1,3}|(?:[\da-f]{1,4}:){1,3}(?::[\da-f]{1,4}){1,4}|(?:[\da-f]{1,4}:){1,2}(?::[\da-f]{1,4}){1,5}|[\da-f]{1,4}:(?::[\da-f]{1,4}){1,6}|:(?:(?::[\da-f]{1,4}){1,7}|:)|fe80:(?::[\da-f]{0,4}){0,4}%[\da-z]+|::(?:f{4}(?::0{1,4})?:)?(?:(?:25[0-5]|(?:2[0-4]|1?\d)?\d)\.){3}(?:25[0-5]|(?:2[0-4]|1?\d)?\d)|(?:[\da-f]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1?\d)?\d)\.){3}(?:25[0-5]|(?:2[0-4]|1?\d)?\d))\/(?:\d|[1-9]\d|1(?:[0|1]\d|2[0-8]))$/iu;
const IpDefine = v.pipe(v.string(), v.ip());
const CidrDefine = v.pipe(
  v.string(),
  v.check((value) => {
    return IP_CIDR_REGEX.test(value);
  }),
);
function createSourceListDefine(
  optionListFn: (field: _PiResolvedCommonViewFieldConfig) => SourceOption[],
  usePort?: boolean,
) {
  return v.pipe(
    v.string(),
    setComponent('picker-ref'),
    actions.inputs.patch({
      changeClose: true,
    }),
    actions.inputs.patch({
      trigger: v.pipe(
        NFCSchema,
        setComponent('button'),
        actions.inputs.patch({
          color: 'primary',
          shape: 'circle',
          size: 'xs',
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
        actions.inputs.patch({
          usePort: usePort,
        }),
        actions.inputs.patchAsync({
          options: (field) => {
            return optionListFn(field);
          },
        }),
      ),
    }),
  );
}
function getIpSource(service: AclService) {
  return {
    label: 'Ip',
    children$$: service.ipList$$,
    define: v.pipe(v.string(), v.ip(), setComponent('source-input')),
  };
}
function getCidrSource(service: AclService) {
  return {
    label: 'Cidr',
    children$$: service.routes$$,
    define: v.pipe(
      v.string(),
      v.check((value) => {
        return IP_CIDR_REGEX.test(value);
      }),
      setComponent('source-input'),
    ),
  };
}
function getTagSource(service: AclService) {
  return {
    label: 'Tag',
    prefix: 'tag:',
    children$$: service.tagList$$,
    define: v.pipe(v.string(), setComponent('source-input')),
  };
}
const SrcList: (field: _PiResolvedCommonViewFieldConfig) => SourceOption[] = (field) => {
  let topField: _PiResolvedCommonViewFieldConfig = field.context['root'] ?? field;
  let rootField = topField.get(['#', '@aclView'])!;
  let service: AclService = rootField.props()['service'];

  return [
    { value: '*', label: 'Any' },
    { label: 'User', children$$: service.users$$ },
    { label: 'Group', children$$: service.groups$$ },
    getIpSource(service),
    getCidrSource(service),
    {
      label: 'Host',
      children$$: service.hosts$$,
    },
    getTagSource(service),
    {
      label: 'Autogroup',
      // 根据后面的定义
      children: [{ value: 'autogroup:member' }, { value: 'autogroup:tagged' }],
    },
  ];
};
const TagOwnerList: (field: _PiResolvedCommonViewFieldConfig) => SourceOption[] = (field) => {
  let topField: _PiResolvedCommonViewFieldConfig = field.context['root'] ?? field;
  let rootField = topField.get(['#', '@aclView'])!;
  let service: AclService = rootField.props()['service'];

  return [
    { label: 'User', children$$: service.users$$ },
    // todo 应该需要先定义
    { label: 'Group', children$$: service.groups$$ },
    getTagSource(service),
  ];
};

// todo dst是host:port,所以之间选择不行
const DstList: (field: _PiResolvedCommonViewFieldConfig) => SourceOption[] = (field) => {
  let topField: _PiResolvedCommonViewFieldConfig = field.context['root'] ?? field;
  let rootField = topField.get(['#', '@aclView'])!;
  let service: AclService = rootField.props()['service'];

  return [
    { value: '*', label: 'Any' },
    { label: 'User', children$$: service.users$$ },
    { label: 'Group', children$$: service.groups$$ },
    getIpSource(service),
    getCidrSource(service),
    {
      label: 'Host',
      children$$: service.hosts$$,
    },
    getTagSource(service),
    {
      label: 'Autogroup',
      // 根据后面的定义
      children: [
        'internet',
        'monitoring',
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
          value: `autogroup:${item}`,
        };
      }),
    },
  ];
};

const SSHSrcList: (field: _PiResolvedCommonViewFieldConfig) => SourceOption[] = (field) => {
  let topField: _PiResolvedCommonViewFieldConfig = field.context['root'] ?? field;
  let rootField = topField.get(['#', '@aclView'])!;
  let service: AclService = rootField.props()['service'];
  return [
    { label: 'User', children$$: service.users$$ },
    getTagSource(service),
    {
      label: 'Autogroup',
      children: [{ value: 'autogroup:self' }],
    },
  ];
};
const SSHDstList: (field: _PiResolvedCommonViewFieldConfig) => SourceOption[] = (field) => {
  let topField: _PiResolvedCommonViewFieldConfig = field.context['root'] ?? field;
  let rootField = topField.get(['#', '@aclView'])!;
  let service: AclService = rootField.props()['service'];
  return [
    { label: 'User', children$$: service.users$$ },
    getTagSource(service),
    {
      label: 'Autogroup',
      children: [{ value: 'autogroup:member' }],
    },
  ];
};
const SSHUsersList: (field: _PiResolvedCommonViewFieldConfig) => SourceOption[] = (field) => {
  let topField: _PiResolvedCommonViewFieldConfig = field.context['root'] ?? field;
  let rootField = topField.get(['#', '@aclView'])!;
  let service: AclService = rootField.props()['service'];
  return [
    { value: '*', label: 'Any' },
    {
      label: 'User',
      children$$: service.username$$,
      define: v.pipe(v.string(), setComponent('source-input')),
    },
    getTagSource(service),
    {
      label: 'Autogroup',
      children: [{ value: 'autogroup:nonroot' }],
    },
  ];
};
export const ACLSchema = v.pipe(
  v.object({
    hosts: v.pipe(
      v.optional(
        v.pipe(
          v.record(
            v.pipe(
              v.string(),
              v.minLength(1),
              actions.attributes.patch({ placeholder: 'host' }),
              v.title('host'),
              actions.props.patch({
                floating: true,
                labelInline: true,
              }),
              v.check((item) => {
                return !item.includes('@');
              }, 'The human-friendly hostname cannot include the character @.'),
            ),
            v.pipe(
              v.union([IpDefine, CidrDefine]),
              asControl(),
              setComponent('string'),
              actions.attributes.patch({ placeholder: 'ip/cidr' }),
              v.title('ip/cidr'),
              actions.props.patch({
                floating: true,
                labelInline: true,
              }),
            ),
          ),
          setComponent('edit-group'),
        ),
      ),
      v.title('hosts'),
      actions.wrappers.patch(['fieldset-wrapper']),
      actions.class.top('bg-base-200 border-base-300 rounded-box w-xs border p-4'),
    ),
    groups: v.pipe(
      v.optional(
        v.pipe(
          v.record(
            v.pipe(
              v.string(),
              v.transform((input) => {
                return `group:${input}`;
              }),
              actions.attributes.patch({ placeholder: 'name' }),
              actions.class.top('min-w-20'),
              v.title('name'),
              actions.props.patch({
                floating: true,
                labelInline: true,
              }),
            ),
            v.pipe(
              v.array(
                v.pipe(
                  v.string(),
                  setComponent('editable-select'),
                  actions.inputs.patch({ filterEnable: true, emptyContent: '[User]' }),
                  actions.inputs.patchAsync({
                    options: (field) => {
                      let topField = field.context['root'] ?? field;
                      let aclSource: AclService = topField.get(['#', '@aclView'])?.props()[
                        'service'
                      ];
                      return aclSource.users$$;
                    },
                  }),
                ),
              ),
              setComponent('column-group'),
              v.title('users'),
              actions.wrappers.patch(['label-wrapper']),
              actions.props.patch({
                labelPosition: 'left',
              }),
            ),
          ),
          // todo 更新kv定义
          setComponent('edit-group'),
        ),
      ),
      v.title('groups'),
      actions.wrappers.patch(['fieldset-wrapper']),
      actions.class.top('bg-base-200 border-base-300 rounded-box w-xs border p-4'),
    ),
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
                addDefine: createSourceListDefine(SrcList),
              }),
              actions.wrappers.set(['label-wrapper']),
              actions.props.patch({
                labelPosition: 'left',
              }),
              v.title('src'),
            ),
            dst: v.pipe(
              v.array(v.pipe(v.string(), setComponent('editable-badge'))),
              setComponent('column-group'),
              actions.inputs.patch({
                addDefine: createSourceListDefine(DstList, true),
              }),
              actions.wrappers.set(['label-wrapper']),
              actions.props.patch({
                labelPosition: 'left',
              }),
              v.title('dst'),
            ),
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
                inputPlaceholder: 'Select Or Input',
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
              actions.wrappers.set(['label-wrapper']),
              actions.props.patch({
                labelPosition: 'left',
              }),
              v.title('proto'),
            ),
          }),
        ),
      ),
      actions.inputs.patch({
        defaultValue: () => {
          return {
            action: 'accept',
            src: [],
            dst: [],
          };
        },
      }),
      setComponent('row-group'),
      v.title('acls'),
      actions.wrappers.patch(['fieldset-wrapper']),
      actions.class.top('bg-base-200 border-base-300 rounded-box w-xs border p-4'),
    ),
    ssh: v.pipe(
      v.optional(
        v.array(
          v.object({
            action: v.pipe(
              v.picklist(['accept', 'check']),
              actions.inputs.patchAsync({
                options: (field) => {
                  return computed(() => {
                    return field.props()['options'];
                  });
                },
              }),
              actions.wrappers.set(['label-wrapper']),
              actions.props.patch({
                labelPosition: 'left',
              }),
              v.title('action'),
            ),
            src: v.pipe(
              v.array(v.pipe(v.string(), setComponent('editable-badge'))),
              setComponent('column-group'),
              actions.inputs.patch({
                addDefine: createSourceListDefine(SSHSrcList),
              }),
              actions.wrappers.set(['label-wrapper']),
              actions.props.patch({
                labelPosition: 'left',
              }),
              v.title('src'),
            ),
            dst: v.pipe(
              v.array(v.pipe(v.string(), setComponent('editable-badge'))),
              setComponent('column-group'),
              actions.inputs.patch({
                addDefine: createSourceListDefine(SSHDstList),
              }),
              actions.wrappers.set(['label-wrapper']),
              actions.props.patch({
                labelPosition: 'left',
              }),
              v.title('dst'),
            ),
            users: v.optional(
              v.pipe(
                v.array(v.pipe(v.string(), setComponent('editable-badge'))),
                setComponent('column-group'),
                actions.inputs.patch({
                  addDefine: createSourceListDefine(SSHUsersList),
                }),
                actions.wrappers.set(['label-wrapper']),
                actions.props.patch({
                  labelPosition: 'left',
                }),
                v.title('users'),
              ),
            ),
            checkPeriod: v.pipe(
              v.optional(
                v.pipe(
                  v.string(),
                  v.transform((value) => {
                    return ms(value as ms.StringValue);
                  }),
                ),
              ),
              v.title('checkPeriod'),
            ),
          }),
        ),
      ),
      setComponent('row-group'),
      v.title('ssh'),
      actions.wrappers.patch(['fieldset-wrapper']),
      actions.class.top('bg-base-200 border-base-300 rounded-box w-xs border p-4'),
    ),

    tagOwners: v.pipe(
      v.optional(
        v.record(
          v.pipe(
            v.string(),
            v.transform((input) => {
              return `tag:${input}`;
            }),
            actions.attributes.patch({ placeholder: 'tag' }),
            v.title('tag'),
            actions.props.patch({
              floating: true,
              labelInline: true,
            }),
            actions.class.top('min-w-20'),
          ),
          v.pipe(
            v.array(v.pipe(v.string(), setComponent('editable-badge'))),
            setComponent('column-group'),
            actions.inputs.patch({
              addDefine: v.pipe(createSourceListDefine(TagOwnerList)),
            }),
            v.title('owners'),
            actions.props.patch({
              labelPosition: 'left',
            }),
            actions.wrappers.patch(['label-wrapper']),
          ),
        ),
      ),
      setComponent('edit-group'),
      v.title('tagOwners'),
      actions.wrappers.patch(['fieldset-wrapper']),
      actions.class.top('bg-base-200 border-base-300 rounded-box w-xs border p-4'),
    ),
    autoApprovers: v.pipe(
      v.optional(
        v.object({
          routes: v.optional(
            v.pipe(
              v.record(
                v.pipe(
                  v.string(),
                  actions.attributes.patch({ placeholder: 'cidr' }),
                  v.title('cidr'),
                  actions.props.patch({
                    floating: true,
                    labelInline: true,
                  }),
                  actions.class.top('min-w-20'),
                ),
                // todo 感觉应该用动态选择
                v.pipe(
                  v.array(v.pipe(v.string(), setComponent('editable-badge'))),
                  setComponent('column-group'),
                  actions.inputs.patch({
                    addDefine: createSourceListDefine(TagOwnerList),
                  }),
                ),
              ),
              setComponent('edit-group'),
              v.title('routes'),
              actions.wrappers.patch(['fieldset-wrapper']),
              actions.class.top('bg-base-200 border-base-300 rounded-box w-xs border p-4'),
            ),
          ),
          exitNode: v.optional(
            v.pipe(
              v.array(v.pipe(v.string(), setComponent('editable-badge'))),
              setComponent('column-group'),
              actions.inputs.patch({
                addDefine: createSourceListDefine(TagOwnerList),
              }),
              v.title('exitNode'),
              actions.props.patch({ labelPosition: 'left' }),
              actions.wrappers.patch(['label-wrapper']),
            ),
          ),
        }),
      ),
      v.title('autoApprovers'),
      actions.wrappers.patch(['fieldset-wrapper']),
      actions.class.top('bg-base-200 border-base-300 rounded-box w-xs border p-4'),
    ),
  }),
  setAlias('aclView'),
  actions.wrappers.set([{ type: AclServiceWC }]),
);
