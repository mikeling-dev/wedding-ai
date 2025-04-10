export interface Partner {
  id: string;
  name: string | null;
  picture: string | null;
  subscription: "BASIC" | "PREMIUM";
  weddings: any[]; // You can type this more specifically if needed
}

export interface PartnerState {
  partner: Partner | null;
}
