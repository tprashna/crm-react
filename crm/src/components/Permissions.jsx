import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { RolesDropdown } from "./Roles";
import { LightTable } from "./Table";
import { Forms } from "./Forms";


function useFetchPermissions() {
  const [permissions, setPermissions] = useState([]);
  const [response, setResponse] = useState('');

  async function fetchPermissions() {
    try {
      const res = await api.get('/api/Permission/get-All',
      {
        withCredentials: true,
      });
      setPermissions(res.data.data);
      console.log("result .data : ",res.data.data)
      console.log("result : ",res.data)
    } catch (error) {
      setResponse(error.response?.data?.message || 'Something went wrong while fetching permission');
    }
  }

  useEffect(() => {
    fetchPermissions();
  }, []);

  return { permissions, response, fetchPermissions};
}

export function PermissionsTable(){

    const { permissions, response, fetchPermissions} = useFetchPermissions();
    const [ role, setRole] = useState('');

    // async function handleDeletePermission(r, cat, act){
    //     try{
    //         const res = await api.post('api/Permission/revoke', {
    //             role: r,
    //             category: cat,
    //             actions: [act],
    //         },{
    //             withCredentials: true,
    //         });
    //         console.log("data returned from role revoke", res.data);
    //         fetchPermissions();

    //     } catch(error){
    //         console.log("error message ", error)
    //         setResp(error.response?.data?.message || 'Something went wrong while deleting role');
    //     }

    // }


    const thead = (
        <tr>
            <th scope="col" class="border-bottom-0">s.no</th>
            <th scope="col" class="border-bottom-0">Role</th>
            <th scope="col" class="border-bottom-0">Category</th>
            <th scope="col" class="border-bottom-0">Permission</th>
            <th scope="col" class="border-bottom-0">Action</th>
        </tr>
    )


    let count = 1;
    const tbody = permissions.flatMap((p) => 
        p.permissions.flatMap((perm) => 
        perm.actions.map((action) =>(
            <tr key={count}>
                <td>{count++}</td>
                <td>{p.role}</td>
                <td>{perm.category}</td>
                <td>{action}</td>                                
                <td>
                    <div>
                        <Link to='/permissions/delete' state={{role:p.role, category:perm.category, action:action}}>
                        <i className="material-icons">delete</i>
                        <span>Delete</span>
                        </Link>
                        {/* <button 
                            onClick={() => handleDeletePermission(p.role , perm.category, action)}
                            >Delete</button> */}
                    </div>
                </td>
            </tr>
    ))));

    return(
        <div>
            <h2>PERMISSIONS PAGE</h2>

            <LightTable tablename={"Permissions"} thead={thead} tbody={tbody} link={"/addPermission"}/>

            {response && <p>{response}</p>}
            
        </div>
    )
}

export function PermissionDelete(){

        
    const navigate = useNavigate();
    const location = useLocation();
    const role = location.state?.role;
    const category = location.state?.category;
    const action = location.state?.action
    
    const [response, setResponse] = useState('');

    async function handleDeletePermission(r, cat, act){
        try{
            const res = await api.post('api/Permission/revoke', {
                role: r,
                category: cat,
                actions: [act],
            },{
                withCredentials: true,
            });
            console.log("data returned from role revoke", res.data);
            // fetchPermissions();
            navigate('/permissions')

        } catch(error){
            console.log("error message ", error)
            setResponse(error.response?.data?.message || 'Something went wrong while deleting role');
        }

    }
    const deleteform = (
        <div>
            <button type="submit" onClick={() => {
                // e.preventDefault();
                handleDeletePermission(role, category, action)}} 
                className="btn btn-primary btn-block">Yes</button>
            <br />
            <Link to='/permissions'>
            <button className="btn btn-primary btn-block">No</button>
            </Link>
        </div>
    )

    return(
        <Forms Formname={`Are you sure you want to delete ${role}'s permission for ${category}:${action} ?`} form={deleteform} response={response}/>
    )
}

export function PermissionsAdd(){

    
    const navigate = useNavigate();
    const { permissions, response, fetchPermissions} = useFetchPermissions();
    const [ role, setRole] = useState('');
    // const [ removeRole, setRemoveRole] = useState('');
    const [resp, setResp] = useState('');

    const [catAction, setCatAction ] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedAction, setSelectedAction] = useState('');


    async function GetCatAction(){
        try{
            const res = await api.get('/api/Permission/getAll-category-actions');
            setCatAction(res.data.data);
            console.log("data from api call: ", res.data.data);
        }catch(error){
            console.log("error message ", error)
            setResp(error.response?.data?.message || 'Something went wrong while adding new role');
        }
    }

    useEffect(() => {
        GetCatAction();
    },[]);


    async function handleAddPermission(event){
        event.preventDefault();
        try{
            const res = await api.post('api/Permission/assign', {
                role: role,
                category: selectedCategory,
                actions: [selectedAction],
            },{
                withCredentials: true,
            });
            console.log("new permission added", res.data);
            // fetchPermissions();
            navigate("/permissions")


        } catch(error){
            console.log("error message ", error)
            setResp(error.response?.data?.message || 'Something went wrong while adding new role');
        }

    }

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
    };

    const form = (
        <form  
            method="post" 
            onSubmit={handleAddPermission}
            >
            <div className="form-group">
            <RolesDropdown onRoleSelect={handleRoleSelect} selectedRole={role}/>
            </div>
            <div className="form-group">
            <select name="" id="" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="form-control" required>
                <option value="">---choose your category---</option>
            {catAction.map((ca, i) => (
                    <option key={ca.category} value={ca.category}>{ca.category}</option>
            )) }
            </select>
            </div>
            <div className="form-group">
            <select value={selectedAction} onChange={(e) => setSelectedAction(e.target.value)} className="form-control" required>
                <option value="">---choose your action---</option>
            {catAction
                .filter(ca => ca.category === selectedCategory)
                .flatMap(ca => ca.actions)
                .map((a, i) => (
                    <option key={a} value={a}>{a}</option>
                ))
            }
            </select>
            </div>
            <button type="submit" className="btn btn-primary btn-block">Add</button>
        </form>
    )

    return(
        <div>
            <h3>ADD PERMISSIONS</h3>
            <Forms Formname={"Add Permission"} form={form} response={resp} />          
        </div>
    )
}


// export function PermissionsAdd(){

//     const { permissions, response, fetchPermissions} = useFetchPermissions();
//     const [ role, setRole] = useState('');
//     // const [ removeRole, setRemoveRole] = useState('');
//     const [resp, setResp] = useState('');

//     const [catAction, setCatAction ] = useState([]);
//     const [selectedCategory, setSelectedCategory] = useState('');
//     const [selectedAction, setSelectedAction] = useState('');


//     async function GetCatAction(){
//         try{
//             const res = await api.get('/api/Permission/getAll-category-actions');
//             setCatAction(res.data);
//             console.log("data from api call: ", res.data);
//         }catch(error){
//             console.log("error message ", error)
//             setResp(error.response?.data?.message || 'Something went wrong while adding new role');
//         }
//     }

//     useEffect(() => {
//         GetCatAction();
//     },[]);


//     async function handleAddPermission(event){
//         event.preventDefault();
//         try{
//             const res = await api.post('api/Permission/assign', {
//                 role: role,
//                 category: selectedCategory,
//                 actions: [selectedAction],
//             },{
//                 withCredentials: true,
//             });
//             console.log("new permission added", res.data);
//             fetchPermissions();

//         } catch(error){
//             console.log("error message ", error)
//             setResp(error.response?.data?.message || 'Something went wrong while adding new role');
//         }

//     }

//     async function handleDeletePermission(r, cat, act){
//         try{
//             const res = await api.post('api/Permission/revoke', {
//                 role: r,
//                 category: cat,
//                 actions: [act],
//             },{
//                 withCredentials: true,
//             });
//             console.log("data returned from role revoke", res.data);
//             fetchPermissions();

//         } catch(error){
//             console.log("error message ", error)
//             setResp(error.response?.data?.message || 'Something went wrong while deleting role');
//         }

//     }
//     const handleRoleSelect = (selectedRole) => {
//         setRole(selectedRole);
//     };

//     const thead = (
//         <tr>
//             <th scope="col" class="border-bottom-0">s.no</th>
//             <th scope="col" class="border-bottom-0">Role</th>
//             <th scope="col" class="border-bottom-0">Category</th>
//             <th scope="col" class="border-bottom-0">Permission</th>
//             <th scope="col" class="border-bottom-0">Action</th>
//         </tr>
//     )


//     let count = 1;
//     const tbody = permissions.flatMap((p) => 
//         p.permissions.flatMap((perm) => 
//         perm.actions.map((action) =>(
//             <tr key={count}>
//                 <td>{count++}</td>
//                 <td>{p.role}</td>
//                 <td>{perm.category}</td>
//                 <td>{action}</td>                                
//                 <td>
//                     <div>
//                         <button 
//                             onClick={() => handleDeletePermission(p.role , perm.category, action)}
//                             >Delete</button>
//                     </div>
//                 </td>
//             </tr>
//     ))));

//     return(
//         <div>
//             <h3>ADD PERMISSIONS</h3>
//             <div>
//                 <form  
//                     method="post" 
//                     onSubmit={handleAddPermission}
//                     >
//                     <RolesDropdown onRoleSelect={handleRoleSelect} selectedRole={role}/>
//                     <select name="" id="" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
//                         <option value="">---choose your category---</option>
//                     {catAction.map((ca, i) => (
//                             <option key={ca.category} value={ca.category}>{ca.category}</option>
//                     )) }
//                     </select>
//                     <select value={selectedAction} onChange={(e) => setSelectedAction(e.target.value)} required>
//                         <option value="">---choose your action---</option>
//                     {catAction
//                         .filter(ca => ca.category === selectedCategory)
//                         .flatMap(ca => ca.actions)
//                         .map((a, i) => (
//                             <option key={a} value={a}>{a}</option>
//                         ))
//                     }
//                     </select>
//                     <button type="submit">Add</button>
//                 </form>
//                 {resp && <p>{resp}</p>}
//             </div>

//             <LightTable tablename={"Permissions"} thead={thead} tbody={tbody}/>

//             {response && <p>{response}</p>}
            
//         </div>
//     )
// }