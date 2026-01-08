import * as v from 'valibot';
import {
  actions,
  asControl,
  NFCSchema,
  nonFieldControl,
  renderConfig,
  setComponent,
} from '@piying/view-angular-core';
const AddDefine = v.pipe(
  v.any(),
  setComponent('picker-ref'),
  actions.inputs.patch({
    overlayConfig: {
      panelClass: 'bg-base-100',
    },
  }),
  actions.inputs.patch({
    trigger: v.pipe(
      NFCSchema,
      setComponent('button'),
      actions.inputs.patch({
        shape: 'primary',
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
          return [{ value: '123' }];
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
            v.array(v.string()),

            setComponent('column-group'),
            actions.inputs.patch({
              addDefine: AddDefine,
            }),
          ),
          dst: v.array(v.string()),
          proto: v.pipe(
            v.optional(
              v.union([
                v.pipe(
                  v.number(),
                  v.check((a) => {
                    return a > 0 && a < 256;
                  }),
                ),
                v.picklist([
                  'igmp',
                  'ipv4, ip-in-ip',
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
            setComponent('number'),
            asControl(),
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
        checkPeriod: v.optional(v.string()),
      }),
    ),
  ),
  hosts: v.optional(v.record(v.string(), v.string())),
  groups: v.optional(v.record(v.string(), v.array(v.string()))),
  tagOwners: v.optional(v.record(v.string(), v.array(v.string()))),
  autoApprovers: v.optional(
    v.object({
      routes: v.optional(v.record(v.string(), v.array(v.string()))),
      exitNode: v.optional(v.array(v.string())),
    }),
  ),
});
