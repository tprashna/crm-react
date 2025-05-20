import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate, useSearchParams, Link, useLocation } from "react-router-dom";
import { LightTable } from "./Table";
import { Forms } from "./Forms";
import { MultistepForm } from "./MultistepForm";
import { ButtonPrevNext } from "./ButtonPrevNext";

function useFetchService() {
    const [Service, setService] = useState([]);
    const [response, setResponse] = useState('');

    async function fetchService() {
        try {
            const res = await api.get('api/Service');
            setService(res.data.data);
            console.log(res.data.data)
        } catch (error) {
            setResponse(error.response?.data?.message || 'Something went wrong');
        }
    }

    useEffect(() => {
        fetchService();
    }, []);

    return { Service, response, fetchService };
}



export function Service({ action }) {

    console.log("we are in the Services page");
    const { Service, response, fetchService } = useFetchService();
    const [resp, setResp] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const serviceEditId = location.state?.serviceEditId;
    const vapsId = location.state?.vapsId;
    const serviceName = location.state?.serviceName;
    console.log("service name and id : ", serviceName, serviceEditId);
    const [serviceDetails, setserviceDetails] = useState()
    const formFields = [[
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'description', label: 'Description', type: 'text' }
    ], [
        { name: 'category', label: 'Category', type: 'text' },
        { name: 'description2', label: 'Brand', type: 'text' },
        // { name: 'purchaseDate', label: 'Purchase Date', type: 'datetime-local' },
        { name: 'providerName', label: 'Provider Name', type: 'text' },
        { name: 'rate', label: 'Rate', type: 'number' },
        { name: 'unitOfMeasureId', label: 'unit Of Measurement', type: 'number' },
        { name: 'estimatedQuantity', label: 'Estimated Quantity', type: 'number' },
        { name: 'isRecurring', label: 'Recurring', type: 'checkbox' },
        { name: 'termsAndConditions', label: 'Terms And Conditions', type: 'text' }
    ]];

    const updateFormFields = [formFields[1]];

    const th = ['s.no', 'category', 'description', 'provider', 'rate', 'unit', 'estimate Quantity', 'Recurring', 'T&C', 'Action']

    const thead = (
        <tr>
            {th.map((t) => (
                <td scope="col" className="border-botton=0">{t}</td>
            ))}
        </tr>
    )

    useEffect(() => {
        if (Service.length === 0) {
            // console.log("zero Services");
            setResp("No Services to show");
        }
        if (action === 'update' && serviceEditId) {
            console.log("action update service");
            OnUpdate();
        }
    }, [Service, action]);

    const tbody = Service.length === 0 ? (
        <>
            {/* {console.log("inside if no Services available")} */}
            <tr>
                <td colSpan={th.length + 1}>No Services available</td>
            </tr>
        </>
    ) : (
        Service.map((a, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{a.category}</td>
                <td>{a.description}</td>
                <td>{a.providerName}</td>
                <td>{a.rate}</td>
                <td>{a.unitOfMeasureId}</td>
                <td>{a.estimatedQuantity}</td>
                <td>{(a.isRecurring) ? 'YES' : 'NO'}</td>
                <td>{a.termsAndConditions}</td>
                <td>
                    <div>
                        <Link to='/VAPS/Services/update' state={{ serviceEditId: a.id, vapsId: a.vapsId, serviceName: a.description }} className="nav-link">
                            {console.log("id of this service is ", a.id)}
                            <i className="material-icons">edit</i>
                            <span>edit</span>
                        </Link>
                        <Link to='/VAPS/Services/delete' state={{ serviceEditId: a.id, vapsId: a.vapsId, serviceName: a.description }} className="nav-link">
                            <i className="material-icons">delete</i>
                            <span>delete</span>
                        </Link>
                    </div>
                </td>
            </tr>
        )))


    async function handleAdd(formData) {
        console.log("data we're sending into the api/VAPS endpoint", formData);
        console.log("the form data for checkbox is recurring: ", formData.isRecurring)
        try {
            const res1 = await api.post('/api/VAPS', {
                name: formData.name,
                type: 4,
                isActive: true,
                description: formData.description,
            },
                {
                    withCredentials: true
                })
            console.log("data returned from api vaps add    ", res1.data, " that's it")
            const id = res1.data.data.id;
            console.log("the id we received from the api", res1.data.data.id);
            console.log("the id we received from the api", id);

            const res2 = await api.post('/api/Service', {
                vapsId: id,
                category: formData.category,
                description: formData.description2,
                providerName: formData.providerName,
                rate: Number(formData.rate),
                unitOfMeasureId: Number(formData.unitOfMeasureId),
                estimatedQuantity: Number(formData.estimatedQuantity),
                isRecurring: formData.isRecurring,
                termsAndConditions: formData.termsAndConditions,
            }, {
                withCredentials: true
            });
            console.log("api endpoint for adding Services returns: ", res2.data.data)
            navigate('/VAPS/Services/add/status')
        } catch (error) {
            const errormessage = (error.response?.data?.message || "something went wrong while adding new Service")
            setResp(errormessage)
            console.log("error response from the api", errormessage)
            navigate('/VAPS/Services/add/status')
        }
    }

    async function OnUpdate() {
        try {
            const res = await api.get(`/api/service/${serviceEditId}`, {
                withCredentials: true,
            })
            // setserviceDetails(res.data.data)
            let data = res.data.data;
            console.log("we are in the onupdate function. value of data ", data)
            data = {
                ...data,
                description2: data.description,
            };
            delete data.description;
            console.log("we are in the onupdate function. value of data after deletion ", data)
            setserviceDetails(data);
            console.log("data returned from get by id endpoint", res.data.data);
            // console.log("data after update", data);
        } catch (error) {
            setResp(error.response?.data?.message || 'Something went wrong');
        }
    }
    async function handleUpdate(formData) {
        console.log("data we're sending into the api/VAPS endpoint", formData);
        console.log("the form data for checkbox is recurring: ", formData.isRecurring)
        try {

            const res2 = await api.put(`/api/Service/${serviceEditId}`, {
                vapsId: vapsId,
                category: formData.category,
                description: formData.description2,
                providerName: formData.providerName,
                rate: Number(formData.rate),
                unitOfMeasureId: Number(formData.unitOfMeasureId),
                estimatedQuantity: Number(formData.estimatedQuantity),
                isRecurring: formData.isRecurring,
                termsAndConditions: formData.termsAndConditions,
            }, {
                withCredentials: true
            });
            console.log("api endpoint for adding Services returns: ", res2.data.data)
            navigate('/VAPS/Services/add/status')
        } catch (error) {
            const errormessage = (error.response?.data?.message || "something went wrong while adding new Service")
            setResp(errormessage)
            console.log("error response from the api", errormessage)
            navigate('/VAPS/Services/add/status')
        }
    }

    async function handleDelete(serviceEditID) {
        setResp('');
        console.log("service to be deleted:  and type of serviceid", serviceEditID, serviceName, typeof(serviceEditID));
        try {
            const res = await api.delete(`/api/service/${serviceEditID}`, {
                // params: {id: Number(serviceEditID)},
                withCredentials: true,
            });
            console.log("service deleted", res.data.data);
            fetchService();
            // setRefresh( prev => !prev)
            navigate('/VAPS/services')

        } catch (error) {
            console.log("error message ", error)
            setResp(error.response?.data?.message || 'Something went wrong while deleting role');
        }

    }
    const deleteform = (
        <div>
            <button type="submit" onClick={() => {
                // e.preventDefault();
                handleDelete(serviceEditId);
            }}
                className="btn btn-primary btn-block">Yes</button>
            <br />
            <Link to='/VAPS/services'>
                <button className="btn btn-primary btn-block">No</button>
            </Link>
        </div>
    )

    let navlink = '/VAPS/services';

    if (action == "add") {
        return (
            <>
                <MultistepForm formName={'Add New Service'} formFields={formFields} response={response} handleAdd={handleAdd} navlink={navlink}/>
            </>
        )
    } else if (action == 'delete') {
        return (
            <>
                <p>inside handle delete</p>
                <Forms Formname={`Are you sure you want to delete service"${serviceName}" ?`} form={deleteform} response={resp} />
            </>
        )
    }
    else if (action == "update") {
        return (
            <>
                <MultistepForm formName={'Update Service'} formFields={updateFormFields} response={response} handleAdd={handleUpdate} defaults={serviceDetails} navlink={navlink}/>
            </>
        )
    }
    else {
        return (
            <div>
                <LightTable tablename={"Service"} thead={thead} tbody={tbody} link={'/VAPS/Services/add'} />
                {response && <p>{response}</p>}
            </div>
        )
    }
}