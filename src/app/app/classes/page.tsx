import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Plus } from "lucide-react";
import Link from "next/link";

export const ClassesPage = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">My Classes</h1>
          <p className="text-muted-foreground mt-2">
            Manage your classes and materials
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create New Class
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Advanced Mathematics",
            description: "Calculus and Advanced Algebra",
            materials: 12,
            tests: 5,
            id: "class-1",
          },
          {
            title: "World History",
            description: "Ancient Civilizations to Modern Era",
            materials: 8,
            tests: 3,
            id: "class-2",
          },
          {
            title: "Physics 101",
            description: "Introduction to Physics",
            materials: 15,
            tests: 7,
            id: "class-3",
          },
        ].map((classItem) => (
          <Card key={classItem.title}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                {classItem.title}
              </CardTitle>
              <CardDescription>{classItem.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-muted-foreground mb-4">
                <span>{classItem.materials} Materials</span>
                <span>{classItem.tests} Tests</span>
              </div>
              <div className="flex gap-2">
                <Link href={`/app/classes/${classItem.id}`}>
                  <Button className="w-full" variant="outline">
                    View Class
                  </Button>
                </Link>
                <Button className="w-full">Generate Test</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClassesPage;
