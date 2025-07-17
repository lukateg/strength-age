export enum FeatureFlags {
  BETA_FEATURE = "beta-feature",
  SUBSCRIPTIONS = "subscriptions",
}

// Simple feature flag implementation using constants
// This avoids hydration issues and PostHog dependency
export const FEATURE_FLAGS = {
  [FeatureFlags.BETA_FEATURE]: false, // Set to true to enable beta features
  [FeatureFlags.SUBSCRIPTIONS]: false,
} as const;

export const isFeatureFlagEnabled = (flag: FeatureFlags): boolean => {
  return FEATURE_FLAGS[flag] ?? false;
};
