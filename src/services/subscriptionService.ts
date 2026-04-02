import apiClient from "./apiClient";
import type { Subscription, SubscriptionPlan } from "@/types";

export const subscriptionService = {
  getMySubscription: async (): Promise<Subscription> => {
    const res = await apiClient.get<Subscription>("/subscriptions/me");
    return res.data;
  },

  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const res = await apiClient.get<SubscriptionPlan[]>("/subscriptions/plans");
    return res.data;
  },

  createCheckoutSession: async (planId: string): Promise<{ url: string }> => {
    const res = await apiClient.post<{ url: string }>(
      "/subscriptions/checkout-session",
      { planId },
    );
    return res.data;
  },
};
