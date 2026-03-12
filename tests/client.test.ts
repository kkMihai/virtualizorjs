import { describe, expect, it } from 'bun:test';
import { VirtualizorClient, createVirtualizorClient } from '../src/client.js';

describe('VirtualizorClient', () => {
  const config = {
    host: 'localhost',
    apiKey: 'test-key',
    apiPass: 'test-pass',
  };

  it('constructor does not throw with valid config', () => {
    expect(() => new VirtualizorClient(config)).not.toThrow();
  });

  it('vps namespace exposes list, get, create, delete, start, stop, restart methods', () => {
    const client = new VirtualizorClient(config);
    expect(typeof client.vps.list).toBe('function');
    expect(typeof client.vps.get).toBe('function');
    expect(typeof client.vps.create).toBe('function');
    expect(typeof client.vps.delete).toBe('function');
    expect(typeof client.vps.start).toBe('function');
    expect(typeof client.vps.stop).toBe('function');
    expect(typeof client.vps.restart).toBe('function');
  });

  it('users namespace exposes list, create, delete, suspend, unsuspend methods', () => {
    const client = new VirtualizorClient(config);
    expect(typeof client.users.list).toBe('function');
    expect(typeof client.users.create).toBe('function');
    expect(typeof client.users.delete).toBe('function');
    expect(typeof client.users.suspend).toBe('function');
    expect(typeof client.users.unsuspend).toBe('function');
  });

  it('plans namespace exposes list, create, delete methods', () => {
    const client = new VirtualizorClient(config);
    expect(typeof client.plans.list).toBe('function');
    expect(typeof client.plans.create).toBe('function');
    expect(typeof client.plans.delete).toBe('function');
  });

  it('tasks namespace exposes get and wait methods', () => {
    const client = new VirtualizorClient(config);
    expect(typeof client.tasks.get).toBe('function');
    expect(typeof client.tasks.wait).toBe('function');
  });

  it('createVirtualizorClient factory returns VirtualizorClient instance with all namespaces', () => {
    const client = createVirtualizorClient(config);
    expect(client).toBeInstanceOf(VirtualizorClient);
    expect(typeof client.vps.list).toBe('function');
    expect(typeof client.users.list).toBe('function');
    expect(typeof client.plans.list).toBe('function');
    expect(typeof client.tasks.get).toBe('function');
  });
});
