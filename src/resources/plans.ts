import { VirtualizorApiError } from '../errors';
import type { HttpClient } from '../http';
import type { AsyncTaskResult, VirtualizorResponse } from '../types/common';
import type { CreatePlanParams, Plan, UpdatePlanParams } from '../types/plans';

interface ListPlansResponse extends VirtualizorResponse {
  plans: Record<string, Plan>;
}

interface GetPlanResponse extends VirtualizorResponse {
  plan: Record<string, Plan>;
}

export class PlansResource {
  constructor(private readonly http: HttpClient) {}

  async list(): Promise<Record<string, Plan>> {
    const res = await this.http.request<ListPlansResponse>('plans', {}, {});
    return res.plans;
  }

  async create(params: CreatePlanParams): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('addplan', {}, params);
  }

  async delete(planId: string): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('plans', {}, { delete: planId });
  }

  async get(planId: string): Promise<Plan> {
    const res = await this.http.request<GetPlanResponse>('plans', {}, { pid: planId });
    const plan = res.plan[planId];
    if (!plan) {
      throw new VirtualizorApiError('Plan not found', 404);
    }
    return plan;
  }

  async update(params: UpdatePlanParams): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('editplan', {}, params);
  }
}
