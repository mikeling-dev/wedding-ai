export interface User {
  userId: string;
  email: string;
  picture: string | null;
  name: string;
  subscription: "BASIC" | "PREMIUM";
  partnerId: string | null;
  weddingId: string | null;
  receivedInvitations: string[];
}

export interface UserState {
  profile: User | null;
}
