"use client";

import Header from "@/components/header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as motion from "motion/react-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/authClient";
import {
  getSubscriptionData,
  syncSubscriptionStatus,
} from "@/module/payment/actions";
import CompairFreePro from "@/module/payment/components/compairFreePro";
import CompairPriceCard from "@/module/payment/components/compairPriceCard";
import { useQuery } from "@tanstack/react-query";
import { Check, ExternalLink, Loader2, RefreshCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const PLAN_FEATURES = {
  free: [
    { name: "AI Code Review", included: true },
    { name: "Bug Detection", included: true },
    { name: "Security Scans", included: true },
    { name: "3 Repositories", included: true },
    { name: "10 Reviews per repo", included: true },
    { name: "Email Support", included: true },
  ],
  pro: [
    { name: "🚀 AI Code Review", included: true },
    { name: "🛡️ Advanced Bug Detection", included: true },
    { name: "🔒 Enterprise Security", included: true },
    { name: "⚡ Performance Optimization", included: true },
    { name: "📂 Unlimited Repositories", included: true },
    { name: "♾️ Unlimited Reviews", included: true },
    { name: "⭐ Priority Email Support", included: true },
  ],
};

const subscriptionPage = () => {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["subscription-data"],
    queryFn: getSubscriptionData,
    refetchOnWindowFocus: true,
  });

  const repoProgressWidth = useMemo(() => {
    if (!data?.limits?.repositories?.limit) return 0;
    return Math.min(
      (data.limits.repositories.current / data.limits.repositories.limit) * 100,
      100,
    );
  }, [data?.limits?.repositories?.current, data?.limits?.repositories?.limit]);

  const isPro =
    data?.user?.subscriptionTier === "PRO" &&
    (data?.user?.subscriptionStatus === "ACTIVE" ||
      data?.user?.subscriptionStatus === "CANCELING");

  const shouldShowRepoBar =
    !isPro && repoProgressWidth > 0 && data?.limits?.repositories?.limit;

  useEffect(() => {
    if (success === "true") {
      const sync = async () => {
        try {
          await syncSubscriptionStatus();
          refetch();
        } catch (error) {
          console.error("Failed to sync subscription on success return", error);
        }
      };
      sync();
    }
  }, [success, refetch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <Header
            title="Subscription Plans"
            description="Failed to load subscription data"
          />
        </div>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load subscription data. Please try again or later.
            <Button
              variant="outline"
              size="sm"
              className="ml-4 cursor-pointer"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div className="space-y-6">
        <div>
          <Header
            title="Subscription Plans"
            description="Please sign in to view subscription options"
          />
        </div>
      </div>
    );
  }

  const isActive = data.user.subscriptionStatus === "ACTIVE";

  const handleSync = async () => {
    try {
      setSyncLoading(true);
      const result = await syncSubscriptionStatus();
      if (result.success) {
        toast.success("Subscription Status Updated Successfully!!!");
        refetch();
      } else {
        toast.error("Failed to sync subscription");
      }
    } catch (error) {
      toast.error("Failed to sync subscription");
    } finally {
      setSyncLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      setCheckoutLoading(true);
      await authClient.checkout({
        slug: "pro",
      });
    } catch (error) {
      console.error("Failed to initiate checkout: ", error);
      toast.error("Failed to start checkout");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setPortalLoading(true);
      await authClient.customer.portal();
    } catch (error) {
      console.error("Failed to open portal: ", error);
      toast.error("Failed to open customer portal");
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Header
          title="Subscription Plans"
          description="Choose the perfect plan for your needs"
        />
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={handleSync}
          disabled={syncLoading}
        >
          {syncLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          Sync Status
        </Button>
      </div>

      {success === "true" && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle>Success 🎉🎉🎉</AlertTitle>
          <AlertDescription>
            Congratulation 🎉, Your subscription has been updated successfully.
            Changes may take a few moments to reflect.
          </AlertDescription>
        </Alert>
      )}

      {data.limits && (
        <Card>
          <CardHeader>
            <CardTitle>Your current Usage</CardTitle>
            <CardDescription>
              Your current plan limits and usage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Repositories Progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Repositories:</span>
                  <Badge
                    variant={
                      data.limits.repositories.canAdd
                        ? "default"
                        : "destructive"
                    }
                  >
                    {data.limits.repositories.current} /{" "}
                    {data.limits.repositories.limit ?? "∞"}
                  </Badge>
                </div>

                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  {shouldShowRepoBar && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${repoProgressWidth}%` }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className={`h-full ${
                        data.limits.repositories.canAdd
                          ? "bg-primary shadow-primary/25"
                          : "bg-destructive shadow-destructive/25"
                      }`}
                      style={{ width: `${repoProgressWidth}%` }}
                      role="progressbar"
                      aria-valuenow={repoProgressWidth}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  )}
                </div>
              </div>

              {/* Reviews per Repo */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Review per Repository
                  </span>
                  <Badge variant="outline">
                    {isPro ? "Unlimited" : "10 per repo"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isPro
                    ? "No limits on reviews"
                    : "Free tier allows 10 reviews per repository"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <CompairPriceCard />
      <CompairFreePro />

      {/* Pricing Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* FREE Card */}
        <Card className="border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-2.5 right-3 z-10 ">
            <Badge
              variant="default"
              className="px-3 py-1 text-xs font-semibold shadow-sm"
            >
              {!isPro ? "Your Current Plan" : "Free"}
            </Badge>
          </div>
          <CardHeader className="text-center pt-10 pb-3">
            <CardTitle className="text-2xl font-bold text-primary">
              FREE
            </CardTitle>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-black">$0</span>
              <span className="text-sm text-muted-foreground">forever</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pb-6">
            {PLAN_FEATURES.free.map((feature) => (
              <div
                key={feature.name}
                className="flex items-center gap-2 p-2.5 rounded-md hover:bg-muted/60 transition-colors duration-200"
              >
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                <span className="text-sm leading-5">{feature.name}</span>
              </div>
            ))}
            <Button className="w-full" variant="outline" disabled>
              {!isPro ? "Current Plan" : "Downgrade"}
            </Button>
          </CardContent>
        </Card>

        {/* PRO Card */}
        <Card className="border-2 border-primary/50 hover:border-primary hover:shadow-md transition-all duration-300 relative overflow-hidden group shadow-sm">
          <div className="absolute top-2.5 right-3 z-10">
            <Badge
              variant="default"
              className="bg-linear-to-r from-primary/90 to-primary px-3 py-1 text-xs font-semibold shadow-sm"
            >
              {isPro ? "Your Current Plan" : "Most Popular"}
            </Badge>
          </div>
          <CardHeader className="text-center pt-8 pb-3">
            <CardTitle className="text-2xl font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              PRO
            </CardTitle>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-black">$19.99</span>
              <span className="text-sm bg-primary/10 px-2 py-1 rounded-full font-medium text-primary">
                /mo
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pb-6">
            {PLAN_FEATURES.pro.map((feature) => (
              <div
                key={feature.name}
                className="flex items-center gap-2 p-2.5 rounded-md hover:bg-primary/5 transition-colors duration-200"
              >
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm font-medium leading-5">
                  {feature.name}
                </span>
              </div>
            ))}
            {isPro && isActive ? (
              <Button
                className="w-full cursor-pointer"
                variant="outline"
                onClick={handleManageSubscription}
                disabled={portalLoading}
              >
                {portalLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Opening Portal
                  </>
                ) : (
                  <>
                    Manage Subscription
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                className="w-full bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg"
                onClick={handleUpgrade}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading Checkout...
                  </>
                ) : (
                  "Upgrade to Pro"
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default subscriptionPage;
