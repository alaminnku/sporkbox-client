import { useData } from '@context/Data';
import { useRouter } from 'next/router';
import { useAlert } from '@context/Alert';
import { useEffect, useState } from 'react';
import CustomerOrders from './CustomerOrders';
import styles from './Customer.module.css';
import { CustomAxiosError, Company, Order, CustomerWithCompany } from 'types';
import {
  axiosInstance,
  showErrorAlert,
  groupIdenticalOrdersAndSort,
} from '@lib/utils';

type CustomerWithOrders = {
  upcomingOrders: Order[];
  deliveredOrders: Order[];
  data: CustomerWithCompany | null;
};

export default function Customer() {
  const router = useRouter();
  const { setAlerts } = useAlert();
  const { customers, allUpcomingOrders } = useData();
  const [customer, setCustomer] = useState<CustomerWithOrders>({
    data: null,
    upcomingOrders: [],
    deliveredOrders: [],
  });

  async function getDeliveredOrders() {
    try {
      const response = await axiosInstance.get<Order[]>(
        `/orders/${router.query.customer}/all-delivered-orders`
      );
      setCustomer((prevState) => ({
        ...prevState,
        deliveredOrders: response.data.filter(
          (deliveredOrder) =>
            deliveredOrder.company._id === router.query.company
        ),
      }));
    } catch (err) {
      console.log(err);
      showErrorAlert(err as CustomAxiosError, setAlerts);
    }
  }

  // Get customer data and upcoming orders
  useEffect(() => {
    if (router.isReady && customers.data.length > 0) {
      const customer = customers.data.find(
        (customer) => customer._id === router.query.customer
      );

      if (customer) {
        const { companies, ...rest } = customer;
        const customerWithCompany = {
          ...rest,
          company: companies.find(
            (company) => company._id === router.query.company
          ) as Company,
        };
        setCustomer((prevState) => ({
          ...prevState,
          data: customerWithCompany,
          upcomingOrders: allUpcomingOrders.data.filter(
            (upcomingOrder) =>
              upcomingOrder.customer._id === router.query.customer &&
              upcomingOrder.company._id === router.query.company
          ),
        }));
      }
    }
    if (customer) getDeliveredOrders();
  }, [router.isReady, customers, allUpcomingOrders]);

  return (
    <section className={styles.customer}>
      {customers.isLoading && <h2>Loading...</h2>}

      {!customers.isLoading && !customer && <h2> No customer found</h2>}

      {customer.data && (
        <>
          <h2>General</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Shift</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {customer.data.firstName} {customer.data.lastName}
                </td>
                <td>{customer.data.company.name}</td>
                <td className={styles.shift}>{customer.data.company.shift}</td>
                <td>
                  {customer.data.company.address.addressLine2 ? (
                    <>
                      {customer.data.company.address.addressLine1},{' '}
                      {customer.data.company.address.addressLine2},{' '}
                      {customer.data.company.address.city},{' '}
                      {customer.data.company.address.state}{' '}
                      {customer.data.company.address.zip}
                    </>
                  ) : (
                    <>
                      {customer.data.company.address.addressLine1},{' '}
                      {customer.data.company.address.city},{' '}
                      {customer.data.company.address.state}{' '}
                      {customer.data.company.address.zip}
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
      {customer.upcomingOrders.length > 0 && (
        <CustomerOrders
          orderStatus='Upcoming'
          orders={groupIdenticalOrdersAndSort(customer.upcomingOrders)}
        />
      )}
      {customer.deliveredOrders.length > 0 && (
        <CustomerOrders
          orderStatus='Delivered'
          orders={groupIdenticalOrdersAndSort(customer.deliveredOrders)}
        />
      )}
    </section>
  );
}
