import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";
import ClassesList from "./components/classes-list";

export default function ClassesPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">My Classes</h1>
          <p className="text-muted-foreground mt-2">
            Manage your classes and materials
          </p>
        </div>
        <Button asChild>
          <Link href="/app/classes/create-class">
            <Plus className="h-4 w-4 mr-2" />
            Create New Class
          </Link>
        </Button>
      </div>

      <ClassesList />
    </div>
  );
}
