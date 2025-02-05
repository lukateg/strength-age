import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Headphones, Brain, BookOpen } from "lucide-react"

export default function ClassPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Advanced Mathematics</h1>
          <p className="text-muted-foreground mt-2">Professor: John Doe</p>
        </div>
        <Button>Upload Material</Button>
      </div>

      <Tabs defaultValue="materials" className="space-y-6">
        <TabsList>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="audio">Audio Lessons</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Materials</CardTitle>
              <CardDescription>PDF documents and study materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "Chapter 1 - Introduction to Calculus",
                  "Chapter 2 - Derivatives",
                  "Chapter 3 - Integrals"
                ].map((material) => (
                  <div
                    key={material}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{material}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Generate Test</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audio Lessons</CardTitle>
              <CardDescription>Generated and uploaded audio content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "Lecture 1 - Basics of Calculus",
                  "Lecture 2 - Understanding Derivatives"
                ].map((audio) => (
                  <div
                    key={audio}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center">
                      <Headphones className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{audio}</span>
                    </div>
                    <Button variant="outline" size="sm">Play</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Tests</CardTitle>
              <CardDescription>AI-generated tests from your materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "Test 1 - Calculus Basics",
                  "Test 2 - Derivatives Practice"
                ].map((test) => (
                  <div
                    key={test}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center">
                      <Brain className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{test}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Take Test</Button>
                      <Button variant="outline" size="sm">View Results</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}