import { Button } from "@/components/ui/button";
import Logout from "@/module/auth/components/logout";
import { requireAuth } from "@/module/auth/utils/auth-utils";

const HomePage = async () => {
  await requireAuth();
  return (
    <Logout>
        <Button>
            Logout
        </Button>
    </Logout>
  );
};

export default HomePage;
