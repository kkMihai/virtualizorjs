import { DEFAULT_TASK_POLLING } from '../config/defaults.js';
import type { HttpClient } from '../http.js';
import type { VirtualizorResponse } from '../types/common.js';
import type { Task } from '../types/tasks.js';

interface TasksResponse extends VirtualizorResponse {
  tasks: Record<string, Task>;
}

export class TasksResource {
  constructor(private readonly http: HttpClient) {}

  async get(taskId: string): Promise<Task | undefined> {
    const res = await this.http.request<TasksResponse>('tasks', { taskid: taskId }, {});
    return res.tasks[taskId];
  }

  async wait(
    taskId: string,
    options: { pollIntervalMs?: number; timeoutMs?: number } = {},
  ): Promise<Task> {
    const {
      pollIntervalMs = DEFAULT_TASK_POLLING.pollIntervalMs,
      timeoutMs = DEFAULT_TASK_POLLING.timeoutMs,
    } = options;
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      const task = await this.get(taskId);
      if (!task) throw new Error(`Task ${taskId} not found`);
      if (task.status === '1' || task.status === 'done') return task;
      if (task.status === 'error' || task.status === '-1') {
        throw new Error(`Task ${taskId} failed`);
      }
      await new Promise((r) => setTimeout(r, pollIntervalMs));
    }

    throw new Error(`Task ${taskId} timed out after ${timeoutMs}ms`);
  }
}
