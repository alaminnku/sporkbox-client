import Link from 'next/link';
import Image from 'next/image';
import CartIcon from './CartIcon';
import { CustomAxiosError } from 'types';
import { useUser } from '@context/User';
import { useRouter } from 'next/router';
import { useData } from '@context/Data';
import { useAlert } from '@context/Alert';
import logo from '@public/layout/logo.png';
import { useEffect, useState } from 'react';
import { axiosInstance, showErrorAlert } from '@utils/index';
import styles from '@styles/layout/DesktopNav.module.css';

export default function DesktopNav() {
  // Hooks
  const { setAlerts } = useAlert();
  const { upcomingDates } = useData();
  const pathName = useRouter().pathname;
  const [date, setDate] = useState<number>();
  const { isAdmin, isCustomer, setAdmin, setCustomer } = useUser();

  // Get first scheduled date of next week
  useEffect(() => {
    if (upcomingDates.length > 0) {
      setDate(upcomingDates[0]);
    }
  }, [upcomingDates]);

  // Handle sign out
  async function handleSignOut() {
    try {
      // Make request to backend
      await axiosInstance.post(`/users/logout`, {});

      // Update state
      if (isAdmin) {
        setAdmin(null);
      } else {
        setCustomer(null);
      }
    } catch (err) {
      // Log error
      console.log(err);

      // Show error alert
      showErrorAlert(err as CustomAxiosError, setAlerts);
    }
  }

  return (
    <nav className={styles.desktop_nav}>
      <div className={styles.logo}>
        <Link href={`${isCustomer ? '/dashboard' : '/admin'}`}>
          <a>
            <Image src={logo} alt='Logo' priority />
          </a>
        </Link>
      </div>

      <ul className={styles.navigation}>
        <li className={!isCustomer ? styles.hide : ''}>
          <Link href='/profile'>
            <a className={pathName === '/profile' ? styles.active : ''}>
              Profile
            </a>
          </Link>
        </li>

        <li className={!isCustomer ? styles.hide : ''}>
          <Link href='/dashboard'>
            <a className={pathName === '/dashboard' ? styles.active : ''}>
              Dashboard
            </a>
          </Link>
        </li>

        <li className={!date || !isCustomer ? styles.hide : ''}>
          <Link href={`/place-order/${date}`}>
            <a className={pathName === '/place-order' ? styles.active : ''}>
              Place order
            </a>
          </Link>
        </li>

        <li className={!isCustomer ? styles.hide : ''}>
          <Link href={`/favorite`}>
            <a className={pathName === '/favorite' ? styles.active : ''}>
              Favorite
            </a>
          </Link>
        </li>

        <li className={isAdmin ? styles.hide : ''}>
          <Link href='/contact-us'>
            <a className={pathName === '/contact-us' ? styles.active : ''}>
              Contact
            </a>
          </Link>
        </li>

        <li className={styles.hide}>
          <Link href='/about-us'>
            <a className={pathName === '/about-us' ? styles.active : ''}>
              About us
            </a>
          </Link>
        </li>

        {/* Admin nav items */}
        <li className={!isAdmin ? styles.hide : ''}>
          <Link href='/admin'>
            <a className={pathName === '/admin' ? styles.active : ''}>
              Dashboard
            </a>
          </Link>
        </li>

        <li className={!isAdmin ? styles.hide : ''}>
          <Link href='/admin/delivered-orders'>
            <a
              className={
                pathName === '/admin/delivered-orders' ? styles.active : ''
              }
            >
              Delivered
            </a>
          </Link>
        </li>

        <li className={!isAdmin ? styles.hide : ''}>
          <Link href='/admin/restaurants'>
            <a
              className={pathName === '/admin/restaurants' ? styles.active : ''}
            >
              Restaurants
            </a>
          </Link>
        </li>

        <li className={!isAdmin ? styles.hide : ''}>
          <Link href='/admin/companies'>
            <a className={pathName === '/admin/companies' ? styles.active : ''}>
              Companies
            </a>
          </Link>
        </li>

        <li className={!isAdmin ? styles.hide : ''}>
          <Link href='/admin/add-admin'>
            <a className={pathName === '/admin/add-admin' ? styles.active : ''}>
              Add admin
            </a>
          </Link>
        </li>

        <li className={!isAdmin ? styles.hide : ''}>
          <Link href='/admin/discount-codes'>
            <a
              className={
                pathName === '/admin/discount-codes' ? styles.active : ''
              }
            >
              Discount codes
            </a>
          </Link>
        </li>

        <li className={!isAdmin ? styles.hide : ''}>
          <Link href='/admin/stat'>
            <a className={pathName === '/admin/stat' ? styles.active : ''}>
              Stat
            </a>
          </Link>
        </li>
      </ul>

      {/* Call to actions */}
      <div className={styles.ctas}>
        {/* Only show cart icon if there a customer */}
        {isCustomer && <CartIcon />}

        {/* Sign out button */}
        <button
          onClick={handleSignOut}
          className={`${styles.sign_out} ${
            !isAdmin && !isCustomer && styles.hide
          }`}
        >
          Sign out
        </button>

        {/* Login button */}
        <Link href='/login'>
          <a
            className={`${styles.sing_in} ${
              (isAdmin || isCustomer) && styles.hide
            }`}
          >
            Sign in
          </a>
        </Link>
      </div>
    </nav>
  );
}
