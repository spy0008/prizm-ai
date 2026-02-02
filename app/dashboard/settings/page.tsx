"use client";

import Header from "@/components/header";
import RepositoryList from "@/module/repository/components/repositoryList";
import { ProfileForm } from "@/module/settings/components/profile-form";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

const SettingPage = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">

      {/* Animated Grid Background */}
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10 space-y-6 px-6 md:px-12">

        <Header
          title="Settings"
          description="Manage your account settings and connected repositories:"
        />

        <ProfileForm />
        <RepositoryList />

      </div>
    </main>
  );
};

export default SettingPage;
