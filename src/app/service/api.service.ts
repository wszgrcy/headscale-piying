import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { LocalSaveService } from './local-save.service';
import { paths } from '../../api/headscale.swagger';
//l4BHYTP.nIhRafSJT4IXKDjNyEJ5lDDQhW_qp0Yv

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  #http = inject(HttpClient);
  #ls = inject(LocalSaveService);
  ListApiKeys() {
    return this.#http.get<paths['/api/v1/apikey']['get']['responses']['200']['schema']>(
      `${this.#ls.prefix$$()}/api/v1/apikey`,
    );
  }

  CreateApiKey(body: paths['/api/v1/apikey']['post']['parameters']['body']['body']) {
    return this.#http.post<paths['/api/v1/apikey']['post']['responses']['200']['schema']>(
      `${this.#ls.prefix$$()}/api/v1/apikey`,
      body,
    );
  }

  ExpireApiKey(body: paths['/api/v1/apikey/expire']['post']['parameters']['body']['body']) {
    return this.#http.post<paths['/api/v1/apikey/expire']['post']['responses']['200']['schema']>(
      `${this.#ls.prefix$$()}/api/v1/apikey/expire`,
      body,
    );
  }

  DeleteApiKey(prefix: string) {
    return this.#http.delete<
      paths['/api/v1/apikey/{prefix}']['delete']['responses']['200']['schema']
    >(`${this.#ls.prefix$$()}/api/v1/apikey/${prefix}`);
  }

  DebugCreateNode(body: paths['/api/v1/debug/node']['post']['parameters']['body']['body']) {
    return this.#http.post<paths['/api/v1/debug/node']['post']['responses']['200']['schema']>(
      `${this.#ls.prefix$$()}/api/v1/debug/node`,
      body,
    );
  }

  Health() {
    return this.#http.get<paths['/api/v1/health']['get']['responses']['200']['schema']>(
      `${this.#ls.prefix$$()}/api/v1/health`,
    );
  }

  ListNodes(params: paths['/api/v1/node']['get']['parameters']['query'] = {}) {
    return this.#http.get<paths['/api/v1/node']['get']['responses']['200']['schema']>(
      `${this.#ls.prefix$$()}/api/v1/node`,
      { params },
    );
  }

  BackfillNodeIPs(params: paths['/api/v1/node/backfillips']['post']['parameters']['query'] = {}) {
    return this.#http.post<paths['/api/v1/node/backfillips']['post']['responses']['200']['schema']>(
      `${this.#ls.prefix$$()}/api/v1/node/backfillips`,
      null,
      { params },
    );
  }

  RegisterNode(params: paths['/api/v1/node/register']['post']['parameters']['query'] = {}) {
    return this.#http.post<paths['/api/v1/node/register']['post']['responses']['200']['schema']>(
      `${this.#ls.prefix$$()}/api/v1/node/register`,
      null,
      { params },
    );
  }

  GetNode(nodeId: string) {
    return this.#http.get<paths['/api/v1/node/{nodeId}']['get']['responses']['200']['schema']>(
      `${this.#ls.prefix$$()}/api/v1/node/${nodeId}`,
    );
  }

  DeleteNode(nodeId: string) {
    return this.#http.delete<
      paths['/api/v1/node/{nodeId}']['delete']['responses']['200']['schema']
    >(`${this.#ls.prefix$$()}/api/v1/node/${nodeId}`);
  }

  SetApprovedRoutes(
    nodeId: string,
    body: paths['/api/v1/node/{nodeId}/approve_routes']['post']['parameters']['body']['body'],
  ) {
    return this.#http.post<
      paths['/api/v1/node/{nodeId}/approve_routes']['post']['responses']['200']['schema']
    >(`${this.#ls.prefix$$()}/api/v1/node/${nodeId}/approve_routes`, body);
  }

  ExpireNode(
    nodeId: string,
    params: paths['/api/v1/node/{nodeId}/expire']['post']['parameters']['query'] = {},
  ) {
    return this.#http.post<
      paths['/api/v1/node/{nodeId}/expire']['post']['responses']['200']['schema']
    >(`${this.#ls.prefix$$()}/api/v1/node/${nodeId}/expire`, null, { params });
  }

  RenameNode(nodeId: string, newName: string) {
    return this.#http.post<
      paths['/api/v1/node/{nodeId}/rename/{newName}']['post']['responses']['200']['schema']
    >(`${this.#ls.prefix$$()}/api/v1/node/${nodeId}/rename/${newName}`, null);
  }

  SetTags(
    nodeId: string,
    body: paths['/api/v1/node/{nodeId}/tags']['post']['parameters']['body']['body'],
  ) {
    return this.#http.post<
      paths['/api/v1/node/{nodeId}/tags']['post']['responses']['200']['schema']
    >(`${this.#ls.prefix$$()}/api/v1/node/${nodeId}/tags`, body);
  }

  GetPolicy() {
    return this.#http.get<paths['/api/v1/policy']['get']['responses']['200']['schema']>(
      `${this.#ls.prefix$$()}/api/v1/policy`,
    );
  }

  SetPolicy(body: paths['/api/v1/policy']['put']['parameters']['body']['body']) {
    return this.#http.put<paths['/api/v1/policy']['put']['responses']['200']['schema']>(
      `${this.#ls.prefix$$()}/api/v1/policy`,
      body,
    );
  }

  ListPreAuthKeys(params: paths['/api/v1/preauthkey']['get']['parameters']['query'] = {}) {
    return this.#http.get<paths['/api/v1/preauthkey']['get']['responses']['200']['schema']>(
      `${this.#ls.prefix$$()}/api/v1/preauthkey`,
      { params },
    );
  }

  CreatePreAuthKey(body: paths['/api/v1/preauthkey']['post']['parameters']['body']['body']) {
    return this.#http.post<paths['/api/v1/preauthkey']['post']['responses']['200']['schema']>(
      `${this.#ls.prefix$$()}/api/v1/preauthkey`,
      body,
    );
  }

  DeletePreAuthKey(params: paths['/api/v1/preauthkey']['delete']['parameters']['query'] = {}) {
    return this.#http.delete<paths['/api/v1/preauthkey']['delete']['responses']['200']['schema']>(
      `${this.#ls.prefix$$()}/api/v1/preauthkey`,
      { params },
    );
  }

  ExpirePreAuthKey(body: paths['/api/v1/preauthkey/expire']['post']['parameters']['body']['body']) {
    return this.#http.post<
      paths['/api/v1/preauthkey/expire']['post']['responses']['200']['schema']
    >(`${this.#ls.prefix$$()}/api/v1/preauthkey/expire`, body);
  }

  ListUsers(params: paths['/api/v1/user']['get']['parameters']['query'] = {}) {
    return this.#http.get<paths['/api/v1/user']['get']['responses']['200']['schema']>(
      `${this.#ls.prefix$$()}/api/v1/user`,
      { params },
    );
  }

  CreateUser(body: paths['/api/v1/user']['post']['parameters']['body']['body']) {
    return this.#http.post<paths['/api/v1/user']['post']['responses']['200']['schema']>(
      `${this.#ls.prefix$$()}/api/v1/user`,
      body,
    );
  }

  DeleteUser(id: string) {
    return this.#http.delete<paths['/api/v1/user/{id}']['delete']['responses']['200']['schema']>(
      `${this.#ls.prefix$$()}/api/v1/user/${id}`,
    );
  }

  RenameUser(oldId: string, newName: string) {
    type pathParameters =
      paths['/api/v1/user/{oldId}/rename/{newName}']['post']['parameters']['path'];
    return this.#http.post<
      paths['/api/v1/user/{oldId}/rename/{newName}']['post']['responses']['200']['schema']
    >(`${this.#ls.prefix$$()}/api/v1/user/${oldId}/rename/${newName}`, null);
  }
}
