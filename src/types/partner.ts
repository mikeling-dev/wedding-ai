export interface Partner {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  subscription: "BASIC" | "PREMIUM";
  weddings: string[]; // You can type this more specifically if needed
}

export interface PartnerState {
  partner: Partner | null;
}
