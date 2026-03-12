import { describe, expect, it, mock } from 'bun:test';
import type { HttpClient } from '../../src/http.js';
import { UsersResource } from '../../src/resources/users.js';

function makeClient(returnValue: unknown): HttpClient {
  return { request: mock(() => Promise.resolve(returnValue)) } as unknown as HttpClient;
}

describe('UsersResource', () => {
  it('list() calls act=users with no params', async () => {
    const client = makeClient({ users: {} });
    await new UsersResource(client).list();
    expect(client.request).toHaveBeenCalledWith('users', {}, {});
  });

  it('list() returns users map', async () => {
    const users = { '1': { uid: '1', email: 'a@b.com', status: '1', type: '0' } };
    const client = makeClient({ users });
    const result = await new UsersResource(client).list();
    expect(result).toEqual(users);
  });

  it('create() calls act=adduser with params as body', async () => {
    const client = makeClient({ done: 1 });
    await new UsersResource(client).create({ email: 'a@b.com', password: 'pw' });
    expect(client.request).toHaveBeenCalledWith(
      'adduser',
      {},
      expect.objectContaining({ email: 'a@b.com' }),
    );
  });

  it('delete() calls act=deleteuser with uid body', async () => {
    const client = makeClient({ done: 1 });
    await new UsersResource(client).delete('42');
    expect(client.request).toHaveBeenCalledWith('deleteuser', {}, { uid: '42' });
  });

  it('suspend() calls act=usersuspend with uid body', async () => {
    const client = makeClient({ done: 1 });
    await new UsersResource(client).suspend('42');
    expect(client.request).toHaveBeenCalledWith('usersuspend', {}, { uid: '42' });
  });

  it('unsuspend() calls act=userunsuspend with uid body', async () => {
    const client = makeClient({ done: 1 });
    await new UsersResource(client).unsuspend('42');
    expect(client.request).toHaveBeenCalledWith('userunsuspend', {}, { uid: '42' });
  });
});
