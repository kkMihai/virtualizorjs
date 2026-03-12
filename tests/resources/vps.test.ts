import { describe, expect, it, mock } from 'bun:test';
import type { HttpClient } from '../../src/http.js';
import { VpsResource } from '../../src/resources/vps.js';

function makeClient(returnValue: unknown): HttpClient {
  return { request: mock(() => Promise.resolve(returnValue)) } as unknown as HttpClient;
}

describe('VpsResource', () => {
  describe('list()', () => {
    it('calls act=vs with no body when no filters given', async () => {
      const client = makeClient({ vs: {} });
      const vps = new VpsResource(client);
      await vps.list();
      expect(client.request).toHaveBeenCalledWith('vs', {}, {});
    });

    it('returns vs map from response', async () => {
      const vs = {
        '1': {
          vpsid: '1',
          hostname: 'test',
          status: '1',
          ram: '1024',
          hdd: '20480',
          bandwidth: '1000',
          os_name: 'ubuntu',
          ip: '1.2.3.4',
        },
      };
      const client = makeClient({ vs });
      const result = await new VpsResource(client).list();
      expect(result).toEqual(vs);
    });

    it('passes user email filter to request body', async () => {
      const client = makeClient({ vs: {} });
      await new VpsResource(client).list({ user: 'user@example.com' });
      expect(client.request).toHaveBeenCalledWith('vs', {}, { user: 'user@example.com' });
    });

    it('passes numeric uid filter to request body', async () => {
      const client = makeClient({ vs: {} });
      await new VpsResource(client).list({ user: 42 });
      expect(client.request).toHaveBeenCalledWith('vs', {}, { user: 42 });
    });

    it('passes multiple filters to request body', async () => {
      const client = makeClient({ vs: {} });
      await new VpsResource(client).list({ user: 'admin@host.com', serid: 1 });
      expect(client.request).toHaveBeenCalledWith(
        'vs',
        {},
        expect.objectContaining({ user: 'admin@host.com', serid: 1 }),
      );
    });
  });

  describe('get(id)', () => {
    it('calls act=vs with vpsid query param', async () => {
      const client = makeClient({
        vs: {
          '123': {
            vpsid: '123',
            hostname: 'h',
            status: '1',
            ram: '1024',
            hdd: '20480',
            bandwidth: '1000',
            os_name: 'ubuntu',
            ip: '1.2.3.4',
          },
        },
      });
      await new VpsResource(client).get('123');
      expect(client.request).toHaveBeenCalledWith('vs', { vpsid: '123' }, {});
    });

    it('returns the specific VPS object', async () => {
      const vps = {
        vpsid: '123',
        hostname: 'web1',
        status: '1',
        ram: '1024',
        hdd: '20480',
        bandwidth: '1000',
        os_name: 'ubuntu',
        ip: '1.2.3.4',
      };
      const client = makeClient({ vs: { '123': vps } });
      const result = await new VpsResource(client).get('123');
      expect(result).toEqual(vps);
    });
  });

  describe('start(id)', () => {
    it('calls act=vs with vpsid+action=start as query params', async () => {
      const client = makeClient({ done: 1, taskid: '456' });
      await new VpsResource(client).start('123');
      expect(client.request).toHaveBeenCalledWith('vs', { vpsid: '123', action: 'start' }, {});
    });
  });

  describe('stop(id)', () => {
    it('calls act=vs with action=stop as query params', async () => {
      const client = makeClient({ done: 1, taskid: '456' });
      await new VpsResource(client).stop('123');
      expect(client.request).toHaveBeenCalledWith('vs', { vpsid: '123', action: 'stop' }, {});
    });
  });

  describe('restart(id)', () => {
    it('calls act=vs with action=restart as query params', async () => {
      const client = makeClient({ done: 1, taskid: '456' });
      await new VpsResource(client).restart('123');
      expect(client.request).toHaveBeenCalledWith('vs', { vpsid: '123', action: 'restart' }, {});
    });
  });

  describe('poweroff(id)', () => {
    it('calls act=vs with action=poweroff as query params', async () => {
      const client = makeClient({ done: 1, taskid: '456' });
      await new VpsResource(client).poweroff('123');
      expect(client.request).toHaveBeenCalledWith('vs', { vpsid: '123', action: 'poweroff' }, {});
    });
  });

  describe('create(params)', () => {
    it('calls act=addvs with params as body', async () => {
      const client = makeClient({ done: 1, taskid: '789' });
      await new VpsResource(client).create({ hostname: 'web1', rootpass: 'pw', osid: 3 });
      expect(client.request).toHaveBeenCalledWith(
        'addvs',
        {},
        expect.objectContaining({ hostname: 'web1', osid: 3 }),
      );
    });
  });

  describe('delete(id)', () => {
    it('calls act=vs with delete query param', async () => {
      const client = makeClient({ done: 1, taskid: '999' });
      await new VpsResource(client).delete('123');
      expect(client.request).toHaveBeenCalledWith('vs', { delete: '123' }, {});
    });
  });

  describe('suspend(id)', () => {
    it('calls act=vs with suspend query param', async () => {
      const client = makeClient({ done: 1, taskid: '999' });
      await new VpsResource(client).suspend('123');
      expect(client.request).toHaveBeenCalledWith('vs', { suspend: '123' }, {});
    });
  });

  describe('unsuspend(id)', () => {
    it('calls act=vs with unsuspend query param', async () => {
      const client = makeClient({ done: 1, taskid: '999' });
      await new VpsResource(client).unsuspend('123');
      expect(client.request).toHaveBeenCalledWith('vs', { unsuspend: '123' }, {});
    });
  });
});
