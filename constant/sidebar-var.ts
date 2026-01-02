import { LayoutDashboard, Settings, Banknote,FileCheck, GitBranch } from "lucide-react";

export const navigationItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Repository",
        url: "/dashboard/repository",
        icon: GitBranch,
    },
    {
        title: "Reviews",
        url: "/dashboard/reviews",
        icon: FileCheck,
    },
    {
        title: "Subscription",
        url: "/dashboard/subscription",
        icon: Banknote,
    },
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
    },
]