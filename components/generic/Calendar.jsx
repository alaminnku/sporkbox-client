import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useData } from "@context/data";
import { useCart } from "@context/cart";
import { convertDateToTime, groupBy } from "@utils/index";
import styles from "@styles/generic/Calendar.module.css";

export default function Calendar() {
  const router = useRouter();
  const { cartItems } = useCart();
  const { scheduledRestaurants } = useData();
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantGroups, setRestaurantGroups] = useState([]);

  useEffect(() => {
    if (router.isReady && scheduledRestaurants) {
      // Groups restaurants by scheduled on date
      const groups = groupBy(
        "scheduledOn",
        scheduledRestaurants,
        "restaurants"
      );

      // Find the restaurant with date from slug
      const restaurants = groups.find(
        (group) =>
          convertDateToTime(group.scheduledOn).toString() === router.query.date
      ).restaurants;

      // Update restaurants
      setRestaurants(restaurants);

      // Update groups
      setRestaurantGroups(groups);
    }
  }, [scheduledRestaurants, router]);

  // Get the date
  const getDate = (date) =>
    new Date(date).toDateString().split(" ").slice(2, 3).join();

  // Get the first letter of the day
  const getDay = (date) =>
    new Date(date).toDateString().split(" ").slice(0, 1)[0].split("")[0];

  return (
    <section className={styles.calendar}>
      {/* If there are no restaurant groups */}
      {restaurantGroups.length === 0 && <h2>No restaurants</h2>}

      {/* If there are restaurant groups */}
      {restaurantGroups.length > 0 && (
        <>
          {/* Show next week's and scheduled date */}
          <div className={styles.title_and_controller}>
            <h2 className={styles.calendar_title}>Upcoming week</h2>

            <div className={styles.controller}>
              {restaurantGroups.map((restaurantGroup) => (
                <div key={restaurantGroup.scheduledOn}>
                  <Link
                    href={`/calendar/${convertDateToTime(
                      restaurantGroup.scheduledOn
                    )}`}
                  >
                    <a
                      key={restaurantGroup.scheduledOn}
                      className={
                        convertDateToTime(
                          restaurantGroup.scheduledOn
                        ).toString() === router.query.date
                          ? styles.active
                          : null
                      }
                    >
                      <span>{getDate(restaurantGroup.scheduledOn)}</span>
                      <span>{getDay(restaurantGroup.scheduledOn)}</span>
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Show the restaurants */}
          {restaurants.map((restaurant) => (
            <div key={restaurant._id} className={styles.restaurant}>
              <h2 className={styles.title}>{restaurant.name}</h2>

              <div className={styles.items}>
                {restaurant.items.map((item) => (
                  <div key={item._id}>
                    <Link
                      href={`/calendar/${router.query.date}/${restaurant._id}/${item._id}`}
                    >
                      <a className={styles.item}>
                        <div className={styles.item_details}>
                          <p className={styles.name}>{item.name}</p>
                          <p className={styles.price}>USD ${item.price}</p>
                          <p className={styles.description}>
                            {item.description}
                          </p>
                        </div>

                        <div className={styles.item_image}>
                          {cartItems.map(
                            (cartItem) =>
                              cartItem.id === item._id && (
                                <span
                                  key={item._id}
                                  className={styles.quantity}
                                >
                                  {cartItem.quantity}
                                </span>
                              )
                          )}
                        </div>
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </section>
  );
}