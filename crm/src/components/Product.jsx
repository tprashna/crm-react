import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate, useSearchParams, Link, useLocation } from "react-router-dom";
import { LightTable } from "./Table";
import { Forms } from "./Forms";
import { MultistepForm } from "./MultistepForm";
import { ButtonPrevNext } from "./ButtonPrevNext";

function useFetchProduct() {
    const [Product, setProduct] = useState([]);
    const [response, setResponse] = useState('');

    async function fetchProduct() {
        try {
            const res = await api.get('api/Product');
            setProduct(res.data.data);
            console.log(res.data.data)
        } catch (error) {
            setResponse(error.response?.data?.message || 'Something went wrong');
        }
    }

    useEffect(() => {
        fetchProduct();
    }, []);

    return { Product, response, fetchProduct };
}



export function Product({ action }) {

    console.log("we are in the Products page");
    const { Product, response, fetchProduct } = useFetchProduct();
    const [resp, setResp] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const productEditId = location.state?.productEditId;
    const vapsId = location.state?.vapsId;
    const productName = location.state?.productName;
    console.log("product name and id : ", productName, productEditId);
    const [productDetails, setProductDetails] = useState()
    const formFields = [[
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'description', label: 'Description', type: 'text' }
    ], [
        { name: 'category', label: 'Category', type: 'text' },
        { name: 'brand', label: 'Brand', type: 'text' },
        // { name: 'purchaseDate', label: 'Purchase Date', type: 'datetime-local' },
        { name: 'model', label: 'Model', type: 'text' },
        { name: 'unitOfMeasureId', label: 'unit Of Measurement', type: 'number' },
        { name: 'price', label: 'Price', type: 'number' },
        { name: 'stockQuantity', label: 'Stock Quantity', type: 'number' },
        { name: 'reorderLevel', label: 'Reorder Level', type: 'number' },
        { name: 'specifications', label: 'Specifications', type: 'text' }
    ]];

    const updateFormFields = [formFields[1]];

    const th = ['s.no', 'Category', 'Brand', 'Model', 'Unit', 'Price', 'Stock', 'ReorderLevel', 'specifications', 'Action']

    const thead = (
        <tr>
            {th.map((t) => (
                <td scope="col" className="border-botton=0">{t}</td>
            ))}
        </tr>
    )

    useEffect(() => {
        if (Product.length === 0) {
            // console.log("zero Products");
            setResp("No Products to show");
        }
        if (action === 'update' && productEditId) {
            console.log("action update product");
            OnUpdate();
        }
    }, [Product, action]);

    const tbody = Product.length === 0 ? (
        <>
            {/* {console.log("inside if no Products available")} */}
            <tr>
                <td colSpan={th.length+1}>No Products availabe</td>
            </tr>
        </>
    ) : (
        Product.map((a, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{a.category}</td>
                <td>{a.brand}</td>
                <td>{a.model}</td>
                <td>{a.unitOfMeasureId}</td>
                <td>{a.price}</td>
                <td>{a.stockQuantity}</td>
                <td>{a.reorderLevel}</td>
                <td>{a.specifications}</td>
                <td>
                    <div>
                        <Link to='/VAPS/products/update' state={{ productEditId: a.id,  vapsId: a.vapsId, productName: a.model}} className="nav-link">
                            {console.log("id of this product is ", a.id)}
                            <i className="material-icons">edit</i>
                            <span>edit</span>
                        </Link>
                        <Link to='/VAPS/Products/delete' state={{ productEditId: a.id,  vapsId: a.vapsId, productName: a.model}} className="nav-link">
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
                type: 3,
                isActive: true,
                description: formData.description,
            },
                {
                    withCredentials: true
                })
            console.log("data returned from api vaps add    ", res1.data," that's it")
            const id = res1.data.data.id;
            console.log("the id we received from the api", res1.data.data.id);
            console.log("the id we received from the api", id);

            const res2 = await api.post('/api/Product', {
                vapsId: id,
                category: formData.category,
                brand: formData.brand,
                model: formData.model,
                unitOfMeasureId: Number(formData.unitOfMeasureId),
                price: Number(formData.price),
                stockQuantity: Number(formData.stockQuantity),
                reorderLevel: Number(formData.reorderLevel),
                specifications: formData.specifications
            },{
                withCredentials: true
            });
            console.log("api endpoint for adding Products returns: ", res2.data.data)
            navigate('/VAPS/Products/add/status')
        } catch (error) {
            const errormessage = (error.response?.data?.message || "something went wrong while adding new Product")
            setResp(errormessage)
            console.log("error response from the api", errormessage)
            navigate('/VAPS/Products/add/status')
        }
    }

    async function OnUpdate() {
        try {
            const res = await api.get(`/api/product/${productEditId}`, {
                withCredentials: true,
            })
            setProductDetails(res.data.data);
            console.log("data returned from get by id endpoint", res.data.data);
        } catch (error) {
            setResp(error.response?.data?.message || 'Something went wrong');
        }
    }

    async function handleUpdate(formData) {
        console.log("data we're sending into the api/VAPS endpoint", formData);
        try {
            const res2 = await api.put(`/api/Product/${productEditId}`, {
                vapsId: vapsId,
                category: formData.category,
                brand: formData.brand,
                model: formData.model,
                unitOfMeasureId: Number(formData.unitOfMeasureId),
                price: Number(formData.price),
                stockQuantity: Number(formData.stockQuantity),
                reorderLevel: Number(formData.reorderLevel),
                specifications: formData.specifications
            },{
                withCredentials: true
            });
            console.log("api endpoint for adding Products returns: ", res2.data.data)
            navigate('/VAPS/Products/add/status')
        } catch (error) {
            const errormessage = (error.response?.data?.message || "something went wrong while adding new Product")
            setResp(errormessage)
            console.log("error response from the api", errormessage)
            navigate('/VAPS/Products/add/status')
        }
    }

    async function handleDelete(productEditID) {
        setResp('');
        console.log("product to be deleted:  and type of productid", productEditID, productName, typeof(productEditID));
        try {
            const res = await api.delete(`/api/product/${productEditID}`, {
                // params: {id: Number(productEditID)},
                withCredentials: true,
            });
            console.log("product deleted", res.data.data);
            fetchProduct();
            // setRefresh( prev => !prev)
            navigate('/VAPS/products')

        } catch (error) {
            console.log("error message ", error)
            setResp(error.response?.data?.message || 'Something went wrong while deleting role');
        }

    }

    const deleteform = (
        <div>
            <button type="submit" onClick={() => {
                // e.preventDefault();
                handleDelete(productEditId)
            }}
                className="btn btn-primary btn-block">Yes</button>
            <br />
            <Link to='/VAPS/products'>
                <button className="btn btn-primary btn-block">No</button>
            </Link>
        </div>
    )
    let navlink = '/VAPS/products';

    if (action == "add") {
        return (
            <>
                <MultistepForm formName={'Add New Product'} formFields={formFields} response={response} handleAdd={handleAdd} navlink={navlink}/>
            </>
        )
    }
    else if (action == 'delete') {
        return (
            <>
            <p>inside handle delete</p>
            <Forms Formname={`Are you sure you want to delete product"${productName   }" ?`} form={deleteform} response={resp} />
            </>
        )
    }
    else if(action=="update"){
        return(
            <>
                <MultistepForm formName={'Update Product'} formFields={updateFormFields} response={response} handleAdd={handleUpdate} defaults={productDetails} navlink={navlink}/>
            </>
        )
    }
    else {
        return (
            <div>
                <LightTable tablename={"Product"} thead={thead} tbody={tbody} link={'/VAPS/Products/add'} />
                {response && <p>{response}</p>}
            </div>
        )
    }
}