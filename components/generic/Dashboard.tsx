import Orders from './Orders';
import { useState } from 'react';
import { CustomAxiosError } from 'types';
import { useUser } from '@context/User';
import { useData } from '@context/Data';
import { useAlert } from '@context/Alert';
import styles from '@styles/generic/Dashboard.module.css';
import ActionButton from '@components/layout/ActionButton';
import { axiosInstance, showErrorAlert } from '@utils/index';

export default function Dashboard() {
  // Hooks
  const { customer } = useUser();
  const { setAlerts } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const {
    customerUpcomingOrders,
    customerDeliveredOrders,
    setCustomerDeliveredOrders,
  } = useData();

  // Handle load all delivered orders
  async function handleLoadAllDeliveredOrders() {
    try {
      // Show loader
      setIsLoading(true);

      // Make request to backend
      const response = await axiosInstance.get(`/orders/me/delivered-orders/0`);

      // Update state
      setCustomerDeliveredOrders((prevState) => ({
        ...prevState,
        data: response.data,
      }));
    } catch (err) {
      // Log error
      console.log(err);

      // Show error alert
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      // Remove loader
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.dashboard}>
      {customer && (
        <>
          {customerUpcomingOrders.isLoading && <h2>Loading...</h2>}

          {/* If there are no upcoming orders */}
          {!customerUpcomingOrders.isLoading &&
            customerUpcomingOrders.data.length === 0 && (
              <h2>No upcoming orders</h2>
            )}

          {/* Active orders */}
          {customerUpcomingOrders.data.length > 0 && (
            <div className={styles.active_orders}>
              <h2>Active orders</h2>
              <Orders orders={customerUpcomingOrders.data} />
            </div>
          )}

          {customerDeliveredOrders.isLoading && <h2>Loading...</h2>}

          {/* If there are no upcoming orders */}
          {!customerDeliveredOrders.isLoading &&
            customerDeliveredOrders.data.length === 0 && (
              <h2>No delivered orders</h2>
            )}

          {/* Delivered orders */}
          {customerDeliveredOrders.data.length > 0 && (
            <div className={styles.delivered_orders}>
              <h2>Delivered orders</h2>

              <Orders orders={customerDeliveredOrders.data} />

              {customerDeliveredOrders.data.length === 10 && (
                <span className={styles.load_all}>
                  <ActionButton
                    buttonText='Load all orders'
                    isLoading={isLoading}
                    handleClick={handleLoadAllDeliveredOrders}
                  />
                </span>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
