export enum FeatureFlags {
  BETA_FEATURE = "beta-feature",
}

export const validateFeatureFlag = (flag: string): boolean => {
  return Object.values(FeatureFlags).includes(flag as FeatureFlags);
};
