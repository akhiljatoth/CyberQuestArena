import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Challenge } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertChallengeSchema } from "@shared/schema";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Brain, Plus, Settings } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { apiRequest, queryClient } from "@/lib/queryClient";

type AIGenerateForm = {
  topic: string;
  difficulty: "easy" | "medium" | "hard";
};

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  // Redirect if not admin
  if (!user?.isAdmin) {
    setLocation("/");
    return null;
  }

  const { data: challenges } = useQuery<Challenge[]>({
    queryKey: ["/api/challenges"],
  });

  const form = useForm({
    resolver: zodResolver(insertChallengeSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "web",
      points: 100,
      answer: "",
    },
  });

  const aiForm = useForm<AIGenerateForm>({
    defaultValues: {
      topic: "",
      difficulty: "medium",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/challenges", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/challenges"] });
      form.reset();
      toast({
        title: "Challenge Created",
        description: "New challenge has been added successfully",
      });
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: AIGenerateForm) => {
      const res = await apiRequest("POST", "/api/challenges/generate", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/challenges"] });
      aiForm.reset();
      toast({
        title: "Challenge Generated",
        description: "AI has generated a new challenge",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage CTF challenges</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Challenge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((data) => createMutation.mutate(data))}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="web">Web Security</SelectItem>
                            <SelectItem value="crypto">Cryptography</SelectItem>
                            <SelectItem value="movies">Movies & TV</SelectItem>
                            <SelectItem value="sports">Sports</SelectItem>
                            <SelectItem value="tech">Technology</SelectItem>
                            <SelectItem value="gaming">Gaming</SelectItem>
                            <SelectItem value="science">Science</SelectItem>
                            <SelectItem value="history">History</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="points"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Points</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="answer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Answer</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createMutation.isPending}
                  >
                    Create Challenge
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Generate with AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...aiForm}>
                  <form
                    onSubmit={aiForm.handleSubmit((data) =>
                      generateMutation.mutate(data)
                    )}
                    className="space-y-4"
                  >
                    <FormField
                      control={aiForm.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Topic</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., Marvel movies, World Cup history, latest tech trends"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={aiForm.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={generateMutation.isPending}
                    >
                      Generate Challenge
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Existing Challenges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {challenges?.map((challenge) => (
                    <div
                      key={challenge.id}
                      className="flex justify-between items-center p-3 rounded-lg bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium">{challenge.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {challenge.category} - {challenge.points} pts
                        </p>
                      </div>
                      {challenge.aiGenerated && (
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          AI Generated
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}