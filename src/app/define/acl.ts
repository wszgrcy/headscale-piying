import * as v from 'valibot';

export const aclSchema = v.object({
  // 有
  acls: v.optional(
    v.array(
      v.object({
        action: v.literal('accept'),
        src: v.array(v.string()),
        dst: v.array(v.string()),
        proto: v.optional(
          v.union([
            v.pipe(
              v.number(),
              v.check((a) => {
                return a > 0 && a < 256;
              })
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
          ])
        ),
      })
    )
  ),
  ssh: v.optional(
    v.array(
      v.object({
        action: v.picklist(['accept', 'check']),
        src: v.array(v.string()),
        dst: v.array(v.string()),
        users: v.optional(v.array(v.string())),
        checkPeriod: v.optional(v.string()),
      })
    )
  ),
  hosts: v.optional(v.record(v.string(), v.string())),
  groups: v.optional(v.record(v.string(), v.array(v.string()))),
  tagOwners: v.optional(v.record(v.string(), v.array(v.string()))),
  autoApprovers: v.optional(
    v.object({
      routes: v.optional(v.record(v.string(), v.array(v.string()))),
      exitNode: v.optional(v.array(v.string())),
    })
  ),
});
