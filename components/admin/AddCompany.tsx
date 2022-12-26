import { useRouter } from "next/router";
import { useData } from "@context/Data";
import { ICompany, IFormData } from "types";
import { axiosInstance } from "@utils/index";
import { ChangeEvent, FormEvent, useState } from "react";
import styles from "@styles/admin/AddCompany.module.css";
import SubmitButton from "@components/layout/SubmitButton";
import CompanyForm from "./CompanyForm";

export default function AddCompany() {
  // Initial state
  const initialState = {
    name: "",
    code: "",
    city: "",
    state: "",
    zip: "",
    website: "",
    dailyBudget: 0,
    addressLine1: "",
    addressLine2: "",
  };

  // Hooks
  const router = useRouter();
  const { setCompanies } = useData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IFormData>(initialState);

  // Handle submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Create a company
    try {
      // Show loader
      setIsLoading(true);

      // Make request to backend
      const response = await axiosInstance.post(`/companies/add`, formData);

      // Update state
      setCompanies((currState) => ({
        ...currState,
        data: [...currState.data, response.data],
      }));

      // Clear the form
      setFormData(initialState);

      // Push to dashboard
      router.push("/admin/companies");
    } catch (err) {
      console.log(err);
    } finally {
      // Remove loader
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.add_company}>
      <h2>Add a company</h2>

      <CompanyForm
        isLoading={isLoading}
        formData={formData}
        setFormData={setFormData}
        buttonText="Add company"
        handleSubmit={handleSubmit}
      />
    </section>
  );
}
