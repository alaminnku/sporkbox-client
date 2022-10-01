import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Loader from "@components/layout/Loader";
import { API_URL, hasEmpty } from "@utils/index";
import { useAdminData } from "@context/adminData";
import styles from "@styles/admin/AddRestaurant.module.css";

export default function AddRestaurant() {
  // Initial state
  const initialState = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    restaurantName: "",
    restaurantAddress: "",
  };

  // Hooks
  const router = useRouter();
  const { setRestaurants } = useAdminData();
  const [formData, setFormData] = useState(initialState);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const {
    name,
    email,
    password,
    confirmPassword,
    restaurantName,
    restaurantAddress,
  } = formData;

  // Handle change
  function handleChange(e) {
    // Check for empty field
    if (!hasEmpty(formData)) {
      setIsDisabled(false);
    }

    // Update state
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  }

  // Handle submit
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // Show loader
      setIsLoading(true);

      // Post data to backend
      const res = await axios.post(`${API_URL}/restaurant/register`, formData, {
        withCredentials: true,
      });

      // New restaurant
      const newRestaurant = res.data;

      // Update state
      setRestaurants((prevRestaurants) => [...prevRestaurants, newRestaurant]);

      // Reset form data
      setFormData(initialState);

      // Remove loader
      setIsLoading(false);
      setIsDisabled(true);

      // Push to dashboard
      router.push("/admin/restaurants");
    } catch (err) {
      console.log(err);
      // Remove loader
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.add_restaurant}>
      <p className={styles.title}>Add a restaurant</p>

      <form onSubmit={handleSubmit}>
        <p className={styles.form_title}>Owner info</p>

        <div className={styles.item}>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" value={name} onChange={handleChange} />
        </div>

        <div className={styles.item}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleChange}
          />
        </div>

        <div className={styles.item}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handleChange}
          />
        </div>

        <div className={styles.item}>
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
          />
        </div>

        <p className={styles.form_title}>Restaurant info</p>

        <div className={styles.item}>
          <label htmlFor="restaurantName">Name</label>
          <input
            type="text"
            id="restaurantName"
            value={restaurantName}
            onChange={handleChange}
          />
        </div>

        <div className={styles.item}>
          <label htmlFor="restaurantAddress">Address</label>
          <input
            type="text"
            id="restaurantAddress"
            value={restaurantAddress}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className={`${styles.button} ${!isDisabled && styles.active}`}
        >
          {isLoading ? <Loader /> : "Add Restaurant"}
        </button>
      </form>
    </section>
  );
}