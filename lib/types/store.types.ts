export type SubscriptionTier = "free" | "pro" | "enterprise";

export interface CreditsAccount {
  balance: number;
  tier: SubscriptionTier;
  spent: number;
  resetDate: Date;
}
