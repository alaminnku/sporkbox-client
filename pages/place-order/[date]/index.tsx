import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@context/User';
import { checkUser } from '@lib/utils';
import Calendar from '@components/customer/Calendar';
import PageLoader from '@components/layout/PageLoader';

export default function DatePage() {
  const router = useRouter();
  const { isUserLoading, isCustomer } = useUser();

  useEffect(() => {
    checkUser(isUserLoading, isCustomer, router);
  }, [isUserLoading, isCustomer]);

  return (
    <main>
      {isUserLoading && <PageLoader />}
      {isCustomer && <Calendar />}
    </main>
  );
}
