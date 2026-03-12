export interface Plan {
  pid: string;
  plan_name: string;
  disk: string;
  ram: string;
  bandwidth: string;
  cpu: string;
  virt?: string;
}

export interface CreatePlanParams {
  plan_name: string;
  disk: number;
  ram: number;
  bandwidth: number;
  cpu: number;
  virt?: string;
}
