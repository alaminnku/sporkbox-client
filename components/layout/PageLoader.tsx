import HashLoader from 'react-spinners/HashLoader';
import styles from './PageLoader.module.css';

export default function PageLoader() {
  return (
    <div className={styles.page_loader}>
      <HashLoader color='#f78f1e' />
    </div>
  );
}
