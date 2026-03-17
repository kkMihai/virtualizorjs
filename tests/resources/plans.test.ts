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

  it('delete() calls act=plans with delete body', async () => {
    const client = makeClient({ done: 1 });
    await new PlansResource(client).delete('5');
    expect(client.request).toHaveBeenCalledWith('plans', {}, { delete: '5' });
  });

  describe('get(planId)', () => {
    it('calls act=plans with pid as body', async () => {
      const client = makeClient({
        plans: {
          '1': {
            pid: '1',
            plan_name: 'basic',
            disk: '20480',
            ram: '1024',
            bandwidth: '1000',
            cpu: '1',
          },
        },
      });
      await new PlansResource(client).get('1');
      expect(client.request).toHaveBeenCalledWith('plans', {}, {});
    });

    it('returns the plan when found', async () => {
      const plan = {
        pid: '1',
        plan_name: 'basic',
        disk: '20480',
        ram: '1024',
        bandwidth: '1000',
        cpu: '1',
      };
      const client = makeClient({ plans: { '1': plan } });
      const result = await new PlansResource(client).get('1');
      expect(result).toEqual(plan);
    });

    it('throws when plan not found', async () => {
      const client = makeClient({ plans: {} });
      expect(new PlansResource(client).get('999')).rejects.toThrow('Plan not found');
    });
  });

  describe('update(params)', () => {
    it('calls act=editplan with params as body', async () => {
      const client = makeClient({ done: 1 });
      await new PlansResource(client).update({ pid: '1', plan_name: 'updated' });
      expect(client.request).toHaveBeenCalledWith(
        'editplan',
        {},
        expect.objectContaining({ pid: '1', plan_name: 'updated' }),
      );
    });

    it('allows updating multiple fields', async () => {
      const client = makeClient({ done: 1 });
      await new PlansResource(client).update({
        pid: '1',
        plan_name: 'premium',
        disk: 51200,
        ram: 4096,
        bandwidth: 5000,
        cpu: 4,
      });
      expect(client.request).toHaveBeenCalledWith(
        'editplan',
        {},
        expect.objectContaining({
          pid: '1',
          plan_name: 'premium',
          disk: 51200,
          ram: 4096,
          bandwidth: 5000,
          cpu: 4,
        }),
      );
    });
  });
});
