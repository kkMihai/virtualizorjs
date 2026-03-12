import type { HttpClient } from '../http.js';
import type { Plan, CreatePlanParams } from '../types/plans.js';
import type { AsyncTaskResult, VirtualizorResponse } from '../types/common.js';

type Params = Record<string, string | number | undefined>;

interface ListPlansResponse extends VirtualizorResponse { plans: Record<string, Plan>; }
export class PlansResource {
  constructor(private readonly http: HttpClient) {}

  async list(): Promise<Record<string, Plan>> {
    const res = await this.http.request<ListPlansResponse>('plans', {}, {});
    return res.plans;
  }

  async create(params: CreatePlanParams): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('addplan', {}, params as unknown as Params);
  }

  async delete(planId: string): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('deleteplan', {}, { plid: planId });
  }
}
