import type { HttpClient } from '../http.js';
import type { AsyncTaskResult, VirtualizorResponse } from '../types/common.js';
import type {
  CloneVPSParams,
  CreateVPSParams,
  MigrateVPSParams,
  RebuildVPSParams,
  VNCInfo,
  VPS,
  VPSStatsResponse,
} from '../types/vps.js';

type Params = Record<string, string | number | undefined>;

interface ListVPSResponse extends VirtualizorResponse {
  vs: Record<string, VPS>;
}
interface GetVPSResponse extends VirtualizorResponse {
  vs: Record<string, VPS>;
}

export class VpsResource {
  constructor(private readonly http: HttpClient) {}

  async list(): Promise<Record<string, VPS>> {
    const res = await this.http.request<ListVPSResponse>('listvs', {}, {});
    return res.vs;
  }

  async get(vpsId: string): Promise<VPS> {
    const res = await this.http.request<GetVPSResponse>('vs', { vpsid: vpsId }, {});
    const vps = res.vs[vpsId];
    if (!vps) throw new Error(`VPS ${vpsId} not found in response`);
    return vps;
  }

  async create(params: CreateVPSParams): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('addvs', {}, params as unknown as Params);
  }

  async delete(vpsId: string): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('deletevs', {}, { vpsid: vpsId });
  }

  async start(vpsId: string): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('vs', { vpsid: vpsId }, { action: 'start' });
  }

  async stop(vpsId: string): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('vs', { vpsid: vpsId }, { action: 'stop' });
  }

  async restart(vpsId: string): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('vs', { vpsid: vpsId }, { action: 'restart' });
  }

  async poweroff(vpsId: string): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('vs', { vpsid: vpsId }, { action: 'poweroff' });
  }

  async suspend(vpsId: string): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('suspendvs', {}, { vpsid: vpsId });
  }

  async unsuspend(vpsId: string): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('unsuspendvs', {}, { vpsid: vpsId });
  }

  async rebuild(vpsId: string, params: RebuildVPSParams): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('rebuild', {}, { vpsid: vpsId, ...params } as Params);
  }

  async clone(vpsId: string, params: CloneVPSParams): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('clone', {}, { vpsid: vpsId, ...params } as Params);
  }

  async migrate(vpsId: string, params: MigrateVPSParams): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('migrate', {}, { vpsid: vpsId, ...params } as Params);
  }

  async status(vpsId: string): Promise<unknown> {
    return this.http.request('vstatus', { vpsid: vpsId }, {});
  }

  async vnc(vpsId: string): Promise<VNCInfo> {
    return this.http.request<VNCInfo>('vnc', { vpsid: vpsId }, {});
  }

  async stats(vpsId: string): Promise<VPSStatsResponse> {
    return this.http.request<VPSStatsResponse>('vpsstatistics', { vpsid: vpsId }, {});
  }
}
