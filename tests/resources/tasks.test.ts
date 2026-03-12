import { describe, it, expect, mock } from 'bun:test';
import { TasksResource } from '../../src/resources/tasks.js';
import type { HttpClient } from '../../src/http.js';

function makeClient(returnValue: unknown): HttpClient {
  return { request: mock(() => Promise.resolve(returnValue)) } as unknown as HttpClient;
}

describe('TasksResource', () => {
  describe('get(taskId)', () => {
    it('calls act=tasks with taskid query param', async () => {
      const client = makeClient({ tasks: {} });
      await new TasksResource(client).get('1');
      expect(client.request).toHaveBeenCalledWith('tasks', { taskid: '1' }, {});
    });

    it('returns the task when found', async () => {
      const task = { id: '1', action: 'start', status: '1' };
      const client = makeClient({ tasks: { '1': task } });
      const result = await new TasksResource(client).get('1');
      expect(result).toEqual(task);
    });

    it('returns undefined when task not in response', async () => {
      const client = makeClient({ tasks: {} });
      const result = await new TasksResource(client).get('999');
      expect(result).toBeUndefined();
    });
  });

  describe('wait(taskId)', () => {
    it('resolves when task status is "1" (done)', async () => {
      const task = { id: '1', action: 'start', status: '1' };
      const client = makeClient({ tasks: { '1': task } });
      const result = await new TasksResource(client).wait('1');
      expect(result.status).toBe('1');
    });

    it('resolves when task status is "done"', async () => {
      const task = { id: '1', action: 'start', status: 'done' };
      const client = makeClient({ tasks: { '1': task } });
      const result = await new TasksResource(client).wait('1');
      expect(result.status).toBe('done');
    });

    it('throws when task status is "error"', async () => {
      const task = { id: '1', action: 'start', status: 'error' };
      const client = makeClient({ tasks: { '1': task } });
      await expect(new TasksResource(client).wait('1')).rejects.toThrow('failed');
    });

    it('throws when task status is "-1"', async () => {
      const task = { id: '1', action: 'start', status: '-1' };
      const client = makeClient({ tasks: { '1': task } });
      await expect(new TasksResource(client).wait('1')).rejects.toThrow('failed');
    });

    it('throws on timeout when task never completes', async () => {
      const task = { id: '1', action: 'start', status: 'pending' };
      const client = makeClient({ tasks: { '1': task } });
      await expect(
        new TasksResource(client).wait('1', { timeoutMs: 50, pollIntervalMs: 10 }),
      ).rejects.toThrow('timed out');
    });

    it('throws when task not found', async () => {
      const client = makeClient({ tasks: {} });
      await expect(new TasksResource(client).wait('999')).rejects.toThrow('not found');
    });
  });
});
