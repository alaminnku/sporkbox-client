import Link from 'next/link';
import { CSVLink } from 'react-csv';
import { OrderGroup } from 'types';
import { FiDownload } from 'react-icons/fi';
import styles from './OrderGroupRow.module.css';
import { dateToMS, dateToText } from '@lib/utils';
import {
  formatOrderDataToCSV,
  createOrderCSVFileName,
  orderCSVHeaders,
} from '@lib/csv';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Labels from './Labels';

type Props = {
  slug: string;
  orderGroup: OrderGroup;
  orderGroups: OrderGroup[];
};

export default function OrderGroupRow({
  slug,
  orderGroup,
  orderGroups,
}: Props) {
  const todaysOrders = [];
  for (const group of orderGroups) {
    if (group.deliveryDate === orderGroup.deliveryDate) {
      todaysOrders.push(...group.orders);
    }
  }
  todaysOrders.sort((a, b) => {
    const restaurantComp = a.restaurant.name.localeCompare(b.restaurant.name);
    if (restaurantComp !== 0) return restaurantComp;
    return a.item.name.localeCompare(b.item.name);
  });

  return (
    <tr className={styles.orders_group_row}>
      <td className={styles.important}>
        <Link
          href={`/admin/${slug}/${orderGroup.company._id}/${dateToMS(
            orderGroup.deliveryDate
          )}`}
        >
          <a>{dateToText(orderGroup.deliveryDate)} </a>
        </Link>
      </td>
      <td className={styles.hide_on_mobile}>{orderGroup.company.name}</td>
      <td className={styles.shift}>{orderGroup.company.shift}</td>
      <td className={`${styles.restaurants} ${styles.hide_on_mobile}`}>
        {orderGroup.restaurants.map((restaurant) => (
          <span key={restaurant}>{restaurant}</span>
        ))}
      </td>
      <td>{orderGroup.customers.length}</td>
      <td>{orderGroup.orders.length}</td>
      <td className={styles.actions}>
        {slug === 'upcoming-orders' && (
          <PDFDownloadLink
            document={<Labels orders={todaysOrders} />}
            fileName={`Labels - ${dateToText(orderGroup.deliveryDate)}.pdf`}
          >
            {({ loading }) =>
              loading ? (
                'Loading...'
              ) : (
                <>
                  Labels <FiDownload />
                </>
              )
            }
          </PDFDownloadLink>
        )}
        <CSVLink
          headers={orderCSVHeaders}
          data={formatOrderDataToCSV(orderGroup)}
          filename={createOrderCSVFileName(orderGroup)}
        >
          CSV <FiDownload />
        </CSVLink>
      </td>
    </tr>
  );
}
