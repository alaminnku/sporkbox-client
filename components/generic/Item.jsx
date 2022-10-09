import { useEffect, useState } from "react";
import { useData } from "@context/data";
import { useRouter } from "next/router";
import { HiMinus, HiPlus } from "react-icons/hi";
import { convertNumber } from "@utils/index";
import { useCart } from "@context/cart";
import styles from "@styles/generic/Item.module.css";

export default function Item() {
  const router = useRouter();
  const [item, setItem] = useState(null);
  const { scheduledRestaurants } = useData();
  const { addItemToCart } = useCart();
  const [initialItem, setInitialItem] = useState({
    id: "",
    name: "",
    quantity: 1,
    price: "",
    total: "",
    date: "",
    restaurant: "",
  });

  // Price and quantity
  const { quantity, price } = initialItem;

  // Get the item from schedules restaurants
  useEffect(() => {
    if (scheduledRestaurants) {
      setItem(
        scheduledRestaurants
          .find((restaurant) => restaurant._id === router.query.restaurant)
          .items.find((item) => item._id === router.query.item)
      );
    }
  }, [scheduledRestaurants]);

  // Update initial item
  useEffect(() => {
    if (item) {
      setInitialItem({
        id: item._id,
        name: item.name,
        quantity: 1,
        price: parseFloat(item.price),
        total: parseFloat(item.price),
        date: router.query.date,
        restaurant: router.query.restaurant,
      });
    }
  }, [item]);

  // Increase quantity
  function increaseQuantity() {
    setInitialItem((prevItem) => ({
      ...prevItem,
      quantity: prevItem.quantity + 1,
      total: parseFloat(prevItem.price * (prevItem.quantity + 1)),
    }));
  }

  // Decrease quantity
  function decreaseQuantity() {
    setInitialItem((prevItem) => ({
      ...prevItem,
      quantity: prevItem.quantity - 1,
      total: parseFloat(prevItem.price * (prevItem.quantity - 1)),
    }));
  }

  return (
    <section className={styles.item}>
      {!item && <h2>No item</h2>}
      {item && (
        <>
          <div className={styles.cover_image}></div>

          <div className={styles.item_details}>
            <p className={styles.item_name}>{item.name}</p>
            <p className={styles.item_description}>{item.description}</p>
            <p className={styles.item_tags}>{item.tags}</p>
          </div>

          <div className={styles.controller}>
            <div
              onClick={decreaseQuantity}
              className={`${styles.minus} ${styles.icon} ${
                quantity > 1 && styles.active
              }`}
            >
              <HiMinus />
            </div>
            <p className={styles.item_quantity}>{quantity}</p>
            <div
              onClick={increaseQuantity}
              className={`${styles.plus} ${styles.icon}`}
            >
              <HiPlus />
            </div>
          </div>

          <button
            className={styles.button}
            onClick={() => addItemToCart(initialItem)}
          >
            Add {quantity} to basket • {convertNumber(quantity * price)} USD
          </button>
        </>
      )}
    </section>
  );
}