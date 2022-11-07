import OrderRow from "./OrderRow";
import { useState } from "react";
import { useData } from "@context/Data";
import { BiSort } from "react-icons/bi";
import { useRouter } from "next/router";
import FilterAndSort from "./FilterAndSort";
import { axiosInstance } from "@utils/index";
import { IOrder, IOrdersProps } from "types";
import styles from "@styles/admin/Orders.module.css";
import ActionButton from "@components/layout/ActionButton";

export default function Orders({ title, orders }: IOrdersProps) {
  // Hooks
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    setDeliveredOrders,
    isAllActiveOrdersLoading,
    isAllDeliveredOrdersLoading,
  } = useData();
  const [showController, setShowController] = useState<boolean>(false);
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);

  async function handleLoadAllDeliveredOrders() {
    // Get all delivered orders
    try {
      // Show loader
      setIsLoading(true);

      // Make request to backend
      const response = await axiosInstance.get(`/orders/delivered/0`);

      // Update state
      setDeliveredOrders(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      // Remove loader
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.orders}>
      {isAllActiveOrdersLoading ||
        (isAllDeliveredOrdersLoading && <h2>Loading...</h2>)}

      {/* If there are no active orders */}
      {!isAllActiveOrdersLoading &&
        !isAllDeliveredOrdersLoading &&
        orders.length === 0 && <h2>No {title.toLowerCase()}</h2>}

      {/* If there are active orders */}
      {orders.length > 0 && (
        <>
          {/* Title and filter icon */}
          <div className={styles.orders_top}>
            <h2>{title}</h2>

            <p
              className={`${styles.filter} ${
                showController && styles.show_controller
              }`}
              onClick={() => setShowController(!showController)}
            >
              Filter <BiSort />
            </p>
          </div>

          {/* Filters */}
          <FilterAndSort
            orders={orders}
            showController={showController}
            setFilteredOrders={setFilteredOrders}
          />

          {/* Orders */}
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th className={styles.hide_on_mobile}>Company</th>
                <th className={styles.hide_on_mobile}>Restaurant</th>
                <th>Delivery date</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <>
                  {orders.map((order, index) => (
                    <OrderRow key={index} order={order} />
                  ))}
                </>
              ) : (
                <>
                  {filteredOrders.map((order, index) => (
                    <OrderRow key={index} order={order} />
                  ))}
                </>
              )}
            </tbody>
          </table>

          {router.pathname === "/admin/orders" && orders.length === 25 && (
            <span className={styles.load_all}>
              <ActionButton
                buttonText="Load all orders"
                isLoading={isLoading}
                handleClick={handleLoadAllDeliveredOrders}
              />
            </span>
          )}
        </>
      )}
    </section>
  );
}
