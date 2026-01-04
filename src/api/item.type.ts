import { ListApiKeysRes, ListNodesRes, ListUsersRes } from './type';

export type User = NonNullable<ListUsersRes['users']>[number];
export type ApiKey = NonNullable<ListApiKeysRes['apiKeys']>[number];
export type NodeItem = NonNullable<ListNodesRes['nodes']>[number];
