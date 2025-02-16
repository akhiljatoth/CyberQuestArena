import { useQuery } from "@tanstack/react-query";
import { Entertainment } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, ExternalLink } from "lucide-react";

const THUMBNAIL_IMAGES = [
  "https://images.unsplash.com/photo-1592599457638-3ae7ccfbe065",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
  "https://images.unsplash.com/photo-1496449903678-68ddcb189a24",
  "https://images.unsplash.com/photo-1455849318743-b2233052fcff"
];

export default function EntertainmentPage() {
  const { data: content } = useQuery<Entertainment[]>({
    queryKey: ["/api/entertainment"]
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
            <h1 className="text-4xl font-bold">Entertainment</h1>
            <p className="text-muted-foreground">Take a break with some curated content</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(content || []).map((item, index) => (
            <Card key={item.id} className="overflow-hidden">
              <img
                src={THUMBNAIL_IMAGES[index % THUMBNAIL_IMAGES.length]}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{item.title}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {item.type}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {item.description}
                </p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline"
                >
                  View Content
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
