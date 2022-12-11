import { convertDateToMS, convertDateToText, textToSlug } from "@utils/index";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IOrdersByRestaurant, IOrdersGroupDetailsProps } from "types";

export default function OrdersGroup({
  isLoading,
  ordersGroups,
}: IOrdersGroupDetailsProps) {
  const router = useRouter();
  const [ordersByRestaurants, setOrdersByRestaurants] = useState<
    IOrdersByRestaurant[]
  >([]);

  console.log(ordersByRestaurants);

  useEffect(() => {
    if (router.isReady && !isLoading) {
      // Find the orders group
      const ordersGroup = ordersGroups.find(
        (ordersGroup) =>
          convertDateToMS(ordersGroup.deliveryDate) === +router.query.date! &&
          textToSlug(ordersGroup.companyName) === router.query.company
      );

      // Separate orders for each restaurant
      if (ordersGroup) {
        setOrdersByRestaurants(
          ordersGroup.restaurants.reduce((acc: IOrdersByRestaurant[], curr) => {
            return [
              ...acc,
              {
                restaurantName: curr,
                companyName: ordersGroup.companyName,
                deliveryDate: ordersGroup.deliveryDate,
                orders: ordersGroup.orders.filter(
                  (order) => order.restaurantName === curr
                ),
              },
            ];
          }, [])
        );
      }
    }
  }, [router.isReady, isLoading]);

  return (
    <section>
      {isLoading && <h2>Loading...</h2>}

      {!isLoading && ordersByRestaurants.length === 0 && (
        <h2>No orders found</h2>
      )}

      {ordersByRestaurants.length > 0 && (
        <>
          <h2>Order details - {convertDateToText(+router.query.date!)}</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Company</th>
                <th>Restaurant</th>
                <th>Orders</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {ordersByRestaurants.map((ordersByRestaurant) => (
                <tr>
                  <td>{ordersByRestaurant.deliveryDate}</td>
                  <td>{ordersByRestaurant.companyName}</td>
                  <td>{ordersByRestaurant.restaurantName}</td>
                  <td>{ordersByRestaurant.orders.length}</td>
                  <td>Send delivery email</td>
                </tr>
              ))}
            </tbody>
          </table>

          {ordersByRestaurants.map((ordersByRestaurant) => (
            <>
              <h2>
                Order summary - {ordersByRestaurant.restaurantName} -{" "}
                {ordersByRestaurant.deliveryDate}
              </h2>

              <table>
                <thead>
                  <tr>
                    <td>Dish</td>
                    <td>Item price</td>
                    <td>Quantity</td>
                  </tr>
                </thead>

                <tbody>
                  {ordersByRestaurant.orders.map((order) => (
                    <>
                      <tr>
                        <td>{order.item.name}</td>
                        <td>{order.item.total / order.item.quantity}</td>
                        <td>{order.item.quantity}</td>
                      </tr>
                    </>
                  ))}
                  <tr>
                    <td>Total</td>
                    <td>
                      {ordersByRestaurant.orders.reduce(
                        (acc, curr) => acc + curr.item.quantity,
                        0
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              <h2>
                Customer information - {ordersByRestaurant.restaurantName} -{" "}
                {ordersByRestaurant.deliveryDate}
              </h2>

              <table>
                <thead>
                  <tr>
                    <td>Name</td>
                    <td>Email</td>
                    <td>Dish</td>
                  </tr>
                </thead>

                <tbody>
                  {ordersByRestaurant.orders.map((order) => (
                    <tr>
                      <td>{order.customerName}</td>
                      <td>{order.customerEmail}</td>
                      <td>{order.item.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ))}
        </>
      )}
    </section>
  );
}
