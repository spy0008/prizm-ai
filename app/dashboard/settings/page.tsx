"use client";

import Header from "@/components/header";
import RepositoryList from "@/module/repository/components/repositoryList";
import { ProfileForm } from "@/module/settings/components/profile-form";

const SettingPage = () => {
  return (
    <div className="space-y-6">
      <Header
        title="Settings"
        description="Manage your account settings and connected repositories:"
      />

      <ProfileForm />
      <RepositoryList />
    </div>
  );
};

export default SettingPage;
