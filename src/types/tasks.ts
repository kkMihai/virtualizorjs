export interface Task {
  id: string;
  action: string;
  status: string;
  vpsid?: string;
  data?: unknown;
}
