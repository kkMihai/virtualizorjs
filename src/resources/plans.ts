import type { HttpClient } from '../http.js';
import type { ApiParams } from '../types/common.js';
import type { AsyncTaskResult, VirtualizorResponse } from '../types/common.js';
import type { CreatePlanParams, Plan } from '../types/plans.js';

interface ListPlansResponse extends VirtualizorResponse {
  plans: Record<string, Plan>;
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
}
