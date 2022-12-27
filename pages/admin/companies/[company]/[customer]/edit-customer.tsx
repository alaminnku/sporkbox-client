import EditCustomer from "@components/admin/EditCustomer";
import PageLoader from "@components/layout/PageLoader";
import { useUser } from "@context/User";
import { checkUser } from "@utils/index";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function EditCustomerPage() {
  const router = useRouter();
  const { isUserLoading, isAdmin } = useUser();

  useEffect(() => {
    checkUser(isUserLoading, isAdmin, router);
  }, [isUserLoading, isAdmin]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isAdmin && <EditCustomer />}
    </main>
  );
}
