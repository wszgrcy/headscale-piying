import { ListApiKeysRes, ListNodesRes, ListPreAuthKeysRes, ListUsersRes } from './type';

export type User = NonNullable<ListUsersRes['users']>[number];
export type ApiKey = NonNullable<ListApiKeysRes['apiKeys']>[number];
export type PreAuthKeys = NonNullable<ListPreAuthKeysRes['preAuthKeys']>[number];
export type NodeItem = NonNullable<ListNodesRes['nodes']>[number];
