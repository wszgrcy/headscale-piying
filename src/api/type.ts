import { paths } from './headscale.swagger';

export type ListApiKeysRes = paths['/api/v1/apikey']['get']['responses']['200']['schema'];
export type CreateApiKeyRes = paths['/api/v1/apikey']['post']['responses']['200']['schema'];
export type ExpireApiKeyRes = paths['/api/v1/apikey/expire']['post']['responses']['200']['schema'];
export type DeleteApiKeyRes =
  paths['/api/v1/apikey/{prefix}']['delete']['responses']['200']['schema'];
export type DebugCreateNodeRes = paths['/api/v1/debug/node']['post']['responses']['200']['schema'];
export type HealthRes = paths['/api/v1/health']['get']['responses']['200']['schema'];
export type ListNodesRes = paths['/api/v1/node']['get']['responses']['200']['schema'];
export type BackfillNodeIPsRes =
  paths['/api/v1/node/backfillips']['post']['responses']['200']['schema'];
export type RegisterNodeRes = paths['/api/v1/node/register']['post']['responses']['200']['schema'];
export type GetNodeRes = paths['/api/v1/node/{nodeId}']['get']['responses']['200']['schema'];
export type DeleteNodeRes = paths['/api/v1/node/{nodeId}']['delete']['responses']['200']['schema'];
export type SetApprovedRoutesRes =
  paths['/api/v1/node/{nodeId}/approve_routes']['post']['responses']['200']['schema'];
export type ExpireNodeRes =
  paths['/api/v1/node/{nodeId}/expire']['post']['responses']['200']['schema'];
export type RenameNodeRes =
  paths['/api/v1/node/{nodeId}/rename/{newName}']['post']['responses']['200']['schema'];
export type SetTagsRes = paths['/api/v1/node/{nodeId}/tags']['post']['responses']['200']['schema'];
export type GetPolicyRes = paths['/api/v1/policy']['get']['responses']['200']['schema'];
export type SetPolicyRes = paths['/api/v1/policy']['put']['responses']['200']['schema'];
export type ListPreAuthKeysRes = paths['/api/v1/preauthkey']['get']['responses']['200']['schema'];
export type CreatePreAuthKeyRes = paths['/api/v1/preauthkey']['post']['responses']['200']['schema'];
export type DeletePreAuthKeyRes =
  paths['/api/v1/preauthkey']['delete']['responses']['200']['schema'];
export type ExpirePreAuthKeyRes =
  paths['/api/v1/preauthkey/expire']['post']['responses']['200']['schema'];
export type ListUsersRes = paths['/api/v1/user']['get']['responses']['200']['schema'];
export type CreateUserRes = paths['/api/v1/user']['post']['responses']['200']['schema'];
export type DeleteUserRes = paths['/api/v1/user/{id}']['delete']['responses']['200']['schema'];
export type RenameUserRes =
  paths['/api/v1/user/{oldId}/rename/{newName}']['post']['responses']['200']['schema'];
