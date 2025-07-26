import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900">
      <Card className="w-full max-w-md mx-4 fitness-card">
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">404 Page Not Found</h1>
          <p className="text-gray-400 mb-6">
            The page you're looking for doesn't exist.
          </p>
          <Link href="/">
            <Button className="fitness-button">
              Go Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
