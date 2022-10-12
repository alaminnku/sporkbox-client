import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@context/Cart";
import { convertDateToText, formatCurrencyToUSD } from "@utils/index";
import { IoMdRemove } from "react-icons/io";
import styles from "@styles/generic/Cart.module.css";
import ButtonLoader from "@components/layout/ButtonLoader";

export default function Cart() {
  const {
    cartItems,
    removeItemFromCart,
    totalCartPrice,
    checkoutCart,
    isLoading,
  } = useCart();

  return (
    <section className={styles.cart}>
      {cartItems.length === 0 && <h2>No items in basket</h2>}

      {cartItems.length > 0 && (
        <>
          <h2 className={styles.cart_title}>Your basket</h2>
          <div className={styles.items}>
            {cartItems.map((cartItem) => (
              <div key={cartItem.id} className={styles.item}>
                <div className={styles.cover_image}>
                  <Image
                    src="https://images.unsplash.com/photo-1613987245117-50933bcb3240?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
                    height={2}
                    width={3}
                    layout="responsive"
                    objectFit="cover"
                  />

                  <div
                    className={styles.remove}
                    onClick={() => removeItemFromCart(cartItem.id)}
                  >
                    <IoMdRemove />
                  </div>
                </div>

                <Link
                  href={`/calendar/${cartItem.date}/${cartItem.restaurant}/${cartItem.id}`}
                >
                  <a className={styles.item_details}>
                    <p className={styles.name}>
                      <span>{cartItem.quantity}</span> {cartItem.name}
                    </p>
                    <p className={styles.price}>
                      Total: {formatCurrencyToUSD(cartItem.total)}
                    </p>
                    <p className={styles.date}>
                      Delivery date:{" "}
                      <span>{convertDateToText(cartItem.date)}</span>
                    </p>
                  </a>
                </Link>
              </div>
            ))}
          </div>

          <button onClick={checkoutCart} className={styles.button}>
            {isLoading ? (
              <ButtonLoader />
            ) : (
              `Checkout • ${formatCurrencyToUSD(totalCartPrice)}`
            )}
          </button>
        </>
      )}
    </section>
  );
}