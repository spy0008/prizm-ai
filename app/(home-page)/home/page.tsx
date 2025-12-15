import { requireAuth } from "@/module/auth/utils/auth-utils";
import { redirect } from "next/navigation";

const HomePage = async () => {
  await requireAuth();
  return redirect('/dashboard');
};

export default HomePage;
