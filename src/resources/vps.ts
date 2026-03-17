import { VPS_CONSTANTS } from '../constants/vps';
import { VirtualizorApiError } from '../errors';
import type { HttpClient } from '../http';
import type { AsyncTaskResult, VirtualizorResponse } from '../types/common';
import type {
  CloneVPSParams,
  CreateVPSParams,
  ListVPSParams,
  MigrateVPSParams,
  RebuildVPSParams,
  VNCInfo,
  VPS,
  VPSStatsResponse,
  VPSStatusResponse,
} from '../types/vps';

interface ListVPSResponse extends VirtualizorResponse {
  vs: Record<string, VPS>;
}
interface GetVPSResponse extends VirtualizorResponse {
  vs: Record<string, VPS>;
}

export class VpsResource {
  constructor(private readonly http: HttpClient) {}

  async list(filters: ListVPSParams = {}): Promise<Record<string, VPS>> {
    const res = await this.http.request<ListVPSResponse>('vs', {}, filters);
    return res.vs ?? {};
  }

  async get(filters: ListVPSParams): Promise<VPS> {
    const res = await this.http.request<GetVPSResponse>('vs', {}, filters);
    const entries = Object.entries(res.vs ?? {});
    if (entries.length === 0) {
      throw new VirtualizorApiError('VPS not found', 404);
    }
    const first = entries[0];
    if (!first) {
      throw new VirtualizorApiError('VPS not found', 404);
    }
    const [, vps] = first;
    return vps;
  }

  async create(params: CreateVPSParams): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('addvs', {}, params);
  }

  async delete(vpsId: string): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('vs', { delete: vpsId }, {});
  }

  async start(vpsId: string): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('vs', { vpsid: vpsId, action: 'start' }, {});
  }

  async stop(vpsId: string): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('vs', { vpsid: vpsId, action: 'stop' }, {});
  }

  async restart(vpsId: string): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('vs', { vpsid: vpsId, action: 'restart' }, {});
  }

  async poweroff(vpsId: string): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('vs', { vpsid: vpsId, action: 'poweroff' }, {});
  }

  async suspend(vpsId: string): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('vs', { suspend: vpsId }, {});
  }

  async unsuspend(vpsId: string): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>('vs', { unsuspend: vpsId }, {});
  }

  async rebuild(vpsId: string, params: RebuildVPSParams): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>(
      'rebuild',
      {},
      {
        vpsid: vpsId,
        reos: VPS_CONSTANTS.REBUILD_REOS_FLAG,
        ...params,
      },
    );
  }

  async clone(vpsId: string, params: CloneVPSParams): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>(
      'clone',
      {},
      {
        vpsid: vpsId,
        ...params,
      },
    );
  }

  async migrate(vpsId: string, params: MigrateVPSParams): Promise<AsyncTaskResult> {
    return this.http.request<AsyncTaskResult>(
      'migrate',
      {},
      {
        vpsid: vpsId,
        migrate: VPS_CONSTANTS.MIGRATE_FLAG,
        migrate_but: VPS_CONSTANTS.MIGRATE_BUT_FLAG,
        ...params,
      },
    );
  }

  async status(vpsId: string): Promise<VPSStatusResponse> {
    return this.http.request<VPSStatusResponse>('vstatus', { vpsid: vpsId }, {});
  }

  async vnc(vpsId: string): Promise<VNCInfo> {
    return this.http.request<VNCInfo>('vnc', { vpsid: vpsId }, {});
  }

  async stats(vpsId: string): Promise<VPSStatsResponse> {
    return this.http.request<VPSStatsResponse>('vps_stats', {}, { vpsid: vpsId });
  }
}
