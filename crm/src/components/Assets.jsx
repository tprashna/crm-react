import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate, useSearchParams, Link, useLocation } from "react-router-dom";
import { LightTable } from "./Table";
import { Forms } from "./Forms";
import { MultistepForm } from "./MultistepForm";
import { ButtonPrevNext } from "./ButtonPrevNext";

function useFetchAsset() {
    const [asset, setAsset] = useState([]);
    const [response, setResponse] = useState('');

    async function fetchAsset() {
        try {
            const res = await api.get('api/Asset');
            setAsset(res.data.data);
            console.log(res.data.data)
        } catch (error) {
            setResponse(error.response?.data?.message || 'Something went wrong');
        }
    }

    useEffect(() => {
        fetchAsset();
    }, []);

    return { asset, response, fetchAsset };
}



export function Asset({ action }) {

    console.log("we are in the assets page");
    const { asset, response, fetchAsset } = useFetchAsset();
    const [resp, setResp] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const assetEditId = location.state?.assetEditId;
    const assetName = location.state?.assetName;
    const vapsId = location.state?.vapsId;
    console.log("asset and vaps id received as state ", assetEditId, vapsId);
    const [assetDetails, setAssetDetails] = useState();

    const formFields = [[
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'description', label: 'Description', type: 'text' }
    ], [
        { name: 'manufacturer', label: 'Manufacturer', type: 'text' },
        { name: 'model', label: 'Model', type: 'text' },
        { name: 'purchaseDate', label: 'Purchase Date', type: 'datetime-local' },
        { name: 'location', label: 'Location', type: 'text' },
        { name: 'condition', label: 'Condition', type: 'text' },
        { name: 'isUnderWarranty', label: 'Under Warranty', type: 'checkbox' },
        { name: 'assignedTo', label: 'Assigned To', type: 'text' },
        { name: 'warrantyExpiryDate', label: 'Warranty Expiry Date', type: 'datetime-local' }
    ]];

    const updateFormFields = [formFields[1]];

    const th = ['s.no', 'manufacturer', 'model', 'purchaseDate', 'location', 'condition', 'isUnderWarranty', 'assignedTo', 'warrantyExpiryDate', 'Action']

    const thead = (
        <tr>
            {th.map((t) => (
                <td scope="col" className="border-botton=0">{t}</td>
            ))}
        </tr>
    )

    useEffect(() => {
        if (asset.length === 0) {
            // console.log("zero Assets");
            setResp("No Assets to show");
        }
        if (action === 'update' && assetEditId) {
            console.log("action update asset");
            OnUpdate();
        }
    }, [asset, action]);

    const tbody = asset.length === 0 ? (
        <>
            {/* {console.log("inside if no Assets available")} */}
            <tr>
                <td colSpan={th.length + 1}>No Assets availabe</td>
            </tr>
        </>
    ) : (
        asset.map((a, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{a.manufacturer}</td>
                <td>{a.model}</td>
                <td>{a.purchaseDate}</td>
                <td>{a.location}</td>
                <td>{a.condition}</td>
                <td>{(a.isUnderWarranty) ? "YES" : "NO"}</td>
                <td>{a.assignedTo}</td>
                <td>{a.warrantyExpiryDate}</td>
                <td>
                    <div>
                        <Link to='/VAPS/assets/update' state={{ assetEditId: a.id,  vapsId: a.vapsId, assetName: a.manufacturer}} className="nav-link">
                            <i className="material-icons">edit</i>
                            <span>edit</span>
                        </Link>
                        <Link to='/VAPS/assets/delete' state={{ assetEditId: a.id,  vapsId: a.vapsId, assetName: a.manufacturer}} className="nav-link">
                            <i className="material-icons">delete</i>
                            <span>delete</span>
                        </Link>
                    </div>
                </td>
            </tr>
        )))


    async function handleAdd(formData) {
        console.log("data we're sending into the api/VAPS endpoint", formData);
        try {
            const res1 = await api.post('/api/VAPS', {
                name: formData.name,
                type: 2,
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

            const res2 = await api.post('/api/Asset', {
                vapsId: id,
                manufacturer: formData.manufacturer,
                model: formData.model,
                purchaseDate: formData.purchaseDate,
                location: formData.location,
                condition: formData.condition,
                isUnderWarranty: formData.isUnderWarranty,
                assignedTo: formData.assignedTo,
                warrantyExpiryDate: formData.warrantyExpiryDate
            }, {
                withCredentials: true
            });
            console.log("api endpoint for adding assets returns: ", res2.data.data)
            navigate('/VAPS/assets/add/status')
        } catch (error) {
            const errormessage = (error.response?.data?.message || "something went wrong while adding new Asset")
            setResp(errormessage)
            console.log("error response from the api", errormessage)
            navigate('/VAPS/assets/add/status')
        }
    }


    async function OnUpdate() {
        try {
            const res = await api.get(`/api/Asset/${assetEditId}`, {
                withCredentials: true,
            })
            setAssetDetails(res.data.data);
            console.log("data returned from get by id endpoint", res.data.data);
        } catch (error) {
            setResp(error.response?.data?.message || 'Something went wrong');
        }
    }

    async function handleUpdate(formData) {
        console.log("data we're sending into the api/VAPS endpoint", formData);
        try {
            
            const res2 = await api.put(`/api/Asset/${assetEditId}`, {
                vapsId: vapsId,
                manufacturer: formData.manufacturer,
                model: formData.model,
                purchaseDate: formData.purchaseDate,
                location: formData.location,
                condition: formData.condition,
                isUnderWarranty: formData.isUnderWarranty,
                assignedTo: formData.assignedTo,
                warrantyExpiryDate: formData.warrantyExpiryDate
            }, {
                withCredentials: true
            });
            console.log("api endpoint for adding assets returns: ", res2.data.data)
            navigate('/VAPS/assets/add/status')
        } catch (error) {
            const errormessage = (error.response?.data?.message || "something went wrong while adding new Asset")
            setResp(errormessage)
            console.log("error response from the api", errormessage)
            navigate('/VAPS/assets/add/status')
        }
    }

    async function handleDelete(assetEditID) {
        setResp('');
        console.log("asset to be deleted:  and type of assetid", assetEditID, assetName, typeof(assetEditID));
        try {
            const res = await api.delete(`/api/asset/${assetEditID}`, {
                // params: {id: Number(assetEditID)},
                withCredentials: true,
            });
            console.log("asset deleted", res.data.data);
            fetchAsset();
            // setRefresh( prev => !prev)
            navigate('/VAPS/assets')

        } catch (error) {
            console.log("error message ", error)
            setResp(error.response?.data?.message || 'Something went wrong while deleting role');
        }

    }
    const deleteform = (
        <div>
            <button type="submit" onClick={() => {
                // e.preventDefault();
                handleDelete(assetEditId)
            }}
                className="btn btn-primary btn-block">Yes</button>
            <br />
            <Link to='/VAPS/assets'>
                <button className="btn btn-primary btn-block">No</button>
            </Link>
        </div>
    )

    let navlink = '/VAPS/vendors';

    if (action == "add") {
        return (
            <>
                <MultistepForm formName={'Add New Asset'} formFields={formFields} response={response} handleAdd={handleAdd} navlink={navlink}/>
            </>
        )
    }else if (action == 'delete') {
        return (
            <>
            <p>inside handle delete</p>
            <Forms Formname={`Are you sure you want to delete Asset"${assetName}" ?`} form={deleteform} response={resp} />
            </>
        )
    }
    else if(action=="update"){
        return(
            <>
                <MultistepForm formName={'Update Asset'} formFields={updateFormFields} response={response} handleAdd={handleUpdate} defaults={assetDetails} navlink={navlink}/>
            </>
        )
    }
    else {
        return (
            <div>
                <LightTable tablename={"Asset"} thead={thead} tbody={tbody} link={'/VAPS/assets/add'} />
                {response && <p>{response}</p>}
            </div>
        )
    }
}