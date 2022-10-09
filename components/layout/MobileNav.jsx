import Image from "next/image";
import Link from "next/link";
import logo from "@public/layout/logo.png";
import CartIcon from "./CartIcon";
import styles from "@styles/layout/MobileNav.module.css";

export default function MobileNav({ isOpen, setIsOpen }) {
  return (
    <nav className={styles.mobile_nav}>
      <div
        className={`${styles.hamburger} ${isOpen && styles.open}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.line}></div>
      </div>

      <div className={styles.logo} onClick={() => setIsOpen(false)}>
        <Link href="/">
          <a>
            <Image src={logo} alt="logo" priority />
          </a>
        </Link>
      </div>

      <CartIcon />
    </nav>
  );
}
