import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Construction } from "lucide-react";

interface PlaceholderProps {
  title: string;
  description: string;
  suggestedActions?: string[];
}

export default function Placeholder({
  title,
  description,
  suggestedActions,
}: PlaceholderProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-dogzilla-purple/5 to-dogzilla-yellow/10 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-dogzilla-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Construction className="h-8 w-8 text-dogzilla-purple" />
            </div>
            <CardTitle className="text-2xl md:text-3xl">{title}</CardTitle>
            <CardDescription className="text-lg">{description}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground">
              This page is coming soon! We're working hard to bring you amazing
              features for your furry friends.
            </p>

            {suggestedActions && suggestedActions.length > 0 && (
              <div className="space-y-3">
                <p className="font-medium">In the meantime, you can:</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {suggestedActions.map((action, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-center"
                    >
                      <span>• {action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="outline" asChild>
                <Link to="/" className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <Button
                className="bg-dogzilla-purple hover:bg-dogzilla-purple/90"
                asChild
              >
                <Link to="/customize">Start Designing</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
