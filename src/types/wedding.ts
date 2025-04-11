export interface Wedding {
  id: string;
  partner1Name: string;
  partner2Name: string;
  culturalBackground: string;
  religion: string;
  email: string;
  phoneNumber?: string;
  date: string | Date;
  country: string;
  state: string;
  budget: number;
  guestCount: number;
  theme: string;
  specialRequests?: string;
  users: Array<{
    userId: string;
    role: "CREATOR" | "PARTNER" | "HELPER";
    user: {
      id: string;
      email: string;
      name: string | null;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}
