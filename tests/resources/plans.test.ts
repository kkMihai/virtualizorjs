import { describe, expect, it, mock } from 'bun:test';
import type { HttpClient } from '../../src/http.js';
import { PlansResource } from '../../src/resources/plans.js';

function makeClient(returnValue: unknown): HttpClient {
  return { request: mock(() => Promise.resolve(returnValue)) } as unknown as HttpClient;
}

describe('PlansResource', () => {
  it('list() calls act=plans with no params', async () => {
    const client = makeClient({ plans: {} });
    await new PlansResource(client).list();
    expect(client.request).toHaveBeenCalledWith('plans', {}, {});
  });

  it('list() returns plans map', async () => {
    const plans = {
      '1': {
        pid: '1',
        plan_name: 'basic',
        disk: '20480',
        ram: '1024',
        bandwidth: '1000',
        cpu: '1',
      },
    };
    const client = makeClient({ plans });
    const result = await new PlansResource(client).list();
    expect(result).toEqual(plans);
  });

  it('create() calls act=addplan with params as body', async () => {
    const client = makeClient({ done: 1 });
    await new PlansResource(client).create({
      plan_name: 'starter',
      disk: 20480,
      ram: 1024,
      bandwidth: 1000,
      cpu: 1,
    });
    expect(client.request).toHaveBeenCalledWith(
      'addplan',
      {},
      expect.objectContaining({ plan_name: 'starter' }),
    );
  });

  it('delete() calls act=deleteplan with plid body', async () => {
    const client = makeClient({ done: 1 });
    await new PlansResource(client).delete('5');
    expect(client.request).toHaveBeenCalledWith('deleteplan', {}, { plid: '5' });
  });
});
