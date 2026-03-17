import { VirtualizorApiError } from '../errors';
import type { HttpClient } from '../http';
import type { AsyncTaskResult, VirtualizorResponse } from '../types/common';
import type { CreateUserParams, UpdateUserParams, User } from '../types/users';

interface ListUsersResponse extends VirtualizorResponse {
  users: Record<string, User>;
}

interface GetUserResponse extends VirtualizorResponse {
  user: Record<string, User>;
}

export class UsersResource {
  constructor(private readonly http: HttpClient) {}

  async list(): Promise<Record<string, User>> {
    const res = await this.http.request<ListUsersResponse>('users', {}, {});
    return res.users;
  }

  async create(params: CreateUserParams): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('adduser', {}, params);
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

  async get(uid: string): Promise<User> {
    const res = await this.http.request<GetUserResponse>('users', {}, { uid });
    const user = res.user[uid];
    if (!user) {
      throw new VirtualizorApiError('User not found', 404);
    }
    return user;
  }

  async update(params: UpdateUserParams): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('edituser', {}, params);
  }
}
