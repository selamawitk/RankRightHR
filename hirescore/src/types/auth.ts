export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  companyName?: string | null;
  role: "EMPLOYER" | "CANDIDATE" | "ADMIN";
};

export type AuthSession = {
  user: AuthUser;
  id: string;
  token: string;
  expiresAt: Date;
};
 