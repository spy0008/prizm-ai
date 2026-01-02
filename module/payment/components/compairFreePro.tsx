import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

const CompairFreePro = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Why PRizm FREE beats others</CardTitle>
          <CardDescription>
            Most AI reviewers charge from day 1. PRizm gives you real value
            FREE.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3 rounded-lg border bg-green-50/50 p-4 dark:bg-green-950/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-green-600">
                PRizm FREE
              </span>
              <Badge variant="default" className="bg-green-500">
                Real Value
              </Badge>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                <span>✅ AI Code Review (3 repos)</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                <span>✅ Bug Detection</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                <span>✅ Security Scans</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                <span>✅ 10 Reviews/repo (30 total)</span>
              </li>
            </ul>
          </div>

          {/* Others column */}
          <div className="space-y-3 rounded-lg border bg-muted/40 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Other AI Reviewers</span>
              <Badge variant="outline" className="text-red-500 border-red-500">
                Paywall
              </Badge>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="mt-0.5 h-4 w-4 rounded-full border-2 border-destructive shrink-0" />
                <span>$20+/mo from day 1</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 h-4 w-4 rounded-full border-2 border-destructive shrink-0" />
                <span>No free tier</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 h-4 w-4 rounded-full border-2 border-destructive shrink-0" />
                <span>1-3 reviews max trial</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 h-4 w-4 rounded-full border-2 border-destructive shrink-0" />
                <span>Watermarked/trial limits</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CompairFreePro;
