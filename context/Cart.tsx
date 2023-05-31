import { AxiosError } from "axios";
import { useAlert } from "./Alert";
import { useData } from "@context/Data";
import { useUser } from "@context/User";
import { useRouter } from "next/router";
import {
  IItem,
  ICartItem,
  IAxiosError,
  ICartContext,
  IContextProviderProps,
} from "types";
import { useState, useEffect, useContext, createContext } from "react";
import {
  axiosInstance,
  formatNumberToUS,
  showErrorAlert,
  showSuccessAlert,
} from "@utils/index";

// Create context
const CartContext = createContext({} as ICartContext);

// Create hook
export const useCart = () => useContext(CartContext);

// Provider function
export default function CartProvider({ children }: IContextProviderProps) {
  // Hooks
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { customer, isCustomer } = useUser();
  const { setCustomerUpcomingOrders } = useData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);

  // Get cart items from local storage on app reload
  useEffect(() => {
    // Get cart items from local storage
    setCartItems(
      JSON.parse(localStorage.getItem(`cart-${customer?._id}`) || "[]")
    );
  }, [customer, router.isReady]);

  // Calculate total quantity
  const totalCartQuantity = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  // Calculate total price
  const totalCartPrice = cartItems.reduce(
    (acc, item) =>
      formatNumberToUS(acc + item.addonPrice + item.price * item.quantity),
    0
  );

  // Add item to cart
  function addItemToCart(initialItem: ICartItem, item: IItem) {
    // Check if the required addons are added
    if (initialItem.requiredAddons.length < item.requiredAddons.addable) {
      return showErrorAlert(
        `Please add ${item.requiredAddons.addable} required addons`,
        setAlerts
      );
    }

    // Initiate updated items array
    let updatedCartItems: ICartItem[] = [];

    // Add item to cart if the
    // item ins't already in cart
    if (
      !cartItems.some(
        (cartItem) =>
          cartItem._id === initialItem._id &&
          cartItem.companyId === initialItem.companyId &&
          cartItem.deliveryDate === initialItem.deliveryDate
      )
    ) {
      updatedCartItems = [...cartItems, initialItem];
    } else {
      // If the item is already
      // in cart update the quantity
      updatedCartItems = cartItems.map((cartItem) => {
        if (
          cartItem._id === initialItem._id &&
          cartItem.companyId === initialItem.companyId &&
          cartItem.deliveryDate === initialItem.deliveryDate
        ) {
          return {
            ...cartItem,
            quantity: initialItem.quantity,
            addonPrice: initialItem.addonPrice,
            optionalAddons: initialItem.optionalAddons,
            requiredAddons: initialItem.requiredAddons,
            removableIngredients: initialItem.removableIngredients,
          };
        } else {
          // Return other cart items
          return cartItem;
        }
      });
    }

    // Update state
    setCartItems(updatedCartItems);

    // Save cart to local storage
    localStorage.setItem(
      `cart-${customer?._id}`,
      JSON.stringify(updatedCartItems)
    );

    // Back to calendar page
    router.back();
  }

  // Remove cart item
  function removeItemFromCart(item: ICartItem) {
    // Filter the items by item id
    const updatedCartItems = cartItems.filter(
      (cartItem) =>
        !(
          cartItem._id === item._id &&
          cartItem.companyId === item.companyId &&
          cartItem.deliveryDate === item.deliveryDate
        )
    );

    // Set updated items to cart
    setCartItems(updatedCartItems);

    // Set updated items to local storage
    localStorage.setItem(
      `cart-${customer?._id}`,
      JSON.stringify(updatedCartItems)
    );
  }

  // Checkout cart
  async function checkoutCart() {
    if (isCustomer) {
      // Create orders payload
      const ordersPayload = cartItems.map((cartItem) => ({
        itemId: cartItem._id,
        quantity: cartItem.quantity,
        companyId: cartItem.companyId,
        restaurantId: cartItem.restaurantId,
        deliveryDate: cartItem.deliveryDate,
        optionalAddons: cartItem.optionalAddons,
        requiredAddons: cartItem.requiredAddons,
        removedIngredients: cartItem.removableIngredients,
      }));

      try {
        // Show loader
        setIsLoading(true);

        // Make request to the backend
        const response = await axiosInstance.post(`/orders/create-orders`, {
          ordersPayload,
        });

        if (typeof response.data === "string") {
          // Open Stripe checkout page
          open(response.data);
        } else {
          // Remove cart items
          setCartItems([]);
          localStorage.removeItem(`cart-${customer?._id}`);

          // Update customer's active orders state
          setCustomerUpcomingOrders((currState) => ({
            ...currState,
            data: [...currState.data, ...response.data],
          }));

          // Show success alert
          showSuccessAlert("Orders placed", setAlerts);

          // Push to the dashboard page
          router.push("/dashboard");
        }
      } catch (err) {
        // Log error
        console.log(err);

        // Show error alert
        showErrorAlert(err as AxiosError<IAxiosError>, setAlerts);
      } finally {
        // Remove loader
        setIsLoading(false);
      }
    } else {
      router.push("/login");
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        setCartItems,
        checkoutCart,
        addItemToCart,
        totalCartPrice,
        totalCartQuantity,
        removeItemFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
