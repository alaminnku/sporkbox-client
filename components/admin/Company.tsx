import { ICompany } from "types";
import { useData } from "@context/Data";
import { useRouter } from "next/router";
import { axiosInstance } from "@utils/index";
import Buttons from "@components/layout/Buttons";
import { FormEvent, useEffect, useState } from "react";
import styles from "@styles/admin/Company.module.css";

export default function Company() {
  // Hooks
  const router = useRouter();
  const { companies, setCompanies } = useData();
  const [company, setCompany] = useState<ICompany>();

  // Get the company
  useEffect(() => {
    if (companies.length > 0 && router.isReady) {
      setCompany(
        companies.find((company) => company._id === router.query.company)
      );
    }
  }, [companies, router.isReady]);

  // Delete company
  async function handleDelete(e: FormEvent) {
    e.preventDefault();

    try {
      // Make delete request to backend
      await axiosInstance.delete(`/companies/${company?._id}`);

      // Update state
      setCompanies((currCompanies: ICompany[]) =>
        currCompanies.filter((currCompany) => currCompany._id !== company?._id)
      );

      // Back to companies page
      router.back();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <section className={styles.company}>
      {!company && <h2>No company found</h2>}

      {company && (
        <>
          <div className={styles.details}>
            <h2 className={styles.company_name}>{company.name}</h2>
            <p>
              <span>Code:</span> {company.code}
            </p>
            <p>
              <span>Weekly budget:</span> USD ${company.budget}
            </p>
            <p>
              <span>Address:</span> {company.address}
            </p>
          </div>

          {/* Buttons */}
          <Buttons
            handleClick={handleDelete}
            linkText="Edit details"
            buttonText="Delete"
            href={`/admin/companies/${router.query.company}/edit-details`}
          />
        </>
      )}
    </section>
  );
}
