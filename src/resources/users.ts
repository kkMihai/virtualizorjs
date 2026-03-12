import type { HttpClient } from '../http.js';
import type { AsyncTaskResult, VirtualizorResponse } from '../types/common.js';
import type { CreateUserParams, User } from '../types/users.js';

type Params = Record<string, string | number | undefined>;

interface ListUsersResponse extends VirtualizorResponse {
  users: Record<string, User>;
}

export class UsersResource {
  constructor(private readonly http: HttpClient) {}

  async list(): Promise<Record<string, User>> {
    const res = await this.http.request<ListUsersResponse>('users', {}, {});
    return res.users;
  }

  async create(params: CreateUserParams): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('adduser', {}, params as unknown as Params);
  }

  async delete(uid: string): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('users', {}, { delete: uid });
  }

  async suspend(uid: string): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('users', {}, { suspend: uid });
  }

  async unsuspend(uid: string): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('users', {}, { unsuspend: uid });
  }
}
