import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function MultistepForm({ formName, formFields, response, handleAdd, requirement, defaults, navlink }) {

  // const { vendor, response, fetchVendor } = useFetchVendor();
  const [resp, setResp] = useState('');
  const navigate = useNavigate();
  // const location = useLocation();

  const [page, setPage] = useState(1);
  // console.log("requirement: ", requirement)

  // useEffect(() => {
  //   if (defaults !== undefined) {
  //     const enrichedFormFields = formFields.map(step =>
  //       step.map(field => ({
  //         ...field,
  //         defaultValue: field.type === 'checkbox'
  //           ? Boolean(defaults?.[field.name])
  //           : (defaults?.[field.name] ?? '')
  //       }))
  //     );
  //     const initialData = enrichedFormFields.flat().reduce((acc, field) => {
  //       acc[field.name] = field.defaultValue;
  //       return acc;
  //     }, {});

  //     setFormData(initialData);
  //   }
  // }, [defaults]

  // )
  // const [formData, setFormData] = useState(
  //   enrichedFormFields.flat().reduce((acc, field) => {
  //     return {
  //       ...acc,
  //       [field.name]: field.defaultValue
  //     };
  //   }, {})
  // );

  // Flatten the formFields for easier processing
  const flatFields = formFields.flat();

  const initializeFormData = (fields, defaults) => {
    return fields.reduce((acc, field) => {
      acc[field.name] = defaults?.[field.name] !== undefined
        ? (field.type === 'checkbox' ? Boolean(defaults[field.name]) : defaults[field.name])
        : (field.type === 'checkbox' ? false : '');
      return acc;
    }, {});
  };

  const [formData, setFormData] = useState(() => initializeFormData(flatFields, defaults));

  // Update form data if defaults change after initial render
  useEffect(() => {
    if (defaults) {
      setFormData(initializeFormData(flatFields, defaults));
    }
  }, [defaults]);

  // const [formData, setFormData] = useState(

  //   formFields.flat().reduce((acc, field) => {
  //     console.log('defaults:', defaults); // Log the defaults object to debug
  //     console.log('formFields:', formFields); 
  //     const defaultValue = defaults?.[field.name];
  //     console.log("default value: ",defaultValue)
  //     return{ 
  //       ...acc, [field.name]: defaultValue !== undefined ? defaultValue : (field.type === 'checkbox' ? false : '')
  //     }}, {})
  // );

  const handleChangeForm = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await handleAdd(formData);
      navigate('/VAPS/vendors/add/success')
    } catch (error) {
      setResp(error.response?.data?.message || "something went wrong while adding new Vendor")
      console.log("error response from the api", resp)
      navigate('/VAPS/vendors/add/failed')
    }
  }

  async function handleBack() {
    navigate(navlink)
  }

  console.log("the form data now: ", formData)

  return (
    <>
      <div className="container mt-5">
        <h2 className="text-center">{formName}</h2>

        <div className="row justify-content-center">
          <div className="col-md-6">
            {/* <!-- Multi-Step Form --> */}
            <form id="multiStepForm" onSubmit={handleSubmit}>

              {formFields.map((step, index) => {
                // console.log(" we are inside form fields map index & page: ", index, page)
                if (page === index + 1) {


                  return (<>
                    <div className="form-step active" key={index}>
                      {step.map((field) => (
                        <div className="mb-3" key={field.name}>
                          <label className="form-label" htmlFor={field.name}>{field.label}</label>
                          <input
                            id={field.name}
                            type={field.type}
                            name={field.name}
                            className="form-control"
                            // defaultValue={defaults?.[field.name]}
                            value={field.type !== 'checkbox' ? formData[field.name] : ''}
                            checked={field.type === 'checkbox' ? formData[field.name] : undefined}
                            onChange={handleChangeForm}
                            required={requirement}
                          />
                        </div>
                      ))}
                      {page == 1 && (
                        (
                          <button type="button" className="btn btn-secondary" onClick={handleBack}>
                            Prev
                          </button>
                        )
                      )}

                      {page != 1 && formFields.length > 1 &&
                        (
                          <button type="button" className="btn btn-secondary" onClick={() => setPage(page - 1)}>
                            Prev
                          </button>
                        )
                      }
                      {page < formFields.length &&
                        (
                          <>
                            <button type="" className="btn btn-primary" onClick={() => setPage(page + 1)}>Next</button>
                          </>
                        )
                      }
                      {page === formFields.length && (
                        <>
                          <button type="submit" className="btn btn-success">submit</button>

                        </>
                      )
                      }

                    </div >
                  </>
                  )
                }
              }
              )}

            </form>
          </div>
        </div>
        {response && <p>{response}</p>}

      </div>

    </>
  )
}

