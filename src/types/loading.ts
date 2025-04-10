export interface LoadingState {
  [key: string]: boolean;
}

export type LoadingKey =
  | "auth/login"
  | "auth/logout"
  | "partner/fetch"
  | "partner/unlink"
  | "invitation/handle";
