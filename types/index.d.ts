import { AxiosError } from 'axios';
import { DiscountCodes } from '@components/admin/DiscountCodes';
import { Dispatch, SetStateAction, ReactNode, FormEvent } from 'react';

interface IUser {
  _id: string;
  email: string;
  role: string;
  lastName: string;
  firstName: string;
}

export interface IAdmin extends IUser {}

export interface ICustomer extends IUser {
  status: string;
  shifts: string[];
  createdAt: string;
  companies: ICompany[];
  subscribedTo: {
    orderReminder: boolean;
  };
}

export interface IVendor extends IUser {
  status: string;
  createdAt: string;
  restaurant: IRestaurant;
}

export interface IRestaurant {
  _id: string;
  name: string;
  logo: string;
  items: IItem[];
  address: {
    city: string;
    state: string;
    zip: string;
    addressLine1: string;
    addressLine2?: string;
  };
  createdAt: string;
  schedules: string[];
}

export interface IScheduledRestaurant {
  _id: string;
  name: string;
  date: string;
  company: {
    _id: string;
    name: string;
    shift: string;
  };
  status: string;
  scheduleId: string;
}

export interface IUpcomingRestaurant extends IScheduledRestaurant {
  logo: string;
  items: IItem[];
  scheduledAt: string;
}

interface IItem {
  _id: string;
  tags: string;
  name: string;
  price: number;
  image: string;
  status: string;
  description: string;
  optionalAddons: {
    addons: string;
    addable: number;
  };
  requiredAddons: {
    addons: string;
    addable: number;
  };
  removableIngredients?: string;
}

export interface ICustomerFavoriteItem {
  _id: string;
  item: {
    _id: string;
    name: string;
    image: string;
  };
  customer: string;
  restaurant: {
    _id: string;
    name: string;
  };
}

export interface ICompany {
  _id: string;
  name: string;
  shift: string;
  code: string;
  website: string;
  address: {
    city: string;
    state: string;
    zip: string;
    addressLine1: string;
    addressLine2?: string;
  };
  createdAt: string;
  shiftBudget: number;
  status: 'ACTIVE' | 'ARCHIVED';
}

export interface IDiscountCode {
  _id: string;
  code: string;
  value: number;
  totalRedeem: number;
  redeemability: string;
}

export interface IContextProviderProps {
  children: ReactNode;
}

export interface IUserContext {
  isAdmin: boolean;
  isCustomer: boolean;
  admin: IAdmin | null;
  isUserLoading: boolean;
  customer: ICustomer | null;
  setAdmin: Dispatch<SetStateAction<IAdmin | null>>;
  setCustomer: Dispatch<SetStateAction<ICustomer | null>>;
}

interface IIsLoading {
  isLoading: boolean;
}

export interface IAllUpcomingOrders extends IIsLoading {
  data: IOrder[];
}

export interface IScheduledRestaurants extends IIsLoading {
  data: IScheduledRestaurant[];
}

export interface ICompanies extends IIsLoading {
  data: ICompany[];
}

export interface IVendors extends IIsLoading {
  data: IVendor[];
}

export interface IAllDeliveredOrders extends IIsLoading {
  data: IOrder[];
}

export interface ICustomerUpcomingOrders extends IIsLoading {
  data: ICustomerOrder[];
}

export interface ICustomerDeliveredOrders extends IIsLoading {
  data: ICustomerOrder[];
}

export interface IUpcomingRestaurants extends IIsLoading {
  data: IUpcomingRestaurant[];
}

export interface ICustomerFavoriteItems extends IIsLoading {
  data: ICustomerFavoriteItem[];
}

export interface ICustomers extends IIsLoading {
  data: ICustomer[];
}

export interface IDiscountCodes extends IIsLoading {
  data: IDiscountCode[];
}

export interface IOrdersGroup {
  orders: IOrder[];
  company: {
    _id: string;
    name: string;
    shift: string;
  };
  customers: string[];
  deliveryDate: string;
  restaurants: string[];
}

export interface IDataContext {
  vendors: IVendors;
  allOrders: IOrder[];
  companies: ICompanies;
  customers: ICustomers;
  upcomingDates: number[];
  discountCodes: IDiscountCodes;
  customerAllOrders: ICustomerOrder[];
  upcomingOrdersGroups: IOrdersGroup[];
  deliveredOrdersGroups: IOrdersGroup[];
  allUpcomingOrders: IAllUpcomingOrders;
  allDeliveredOrders: IAllDeliveredOrders;
  upcomingRestaurants: IUpcomingRestaurants;
  scheduledRestaurants: IScheduledRestaurants;
  customerFavoriteItems: ICustomerFavoriteItems;
  setVendors: Dispatch<SetStateAction<IVendors>>;
  customerUpcomingOrders: ICustomerUpcomingOrders;
  customerDeliveredOrders: ICustomerDeliveredOrders;
  setCompanies: Dispatch<SetStateAction<ICompanies>>;
  setCustomers: Dispatch<SetStateAction<ICustomers>>;
  setDiscountCodes: Dispatch<SetStateAction<IDiscountCodes>>;
  setAllUpcomingOrders: Dispatch<SetStateAction<IAllUpcomingOrders>>;
  setAllDeliveredOrders: Dispatch<SetStateAction<IAllDeliveredOrders>>;
  setCustomerUpcomingOrders: Dispatch<SetStateAction<ICustomerUpcomingOrders>>;
  setCustomerDeliveredOrders: Dispatch<
    SetStateAction<ICustomerDeliveredOrders>
  >;
  setScheduledRestaurants: Dispatch<SetStateAction<IScheduledRestaurants>>;
  setCustomerFavoriteItems: Dispatch<SetStateAction<ICustomerFavoriteItems>>;
}

export interface DateTotal {
  date: number;
  total: number;
}

export interface ICartContext {
  cartItems: ICartItem[];
  isLoading: boolean;
  totalCartPrice: number;
  totalCartQuantity: number;
  upcomingOrderDetails: DateTotal[];
  removeItemFromCart: (item: ICartItem) => void;
  setCartItems: Dispatch<SetStateAction<ICartItem[]>>;
  checkoutCart: (discountCodeId?: string) => Promise<void>;
  addItemToCart: (initialItem: ICartItem, item: IItem) => void;
}

export interface ICartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  shift: string;
  quantity: number;
  companyId: string;
  addonPrice: number;
  restaurantId: string;
  deliveryDate: number;
  optionalAddons: string[];
  requiredAddons: string[];
  removableIngredients: string[];
}

export interface IInitialItem extends ICartItem {}

export interface IOrder {
  _id: string;
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  restaurant: {
    _id: string;
    name: string;
  };
  company: {
    _id: string;
    name: string;
    shift: string;
  };
  delivery: {
    date: string;
    address: string;
  };
  status: string;
  payment?: {
    intent: string;
    amount: number;
  };
  createdAt: string;
  hasReviewed: boolean;
  item: {
    _id: string;
    name: string;
    tags: string;
    image: string;
    description: string;
    quantity: number;
    total: number;
    optionalAddons?: string;
    requiredAddons?: string;
    removedIngredients?: string;
  };
}

export interface ICustomerOrder {
  _id: string;
  item: {
    _id: string;
    name: string;
    total: number;
    image: string;
    quantity: number;
    optionalAddons?: string;
    requiredAddons?: string;
    removedIngredients?: string;
  };
  delivery: {
    date: string;
  };
  company: {
    shift: string;
  };
  restaurant: {
    _id: string;
    name: string;
  };
  status: string;
  createdAt: string;
  hasReviewed: boolean;
}

export interface ICustomerOrderProps {
  orders: ICustomerOrder[];
}

export interface IFiltersData {
  category: string;
  subCategory: string;
}

export interface IOrdersGroupRowProps {
  slug: string;
  ordersGroup: IOrdersGroup;
}

export interface IOrdersGroupsProps {
  slug: string;
  title: string;
  ordersGroups: IOrdersGroup[];
}

export interface ISortedOrdersGroups {
  byCompany: boolean;
  byDeliveryDate: boolean;
}

export interface ISortOrdersGroupsProps {
  ordersGroups: IOrdersGroup[];
  setSorted: Dispatch<SetStateAction<ISortedOrdersGroups>>;
}

export interface IButtons {
  href: string;
  linkText: string;
  buttonText: string;
  initiateStatusUpdate: (e: FormEvent) => void;
}

export interface IActionButton {
  isLoading: boolean;
  buttonText: string;
  handleClick: () => Promise<void>;
}

export interface ISubmitButtonProps {
  text: string;
  isLoading: boolean;
}

export interface ILinkButtonProps {
  href: string;
  target?: string;
  linkText: string;
}

export interface IMobileMenuProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export interface IMobileNavProps extends IMobileMenuProps {}

export type Groups<
  Item extends object,
  Key extends keyof Item,
  ItemsName extends PropertyKey // Property key is a string | number | symbol
> = {
  [key in Key]: Item[Key];
} & { [itemsName in ItemsName]: Item[] };

export interface IFormData {
  [key: string]: string | number; // Index type
}

export interface IOrdersByRestaurant {
  company: {
    name: string;
    shift: string;
  };
  orders: IOrder[];
  deliveryDate: string;
  restaurantName: string;
}

export interface IOrdersGroupDetailsProps {
  isLoading: boolean;
  ordersGroups: IOrdersGroup[];
}

export interface IModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export interface IStaticTags {
  [key: string]: boolean;
}

interface IFormProps {
  isLoading: boolean;
  buttonText: string;
}

export interface ICompanyFormData {
  zip: string;
  name: string;
  city: string;
  code?: string;
  state: string;
  shift?: string;
  website: string;
  shiftBudget: number;
  addressLine1: string;
  addressLine2?: string;
}

export interface ICompanyFormProps extends IFormProps {
  formData: ICompanyFormData;
  showShiftAndCodeField: boolean;
  handleSubmit: (e: FormEvent) => Promise<void>;
  setFormData: Dispatch<SetStateAction<ICompanyFormData>>;
}

export interface IItemFormData {
  name: string;
  image?: string;
  description: string;
  currentTags?: string;
  updatedTags: string[];
  price: string | number;
  file?: File | undefined;
  optionalAddons: {
    addons: string;
    addable: number;
  };
  requiredAddons: {
    addons: string;
    addable: number;
  };
  removableIngredients?: string;
}

export interface IItemFormProps extends IFormProps {
  formData: IItemFormData;
  handleSubmit: (e: FormEvent) => Promise<void>;
  setFormData: Dispatch<SetStateAction<IItemFormData>>;
}

export interface IRestaurantFormData {
  zip: string;
  city: string;
  logo?: string;
  email: string;
  state: string;
  lastName: string;
  firstName: string;
  password?: string;
  addressLine1: string;
  addressLine2?: string;
  restaurantName: string;
  file?: File | undefined;
  confirmPassword?: string;
}

export interface IRestaurantFormProps extends IFormProps {
  showPasswordFields: boolean;
  formData: IRestaurantFormData;
  handleSubmit: (e: FormEvent) => Promise<void>;
  setFormData: Dispatch<SetStateAction<IRestaurantFormData>>;
}

export interface IModalContainerProps {
  width?: string;
  component: JSX.Element;
  showModalContainer: boolean;
  setShowModalContainer: Dispatch<SetStateAction<boolean>>;
}

export interface ICustomersProps {
  status?: string;
  customers: ICustomer[];
}

export interface IActionModalProps {
  name: string;
  action: string;
  isPerformingAction: boolean;
  performAction: () => Promise<void>;
  setShowActionModal: Dispatch<SetStateAction<boolean>>;
}

export interface IDeliverOrdersPayload {
  orders: IOrder[];
  restaurantName: string;
}

export interface ICustomerOrdersProps {
  orders: IOrder[];
  orderStatus: string;
}

interface ICustomerWithCompany extends Omit<ICustomer, 'companies'> {
  company: ICompany;
}

export interface ICustomerWithOrders {
  upcomingOrders: IOrder[];
  deliveredOrders: IOrder[];
  data: ICustomerWithCompany | null;
}

export interface IAddons {
  [key: string]: boolean;
}

export interface IRemovableIngredients extends IAddons {}

export type IAddonsOrRemovableIngredientsType =
  | 'requiredAddons'
  | 'optionalAddons'
  | 'removableIngredients';

export type SetAddonsOrRemovableIngredients = Dispatch<
  SetStateAction<IAddons | IRemovableIngredients | undefined>
>;

export interface IAlert {
  type: string;
  message: string;
}

export interface IAlertProps {
  alerts: IAlert[];
}

export interface IAlertContext {
  setAlerts: Dispatch<SetStateAction<IAlert[]>>;
}

export type CustomAxiosError = AxiosError<{
  message: string;
}>;

export interface IScheduledRestaurantProps {
  isLoading: boolean;
  restaurants: IScheduledRestaurant[];
}

export interface IShiftChangeModalProps {
  setShowShiftChangeModal: Dispatch<SetStateAction<boolean>>;
}

export interface IFilterRestaurantsProps {
  shifts: string[];
  setRestaurants: Dispatch<SetStateAction<IUpcomingRestaurant[]>>;
}

export interface ICalendarFiltersProps {
  restaurants: IUpcomingRestaurant[];
  setShowCalendarFilters: Dispatch<SetStateAction<boolean>>;
  setUpdatedRestaurants: Dispatch<SetStateAction<IUpcomingRestaurant[]>>;
}

export interface ICalendarSortProps {
  updatedRestaurants: IUpcomingRestaurant[];
  setSorted: Dispatch<
    SetStateAction<{ byLowToHigh: boolean; byHighToLow: boolean }>
  >;
}

export interface IOrderData {
  tags: string;
  price: string;
  shift: string;
  itemName: string;
  quantity: number;
  companyName: string;
  lastName: string;
  customerEmail: string;
  description: string;
  firstName: string;
  deliveryDate: string;
  restaurantName: string;
  optionalAddons?: string;
  requiredAddons?: string;
  removedIngredients?: string;
}

interface IReorderAbleItemsProps {
  vendor: IVendor;
  setVendor: Dispatch<SetStateAction<IVendor | undefined>>;
}

export interface OrderStat {
  restaurant: {
    name: string;
  };
  quantity: number;
}

export interface ItemStat {
  restaurant: {
    name: string;
  };
  item: {
    name: string;
    quantity: number;
  };
}

export interface PeopleStat {
  date: string;
  customers: string[];
}
