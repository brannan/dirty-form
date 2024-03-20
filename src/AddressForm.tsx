import { useFormik } from "formik"
import * as Yup from "yup"
import { useEffect, useRef } from "react"

const localStorageKey = "demoFormDataKey"

interface FormValues {
  firstName: string
  lastName: string
  address: string
  email: string
  savedTimestamp?: number // Javascript timestamp of last save to local storage
}

// Custom hook to save form data to local storage
const useAutoSave = (values: FormValues, dirty: boolean) => {
  useEffect(() => {
    const saveFormData = (formData: FormValues) => {
      console.log("Saving: ", values)
      localStorage.setItem(localStorageKey, JSON.stringify(formData))
    }
    if (dirty) {
      saveFormData(values)
    }
  }, [values, dirty])
}

// TODO: Simulate loading this from the server
const initialValues: FormValues = {
  firstName: "Patrick",
  lastName: "Brannan",
  address: "100 Main St.",
  email: "brannanster@gmail.com",
}

const AddressForm = () => {
  const savedData = JSON.parse(localStorage.getItem(localStorageKey) || 'null')
  let firstRun = useRef(true) // StrictMode runs everything twice, so we need to ignore the first run

  useEffect(() => {
    if (savedData && firstRun.current) {
      firstRun.current = false
      if (!window.confirm("Load saved form data?")) {
        console.log("Deleting saved form data: ")
        formik.resetForm({values: initialValues})
        localStorage.removeItem(localStorageKey)
      } else {
        console.log("Loading saved form data: ", savedData)
        formik.setValues(savedData)
      }
    }
  }, [])

  const formik = useFormik<FormValues>({
    initialValues: savedData || initialValues,
    validationSchema: Yup.object({
      lastName: Yup.string().required("Required"),
      firstName: Yup.string(),
      address: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        console.log("Submitting: ", JSON.stringify(values, null, 2))
        alert(JSON.stringify(values, null, 2))
        setSubmitting(false)
      }, 400)
    },
  })

  useAutoSave(formik.values, formik.dirty)

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2>Test Form</h2>
      <FormikField
        formik={formik}
        name="firstName"
        placeholder="First Name"
        type="text"
      />
      <FormikField
        formik={formik}
        name="lastName"
        placeholder="Last Name"
        type="text"
      />
      <FormikField
        formik={formik}
        name="address"
        placeholder="Address"
        type="text"
      />
      <FormikField
        formik={formik}
        name="email"
        placeholder="Email"
        type="email"
      />

      <fieldset>
        <button
          type="submit"
          disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
        >
          Submit
        </button>
      </fieldset>
    </form>
  )
}

export default AddressForm

interface FormikFieldProps {
  formik: any
  name: string
  type?: string
  placeholder?: string
}

const FormikField: React.FC<FormikFieldProps> = ({
  formik,
  name,
  type = "text",
  placeholder,
}) => {
  const { values, handleChange, handleBlur, touched, errors } = formik

  return (
    <fieldset>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values[name]}
      />
      {touched[name] && errors[name] ? (
        <span className="error">{errors[name] as string}</span>
      ) : null}
    </fieldset>
  )
}
