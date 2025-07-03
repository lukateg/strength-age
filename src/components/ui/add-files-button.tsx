import { Loader2 } from "lucide-react";
import { Cloud } from "lucide-react";
import React from "react";
import { Button } from "./button";

export default function AddFilesButton({
  materialsToAdd,
  startAdding,
}: {
  materialsToAdd: string[];
  startAdding: () => void;
}) {
  const isDisabled = materialsToAdd.length === 0;
  return (
    <Button
      className="w-full"
      onClick={() => startAdding()}
      disabled={isDisabled}
      variant="default"
    >
      {false ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding...
        </>
      ) : (
        <>
          <Cloud className="mr-2 h-4 w-4" />
          Add {materialsToAdd.length} file
          {materialsToAdd.length !== 1 ? "s" : ""}
        </>
      )}
    </Button>
  );
}
