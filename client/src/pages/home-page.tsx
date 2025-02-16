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
import { Layout } from "lucide-react";

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
          title: "Correct!",
          description: "You've earned points for this challenge.",
          variant: "default"
        });
      } else {
        toast({
          title: "Incorrect",
          description: "Try again!",
          variant: "destructive"
        });
      }
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Welcome, {user?.username}!</h1>
            <p className="text-muted-foreground">Current Score: {user?.score} points</p>
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
              {challenges?.map((challenge) => (
                <Card key={challenge.id}>
                  <CardHeader>
                    <CardTitle>{challenge.title}</CardTitle>
                    <CardDescription>{challenge.category} - {challenge.points} pts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
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
                          answer: answers[challenge.id]
                        })
                      }
                      disabled={submitMutation.isPending}
                    >
                      Submit
                    </Button>
                  </CardFooter>
                </Card>
              ))}
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
