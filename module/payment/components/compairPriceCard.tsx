import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

const CompairPriceCard = () => {
  return (
    <>
     <Card>
            <CardHeader>
              <CardTitle>Why PRizm vs Other AI Reviewers</CardTitle>
              <CardDescription>
                Built for indie devs and small teams who want clarity, not
                complexity.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              
              <div className="space-y-3 rounded-lg border bg-muted/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">PRizm</span>
                  <Badge variant="default">Best for You</Badge>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>
                      Crystal-clear, actionable PR summaries instead of noisy walls
                      of text.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>
                      Designed for solo devs & small teams, not big enterprise
                      contracts.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>
                      Simple pricing: FREE to start, PRO at $19.99/mo when you need
                      unlimited.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>
                      GitHub-first workflow with limits that match real indie usage.
                    </span>
                  </li>
                </ul>
              </div>
    
              
              <div className="space-y-3 rounded-lg border bg-background p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Other AI Reviewers</span>
                  <Badge variant="outline">Codereview bots</Badge>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="mt-0.5 h-4 w-4 rounded-full border border-muted-foreground/50" />
                    <span>Long, generic comments that are hard to act on.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 h-4 w-4 rounded-full border border-muted-foreground/50" />
                    <span>
                      Complex team pricing, seats and commit-based billing.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 h-4 w-4 rounded-full border border-muted-foreground/50" />
                    <span>
                      Optimized for large orgs, not solo builders shipping fast.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 h-4 w-4 rounded-full border border-muted-foreground/50" />
                    <span>Hard to know what you actually pay each month.</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
    </>
  )
}

export default CompairPriceCard