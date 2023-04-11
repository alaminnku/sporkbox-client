import { ChangeEvent } from "react";
import { ICompanyFormProps } from "types";
import styles from "@styles/admin/CompanyForm.module.css";
import SubmitButton from "@components/layout/SubmitButton";

export default function CompanyForm({
  isLoading,
  formData,
  setFormData,
  buttonText,
  handleSubmit,
  showShiftAndCodeField,
}: ICompanyFormProps) {
  // Destructure form data
  const {
    name,
    code,
    city,
    state,
    zip,
    shift,
    website,
    shiftBudget,
    addressLine1,
    addressLine2,
  } = formData;

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    // Id and value
    const id = e.target.id;
    const value = e.target.value;

    // Update state
    setFormData((currState) => ({
      ...currState,
      [id]: id === "shiftBudget" ? +value : value,
    }));
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.item}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" value={name} onChange={handleChange} />
      </div>

      {showShiftAndCodeField && (
        <div className={styles.item}>
          <select id="shift" value={shift} onChange={handleChange}>
            <option hidden value="Please select a shift">
              Please select a shift
            </option>
            <option value="day">Day</option>
            <option value="night">Night</option>
          </select>
        </div>
      )}

      <div className={styles.item}>
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          value={website}
          onChange={handleChange}
        />
      </div>

      <div className={styles.item}>
        <label htmlFor="addressLine1">Address line 1</label>
        <input
          type="text"
          id="addressLine1"
          value={addressLine1}
          onChange={handleChange}
        />
      </div>

      <div className={styles.item}>
        <label htmlFor="addressLine2">Address line 2</label>
        <input
          type="text"
          id="addressLine2"
          value={addressLine2}
          onChange={handleChange}
        />
      </div>

      <div className={styles.city_state_zip}>
        <div className={styles.item}>
          <label htmlFor="city">City</label>
          <input type="text" id="city" value={city} onChange={handleChange} />
        </div>

        <div className={styles.item}>
          <label htmlFor="state">State</label>
          <input type="text" id="state" value={state} onChange={handleChange} />
        </div>

        <div className={styles.item}>
          <label htmlFor="zip">Zip</label>
          <input type="text" id="zip" value={zip} onChange={handleChange} />
        </div>
      </div>

      {showShiftAndCodeField && (
        <div className={styles.item}>
          <label htmlFor="code">Code</label>
          <input type="text" id="code" value={code} onChange={handleChange} />
        </div>
      )}

      <div className={styles.item}>
        <label htmlFor="shiftBudget">Daily budget</label>
        <input
          type="number"
          id="shiftBudget"
          value={shiftBudget}
          onChange={handleChange}
        />
      </div>

      <SubmitButton text={buttonText} isLoading={isLoading} />
    </form>
  );
}
