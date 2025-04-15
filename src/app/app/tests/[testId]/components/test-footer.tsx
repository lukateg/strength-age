import { Button } from "@/components/ui/button";
import { type Doc } from "convex/_generated/dataModel";
import { type Dispatch, type SetStateAction } from "react";

export default function TestFooter({
  currentPage,
  setCurrentPage,
  test,
  questionsPerPage,
  handleSubmit,
  isLoading,
}: {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  test: Doc<"tests">;
  questionsPerPage: number;
  handleSubmit: () => void;
  isLoading: boolean;
}) {
  const totalPages = Math.ceil(test?.questions.length / questionsPerPage);

  return (
    <div className="mt-8 flex justify-between">
      <Button
        variant="outline"
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
        type="button"
      >
        Previous
      </Button>
      <span className="flex items-center">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage !== totalPages ? (
        <Button
          type="button"
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      ) : (
        <Button onClick={handleSubmit} disabled={isLoading} type="submit">
          Submit
        </Button>
      )}
    </div>
  );
}
