import { useEffect } from 'react';
import { useData } from '@context/Data';
import { useUser } from '@context/User';
import { checkUser } from '@lib/utils';
import { useRouter } from 'next/router';
import PageLoader from '@components/layout/PageLoader';
import OrdersGroupDetails from '@components/admin/OrdersGroupDetails';

export default function DeliveredOrdersGroupDetailsPage() {
  const router = useRouter();
  const { isUserLoading, isAdmin } = useUser();
  const { deliveredOrderGroups, allDeliveredOrders } = useData();

  useEffect(() => {
    checkUser(isUserLoading, isAdmin, router);
  }, [isUserLoading, isAdmin]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isAdmin && (
        <OrdersGroupDetails
          orderGroups={deliveredOrderGroups}
          isLoading={allDeliveredOrders.isLoading}
        />
      )}
    </main>
  );
}
