import { useEffect } from "react";
import { useUser } from "@context/User";
import { useRouter } from "next/router";
import LoginForm from "@components/generic/LoginForm";
import PageLoader from "@components/layout/PageLoader";

export default function LoginPage() {
  const router = useRouter();
  const { isUserLoading, isAdmin, isCustomer } = useUser();

  // Push to a page depending on user role
  useEffect(() => {
    if (isAdmin) {
      router.push("/admin");
    } else if (isCustomer) {
      router.push("/profile");
    }
  }, [isAdmin, isCustomer]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {!isUserLoading && <LoginForm />}
    </main>
  );
}
