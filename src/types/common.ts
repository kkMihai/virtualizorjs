export interface VirtualizorError {
  code: number;
  msg: string;
}

export interface VirtualizorResponse {
  title?: string;
  timenow?: number;
  time_taken?: string;
  error?: VirtualizorError[];
}

export interface AsyncTaskResult extends VirtualizorResponse {
  done?: 1;
  taskid?: string;
}

export type VirtType =
  | 'kvm'
  | 'xen'
  | 'openvz'
  | 'lxc'
  | 'proxmox'
  | 'virtuozzo'
  | 'xcp'
  | 'hyperv';

// Generic params type for API requests
export type ApiParams = Record<string, unknown>;
