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

  it('delete() calls act=users with delete body', async () => {
    const client = makeClient({ done: 1 });
    await new UsersResource(client).delete('42');
    expect(client.request).toHaveBeenCalledWith('users', {}, { delete: '42' });
  });

  it('suspend() calls act=users with suspend body', async () => {
    const client = makeClient({ done: 1 });
    await new UsersResource(client).suspend('42');
    expect(client.request).toHaveBeenCalledWith('users', {}, { suspend: '42' });
  });

  it('unsuspend() calls act=users with unsuspend body', async () => {
    const client = makeClient({ done: 1 });
    await new UsersResource(client).unsuspend('42');
    expect(client.request).toHaveBeenCalledWith('users', {}, { unsuspend: '42' });
  });

  describe('get(uid)', () => {
    it('calls act=users with uid as body', async () => {
      const client = makeClient({
        user: { '42': { uid: '42', email: 'a@b.com', status: '1', type: '0' } },
      });
      await new UsersResource(client).get('42');
      expect(client.request).toHaveBeenCalledWith('users', {}, { uid: '42' });
    });

    it('returns the user when found', async () => {
      const user = { uid: '42', email: 'a@b.com', status: '1', type: '0' };
      const client = makeClient({ user: { '42': user } });
      const result = await new UsersResource(client).get('42');
      expect(result).toEqual(user);
    });

    it('throws when user not found', async () => {
      const client = makeClient({ user: {} });
      await expect(new UsersResource(client).get('999')).rejects.toThrow('User not found');
    });
  });

  describe('update(params)', () => {
    it('calls act=edituser with params as body', async () => {
      const client = makeClient({ done: 1 });
      await new UsersResource(client).update({ uid: '42', email: 'new@example.com' });
      expect(client.request).toHaveBeenCalledWith(
        'edituser',
        {},
        expect.objectContaining({ uid: '42', email: 'new@example.com' }),
      );
    });

    it('allows updating multiple fields', async () => {
      const client = makeClient({ done: 1 });
      await new UsersResource(client).update({
        uid: '42',
        email: 'new@example.com',
        password: 'newpassword',
        fname: 'John',
        lname: 'Doe',
      });
      expect(client.request).toHaveBeenCalledWith(
        'edituser',
        {},
        expect.objectContaining({
          uid: '42',
          email: 'new@example.com',
          password: 'newpassword',
          fname: 'John',
          lname: 'Doe',
        }),
      );
    });
  });
});
