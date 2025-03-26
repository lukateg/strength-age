import { Loader2 } from "lucide-react";
import { Cloud } from "lucide-react";
import React from "react";
import { Button } from "./button";

export default function AddFilesButton({
  selectedMaterials,
  startAdding,
}: {
  selectedMaterials: string[];
  startAdding: () => void;
}) {
  return (
    <Button
      className="w-full"
      onClick={() => startAdding()}
      disabled={selectedMaterials.length === 0}
    >
      {false ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding...
        </>
      ) : (
        <>
          <Cloud className="mr-2 h-4 w-4" />
          Add {selectedMaterials.length} file
          {selectedMaterials.length !== 1 ? "s" : ""}
        </>
      )}
    </Button>
  );
}
