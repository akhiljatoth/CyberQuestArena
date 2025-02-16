import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Challenge } from "@shared/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Leaderboard from "@/components/ui/leaderboard";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { Layout, Flag, Timer, Award } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const { data: challenges } = useQuery<Challenge[]>({
    queryKey: ["/api/challenges"]
  });

  const { data: leaderboard } = useQuery({
    queryKey: ["/api/leaderboard"]
  });

  const submitMutation = useMutation({
    mutationFn: async (data: { challengeId: number; answer: string }) => {
      const res = await apiRequest("POST", "/api/submissions", data);
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.correct) {
        toast({
          title: "🎉 Correct!",
          description: "Challenge completed! Points added to your score.",
          variant: "default"
        });
      } else {
        toast({
          title: "❌ Incorrect",
          description: "Try again! Hint: Pay attention to the challenge description.",
          variant: "destructive"
        });
      }
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Hero Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Welcome back, {user?.username}! 🚀
            </h1>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <p className="text-muted-foreground">Your Score: {user?.score} points</p>
            </div>
          </div>
          <div className="space-x-4">
            <Link href="/entertainment">
              <Button variant="outline">
                <Layout className="mr-2 h-4 w-4" />
                Entertainment
              </Button>
            </Link>
            {user?.isAdmin && (
              <Link href="/admin">
                <Button variant="secondary">Admin Panel</Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              {challenges?.length === 0 ? (
                <div className="md:col-span-2 flex flex-col items-center justify-center p-12 text-center">
                  <Flag className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Challenges Available</h3>
                  <p className="text-muted-foreground">
                    Check back soon or contact an admin to add some challenges!
                  </p>
                </div>
              ) : (
                challenges?.map((challenge) => (
                  <Card key={challenge.id} className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {challenge.points} pts
                      </span>
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {challenge.title}
                        {challenge.aiGenerated && (
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500">
                            AI
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Timer className="h-4 w-4" />
                        {challenge.category} challenge
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-4">
                        {challenge.description}
                      </p>
                      <Input
                        placeholder="Enter your answer"
                        value={answers[challenge.id] || ""}
                        onChange={(e) =>
                          setAnswers({ ...answers, [challenge.id]: e.target.value })
                        }
                      />
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() =>
                          submitMutation.mutate({
                            challengeId: challenge.id,
                            answer: answers[challenge.id] || ""
                          })
                        }
                        disabled={submitMutation.isPending}
                      >
                        {submitMutation.isPending ? "Checking..." : "Submit"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Leaderboard users={leaderboard || []} />
          </div>
        </div>
      </div>
    </div>
  );
}