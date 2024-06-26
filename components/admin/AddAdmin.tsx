import { useAlert } from '@context/Alert';
import { CustomAxiosError, FormData } from 'types';
import styles from './AddAdmin.module.css';
import { ChangeEvent, FormEvent, useState } from 'react';
import SubmitButton from '@components/layout/SubmitButton';
import { axiosInstance, showErrorAlert, showSuccessAlert } from '@lib/utils';

export default function AddAdmin() {
  // Initial state
  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  // Hooks
  const { setAlerts } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialState);

  // Destructure form data
  const { firstName, lastName, email, password, confirmPassword } = formData;

  // Check passwords match
  const passwordsMatch = password === confirmPassword;

  // Handle change
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    // Update state
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  // Handle form submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      // Show loader
      setIsLoading(true);

      // Make request to the backend
      await axiosInstance.post('/admins/add-admin', formData);

      // Reset the form
      setFormData(initialState);

      // Show success alert
      showSuccessAlert('Admin added', setAlerts);
    } catch (err) {
      // Log error
      console.log(err);

      // Show error alert
      showErrorAlert(err as CustomAxiosError, setAlerts);
    } finally {
      // Remove the loader
      setIsLoading(false);
    }
  }
  return (
    <section className={styles.add_admin}>
      <h2>Add an admin</h2>

      <form onSubmit={handleSubmit}>
        <div className={styles.item}>
          <label htmlFor='firstName'>First name</label>
          <input
            type='text'
            id='firstName'
            value={firstName}
            onChange={handleChange}
          />
        </div>

        <div className={styles.item}>
          <label htmlFor='lastName'>Last name</label>
          <input
            type='text'
            id='lastName'
            value={lastName}
            onChange={handleChange}
          />
        </div>

        <div className={styles.item}>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={handleChange}
          />
        </div>

        <div className={styles.item}>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={handleChange}
          />
        </div>

        <div className={styles.item}>
          <label htmlFor='confirmPassword'>
            Confirm password {!passwordsMatch && " - Passwords don't match"}
          </label>
          <input
            type='password'
            id='confirmPassword'
            value={confirmPassword}
            onChange={handleChange}
          />
        </div>

        <SubmitButton isLoading={isLoading} text='Add admin' />
      </form>
    </section>
  );
}
