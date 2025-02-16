import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";
import { User } from "@shared/schema";

export default function Leaderboard({ users }: { users: User[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 rounded-lg bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {index < 3 ? (
                  <Medal className={`h-5 w-5 ${
                    index === 0 ? "text-yellow-500" :
                    index === 1 ? "text-gray-400" :
                    "text-amber-600"
                  }`} />
                ) : (
                  <span className="w-5 text-center text-muted-foreground">
                    {index + 1}
                  </span>
                )}
                <span className="font-medium">{user.username}</span>
              </div>
              <span className="font-mono text-primary">{user.score} pts</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
