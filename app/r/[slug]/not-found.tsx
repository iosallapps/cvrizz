import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-muted/30 to-muted/50 p-4">
      <div className="text-center max-w-md">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
          <FileX className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Resume Not Found
        </h1>
        <p className="text-muted-foreground mb-6">
          This resume either doesn't exist or is not publicly shared.
          The owner may have disabled public access.
        </p>
        <Button asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
