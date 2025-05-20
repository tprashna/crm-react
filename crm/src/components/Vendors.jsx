import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate, useSearchParams, Link, useLocation } from "react-router-dom";
import { LightTable } from "./Table";
import { Forms } from "./Forms";
import { MultistepForm } from "./MultistepForm";
import { ButtonPrevNext } from "./ButtonPrevNext";

function useFetchVendor() {
    const [vendor, setvendor] = useState([]);
    const [response, setResponse] = useState('');

    async function fetchVendor() {
        try {
            const res = await api.get('api/Vendor');
            setvendor(res.data.data);
            console.log(res.data.data)
        } catch (error) {
            setResponse(error.response?.data?.message || 'Something went wrong');
        }
    }

    useEffect(() => {
        fetchVendor();
    }, []);

    return { vendor, response, fetchVendor };
}

export function RegisteredConfirm({status, response}) {

    if (status === true) {
        return (
            <div>
                <p>Successfully added</p>
                <Link to={'/VAPS/vendors'}>Done</Link>
            </div>
        )
    }
    else {
        return (
            <div>
                <p>couldn't be added</p>
                <p>{response}</p>
                <Link to={'/VAPS/vendors'}>Done</Link>
            </div>
        )
    }
}

export function Vendor({ action }) {
    
    const { vendor, response, fetchVendor } = useFetchVendor();
    const [resp, setResp] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const vendorEditID = location.state?.vendorID;
    const vapsId = location.state?.vapsId;
    const vendorName = location.state?.vendor;
    console.log("vendor name and id : ", vendorName, vendorEditID);
    const [vendorDetails, setvendorDetails] = useState()
    // console.log("venndor details and fetch resp: ", vendorDetails, fetchResp);

    // const [page, setPage] = useState(1);

    const formFields = [[
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'description', label: 'Description', type: 'text' }
    ], [
        { name: 'companyName', label: 'Company Name', type: 'text' },
        { name: 'contactPerson', label: 'Contact Person', type: 'text' },
        { name: 'address', label: 'Address', type: 'text' },
        { name: 'phoneNumber', label: 'Phone Number', type: 'tel' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'panNumber', label: 'PAN Number', type: 'text' },
        { name: 'vatNumber', label: 'VAT Number', type: 'text' },
        { name: 'website', label: 'Website', type: 'url' },
        { name: 'bankName', label: 'Bank Name', type: 'text' },
        { name: 'bankAccountNumber', label: 'Bank Account Number', type: 'text' },
    ]];
    
    const updateFormFields = [formFields[1]];
    // console.log("add form fields :", formFields);
    // console.log("update form fields: ", updateFormFields);

    const th = ['s.no', 'Company', 'Phone', 'ContactPerson', 'Email', 'Website', 'Address', 'PAN', 'VAT', 'Bank', 'AccountNo', 'Action']

    // console.log("is the vendor array? ", Array.isArray(vendor));
    const thead = (
        <tr>
            {th.map((t) => (
                <td scope="col" className="border-botton=0">{t}</td>
            ))}
        </tr>
    )


    useEffect(() => {
        if (vendor.length === 0) {
            // console.log("zero vendors");
            setResp("No vendors to show");
        }
        if (action === "update" && vendorEditID) {
            console.log("the action is update and the vendoredit ID is ", vendorEditID)
            OnUpdateNav();
        }
    }, [vendor, action]);

    const tbody = vendor.length === 0 ? (
        <>
            {/* {console.log("inside if no vendors available")} */}
            <tr>
                <td colSpan={th.length + 1}>No vendors availabe</td>
            </tr>
        </>
    ) : (
        vendor.map((v, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{v.companyName}</td>
                <td>{v.phoneNumber}</td>
                <td>{v.contactPerson}</td>
                <td>{v.email}</td>
                <td>{v.website}</td>
                <td>{v.address}</td>
                <td>{v.panNumber}</td>
                <td>{v.vatNumber}</td>
                <td>{v.bankName}</td>
                <td>{v.bankAccountNumber}</td>
                <td>
                    <div>
                        <Link  to='/VAPS/vendors/update' state={{ vendor: v.companyName , vendorID: v.id, vapsId: v.vapsId}} className="nav-link">
                            <i className="material-icons">edit</i>
                            <span>edit</span>
                            </Link>
                        <Link to='/VAPS/vendors/delete' state={{ vendor: v.companyName , vendorID: v.id, vapsId: v.vapsId}} className="nav-link">
                            <i className="material-icons">delete</i>
                            <span>delete</span>
                        </Link>
                    </div>
                </td>
            </tr>
        )))


    async function handleAdd(formData) {
        console.log("data we're sending into the api/VAPS endpoint", formData)
        try {
            const res1 = await api.post('/api/VAPS', {
                name: formData.name,
                type: 1,
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

            const res2 = await api.post('/api/Vendor', {
                vapsId: id,
                companyName: formData.companyName,
                contactPerson: formData.contactPerson,
                address: formData.address,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                panNumber: formData.panNumber,
                vatNumber: formData.vatNumber,
                website: formData.website,
                bankName: formData.bankName,
                bankAccountNumber: formData.bankAccountNumber
            },
                {
                    withCredentials: true
                }
            )
            console.log("api endpoint for adding vendor returns: ", res2.data.data)
            // navigate('/VAPS/vendors/add/status')
            navigate('/VAPS/vendors/add/success')
        } catch (error) {
            setResp(error.response?.data?.message || "something went wrong while adding new Vendor")
            console.log("error response from the api", resp)
            // navigate('/VAPS/vendors/add/status')
            navigate('/VAPS/vendors/add/failed')
        }
    }


    async function handleDelete(vendorEditID) {
        setResp('');
        console.log("vendor to be deleted:  and type of vendorid", vendorEditID, vendorName, typeof(vendorEditID));
        try {
            const res = await api.delete(`/api/Vendor/${vendorEditID}`, {
                // params: {id: Number(vendorEditID)},
                withCredentials: true,
            });
            console.log("role deleted", res.data.data);
            fetchVendor();
            // setRefresh( prev => !prev)
            navigate('/VAPS/vendors')

        } catch (error) {
            console.log("error message ", error)
            setResp(error.response?.data?.message || 'Something went wrong while deleting role');
        }

    }

    async function OnUpdateNav() {
        try {
            const res = await api.get(`api/Vendor/${vendorEditID}`);
            setvendorDetails(res.data.data);
            console.log("data returned from the api end point get by id",res.data.data);
            // navigate('/VAPS/vendors/update');
        } catch (error) {
            setResp(error.response?.data?.message || 'Something went wrong');
        }
    }

    async function handleUpdate(formData) {
        console.log("data we're sending into the api/VAPS update endpoint", formData)
        console.log(" vendor to delete details: id, vapsid ", vendorEditID, vapsId);
        try {
            const res = await api.put(`/api/Vendor/${vendorEditID}`, {
                vapsId: vapsId,
                companyName: formData.companyName,
                contactPerson: formData.contactPerson,
                address: formData.address,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                panNumber: formData.panNumber,
                vatNumber: formData.vatNumber,
                website: formData.website,
                bankName: formData.bankName,
                bankAccountNumber: formData.bankAccountNumber
            },
                {
                    withCredentials: true
                }
            )
            console.log("api endpoint for updaing vendor returns: ", res.data)
            navigate('/VAPS/vendors')
        } catch (error) {
            setResp(error.response?.data?.message || "something went wrong while adding new Vendor")
            console.log("error response from the api", resp)
            navigate('/VAPS/vendors')
        }
    }
   
    const deleteform = (
        <div>
            {/* <div  className="form-group">
            <p className="text-center">Delete role <strong>{roleToEdit}</strong></p>
            </div> */}
            <button type="submit" onClick={() => {
                // e.preventDefault();
                handleDelete(vendorEditID)
            }}
                className="btn btn-primary btn-block">Yes</button>
            <br />
            <Link to='/VAPS/vendors'>
                <button className="btn btn-primary btn-block">No</button>
            </Link>
        </div>
    )

    let navlink = '/VAPS/vendors';


    if (action == "add") {
        return (
            <>
                <MultistepForm formName={'Add New Vendor'} formFields={formFields} response={response} handleAdd={handleAdd} requirement={true} navlink={navlink}/>
            </>
        )
    }
    else if (action == 'delete') {
        return (
            <>
            <p>inside handle delete</p>
            <Forms Formname={`Are you sure you want to delete Vendor"${vendorName}" ?`} form={deleteform} response={resp} />
            </>
        )
    }
    else if(action=="update"){
        // console.log("vendor details now," , vendorDetails)

        return(
            <>
                <MultistepForm formFields={updateFormFields} response={response} handleAdd={handleUpdate} defaults={vendorDetails} navlink={navlink}/>
            </>
        )
    }
    else {
        return (
            <div>
                <LightTable tablename={"vendor"} thead={thead} tbody={tbody} link={'/VAPS/vendors/add'} />
                {response && <p>{response}</p>}
            </div>
        )
    }
}
