export interface User {
  uid: string;
  email: string;
  fname?: string;
  lname?: string;
  status: string;
  type: string;
}

export interface CreateUserParams {
  email: string;
  password: string;
  fname?: string;
  lname?: string;
  acttype?: number;
  [key: string]: unknown;
}

export interface EditUserParams {
  uid: string;
  email?: string;
  password?: string;
  fname?: string;
  lname?: string;
}
