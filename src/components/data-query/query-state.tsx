import { isAppError } from "../../../convex/utils";
import NotAuthorized from "./not-authorized";
import UnknownError from "./unknown-error";

interface QueryStateProps<TData> {
  query: {
    isPending: boolean;
    isError: boolean;
    isSuccess: boolean;
    data: TData | null | undefined;
    error: Error | undefined;
  };
  pending: React.ReactNode;
  error?: React.ReactNode;
  noData?: React.ReactNode;
  children: (data: TData) => React.ReactNode;
}

export default function QueryState<TData>({
  query,
  pending,
  error,
  noData,
  children,
}: QueryStateProps<TData>) {
  if (query.isPending) {
    return <>{pending}</>;
  }

  if (query.isError) {
    // Check if it's a permission error
    if (
      isAppError(query.error) &&
      query.error.data.statusCode === "PERMISSION_DENIED"
    ) {
      return <NotAuthorized message={query.error.data.message} />;
    }

    // Return custom error component or default to UnknownError
    return <>{error ?? <UnknownError error={query.error!} />}</>;
  }

  if (!query.data) {
    return <>{noData}</>;
  }

  return <>{children(query.data)}</>;
}
