import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useData } from '@context/Data';
import { useCart } from '@context/Cart';
import { useEffect, useState } from 'react';
import { getDay, getDate, dateToMS, numberToUSD } from '@lib/utils';
import CalendarSort from './CalendarSort';
import { UpcomingRestaurant } from 'types';
import { IoIosArrowUp } from 'react-icons/io';
import CalendarFiltersModal from './CalendarFiltersModal';
import styles from './Calendar.module.css';
import ModalContainer from '@components/layout/ModalContainer';
import { AiFillStar } from 'react-icons/ai';

export default function Calendar() {
  const router = useRouter();
  const { cartItems } = useCart();
  const [sorted, setSorted] = useState({
    byLowToHigh: false,
    byHighToLow: false,
  });
  const [activeRestaurants, setActiveRestaurants] = useState<
    { id: string; show: boolean }[]
  >([]);
  const { upcomingDates, upcomingRestaurants } = useData();
  const [showCalendarFilters, setShowCalendarFilters] = useState(false);
  const [restaurants, setRestaurants] = useState<UpcomingRestaurant[]>([]);
  const [updatedRestaurants, setUpdatedRestaurants] = useState<
    UpcomingRestaurant[]
  >([]);

  function updateActiveRestaurants(restaurant: UpcomingRestaurant) {
    setActiveRestaurants((prevState) =>
      prevState.map((activeRestaurant) => {
        if (activeRestaurant.id === restaurant._id) {
          return {
            ...activeRestaurant,
            show: !activeRestaurant.show,
          };
        } else {
          return activeRestaurant;
        }
      })
    );
  }

  // Get restaurants for a date
  useEffect(() => {
    if (upcomingDates.length > 0 && router.isReady) {
      const upcomingDate = upcomingDates.find(
        (upcomingDate) => upcomingDate.toString() === router.query.date
      );

      if (upcomingDate) {
        const upcomingRestaurantsOnDate = upcomingRestaurants.data
          .filter(
            (upcomingRestaurant) =>
              dateToMS(upcomingRestaurant.date) === upcomingDate
          )
          .sort(
            (a, b) =>
              new Date(a.scheduledAt).getTime() -
              new Date(b.scheduledAt).getTime()
          );
        const activeRestaurants = upcomingRestaurantsOnDate.map(
          (upcomingRestaurant) => ({
            id: upcomingRestaurant._id,
            show: true,
          })
        );

        setActiveRestaurants(activeRestaurants);
        setRestaurants(upcomingRestaurantsOnDate);
        setUpdatedRestaurants(upcomingRestaurantsOnDate);
      }
    }
  }, [upcomingDates, router]);

  return (
    <>
      <section className={styles.calendar}>
        {upcomingRestaurants.isLoading && <h2>Loading...</h2>}
        {!upcomingRestaurants.isLoading &&
          upcomingRestaurants.data.length === 0 && <h2>No restaurants</h2>}

        {upcomingDates.length > 0 && (
          <>
            <div className={styles.header_and_controller}>
              <div className={styles.header}>
                <h2>Upcoming week</h2>
                <CalendarSort
                  setSorted={setSorted}
                  updatedRestaurants={updatedRestaurants}
                />
                <p
                  onClick={() => setShowCalendarFilters(true)}
                  className={`${styles.filter} ${
                    showCalendarFilters && styles.active
                  }`}
                >
                  Filter
                </p>
              </div>

              <div className={styles.controller}>
                {upcomingDates.map((upcomingDate, index) => (
                  <div key={index}>
                    <Link href={`/place-order/${upcomingDate}`}>
                      <a
                        key={index}
                        className={
                          upcomingDate.toString() === router.query.date
                            ? styles.active
                            : ''
                        }
                      >
                        <span>{getDate(upcomingDate)}</span>
                        <span>{getDay(upcomingDate)}</span>
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {updatedRestaurants.length > 0 ? (
              <>
                {updatedRestaurants.map((restaurant, index) => (
                  <div key={index} className={styles.restaurant}>
                    <h2
                      className={styles.restaurant_name}
                      onClick={() => updateActiveRestaurants(restaurant)}
                    >
                      {restaurant.name}
                      <IoIosArrowUp
                        className={`${styles.restaurant_name_arrow} ${
                          activeRestaurants.some(
                            (activeRestaurant) =>
                              !activeRestaurant.show &&
                              activeRestaurant.id === restaurant._id
                          ) && styles.rotate_arrow
                        }`}
                      />
                    </h2>

                    {activeRestaurants.some(
                      (activeRestaurant) =>
                        activeRestaurant.show &&
                        activeRestaurant.id === restaurant._id
                    ) ? (
                      <div className={styles.items}>
                        {restaurant.items.map((item) => (
                          <div key={item._id}>
                            <Link
                              href={`/place-order/${router.query.date}/${restaurant.company.shift}/${restaurant._id}/${item._id}`}
                            >
                              <a className={styles.item}>
                                <div className={styles.item_details}>
                                  <p className={styles.name}>
                                    {item.name}
                                    {item.averageRating && (
                                      <span>
                                        <AiFillStar />
                                        {item.averageRating}
                                      </span>
                                    )}
                                  </p>
                                  <p className={styles.price}>
                                    {numberToUSD(item.price)}
                                  </p>
                                  <p className={styles.description}>
                                    {item.description}
                                  </p>
                                </div>

                                <div className={styles.item_image}>
                                  <Image
                                    src={item.image || restaurant.logo}
                                    width={16}
                                    height={10}
                                    objectFit='cover'
                                    layout='responsive'
                                  />

                                  {cartItems.map(
                                    (cartItem) =>
                                      cartItem.deliveryDate.toString() ===
                                        router.query.date &&
                                      cartItem._id === item._id &&
                                      cartItem.companyId ===
                                        restaurant.company._id && (
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
                    ) : (
                      <p className={styles.collapsed_text}>
                        Items are collapsed!
                      </p>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <h2>No items found</h2>
            )}
          </>
        )}
      </section>

      <ModalContainer
        width='20rem'
        showModalContainer={showCalendarFilters}
        setShowModalContainer={setShowCalendarFilters}
        component={
          <CalendarFiltersModal
            restaurants={restaurants}
            setUpdatedRestaurants={setUpdatedRestaurants}
            setShowCalendarFilters={setShowCalendarFilters}
          />
        }
      />
    </>
  );
}
