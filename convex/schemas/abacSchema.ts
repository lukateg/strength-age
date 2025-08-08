import { type DataModel } from "../_generated/dataModel";
import { type GenericQueryCtx } from "convex/server";
import { type Doc } from "../_generated/dataModel";

export type Role = "admin" | "user";
export type ClassActionParams = {
  view: Doc<"users">;
  create: Doc<"users">;
  update: Doc<"users">;
  delete: Doc<"users">;
};
export type ResourceActionParams = {
  classes: ClassActionParams;
};
export type Permissions = {
  classes: {
    dataType: Doc<"users">;
    action: keyof ClassActionParams;
  };
};

export type PermissionCheck<
  Resource extends keyof Permissions,
  Action extends keyof ResourceActionParams[Resource],
> =
  | boolean
  | ((
      data: ResourceActionParams[Resource][Action],
      user: Doc<"users">,
      ctx?: GenericQueryCtx<DataModel>
    ) => boolean | Promise<boolean>);

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export type RolesWithPermissions = {
  [R in Role]: {
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
    [K in keyof Permissions]?: {
      [A in keyof ResourceActionParams[K]]?: PermissionCheck<K, A>;
    };
  };
};

export const ROLES: RolesWithPermissions = {
  admin: {
    classes: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
  },
  user: {
    classes: {
      view: (data, user) => {
        return data._id === user._id;
      },
      create: (data, user) => {
        return data._id === user._id;
      },
      update: (data, user) => {
        return data._id === user._id;
      },
      delete: (data, user) => {
        return data._id === user._id;
      },
    },
  },
} as const satisfies RolesWithPermissions;
