import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate, useSearchParams , Link, useLocation} from "react-router-dom";
import Cookies from "js-cookie";
import { LightTable } from "./Table";
import { Forms } from "./Forms";

function useFetchRoles() {
  const [roles, setRoles] = useState([]);
  const [response, setResponse] = useState('');

  async function fetchRoles() {
    try {
      const res = await api.get('api/Role/get-all-roles');
      setRoles(res.data);
    } catch (error) {
      setResponse(error.response?.data?.message || 'Something went wrong');
    }
  }

  useEffect(() => {
    fetchRoles();
  }, []);

  return { roles, response, fetchRoles};
}


export function RolesDropdown({ onRoleSelect, selectedRole }){

    const { roles, response} = useFetchRoles();

    function handleRoleChange(event){
        const selectedval = event.target.value;
        onRoleSelect(selectedval)
        console.log("selected value: ", selectedval)
    }

    return(
        <div>
            <select onChange={handleRoleChange} value={selectedRole}  className="form-control" required>
                <option id="invalid-option" value=''>---choose your role---</option>
                {roles.map((r, index) => (
                    <option key={r} value={r}>{r}</option>
                    ))}
            </select>
            {response && <p>{response}</p>}
        </div>
    )
}


export function Roles({action}){

    const { roles, response, fetchRoles} = useFetchRoles();
    const [ newrole, setNewRole] = useState('');
    const [ roleUpdate, setRoleUpdate] = useState('');
    const [resp, setResp] = useState('');
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const roleToEdit = location.state?.role

    // const roleToEdit = location.state?.role;

    // useEffect(() => {
    //     fetchRoles();
    // }, [refresh]);

    async function handleAddRole(event){
        event.preventDefault();
        const token = Cookies.get('token');
        console.log("role to be added: ", newrole);
        console.log("token: ",token);
        try{
            const res = await api.post('api/Role/add-role', {
                roleName: newrole
            },{
                withCredentials: true,
            });
            console.log("new role added", res.data);
            fetchRoles();
            navigate('/roles')

        } catch(error){
            console.log("error message ", error)
            setResp(error.response?.data?.message || 'Something went wrong while adding new role');
        }

    }

    // async function handleDeleteRole(r){
    //     setResp('');
    //     console.log("role to be deleted: ", r);
    //     try{
    //         const res = await api.delete('api/Role/remove-role', {
    //             data: {roleName: r},
    //             withCredentials: true,
    //         });
    //         // console.log("role deleted", res.data);
    //         // fetchRoles();
    //         setRefresh( prev => !prev)
    //         navigate('/roles', { replace: true })

    //     } catch(error){
    //         console.log("error message ", error)
    //         setResp(error.response?.data?.message || 'Something went wrong while deleting role');
    //     }

    // }

    async function handleUpdateRole(r, rnew){
        setResp('')
        console.log("role to be updated: ", r);
        console.log("new role: ", rnew)
        try{
            const res = await api.put('api/Role/update-role', {
                oldRoleName: r,
                newRolename: rnew,
            },{
                withCredentials: true,
            });
            console.log("response", res.data);
            navigate('/roles');
            fetchRoles();

        } catch(error){
            console.log("error message ", error)
            setResp(error.response?.data?.message || 'Something went wrong while updating role');
        }
    }

    const thead = (
        <tr>
            <td scope="col" class="border-bottom-0">s.no</td>
            <td scope="col" class="border-bottom-0">Role</td>
            <td scope="col" class="border-bottom-0">Action</td>
        </tr>
    )

    const tbody = roles.map((r, index) => (
        <tr key={r}>
            <td>{index+1}</td>
            <td>{r}</td>
            <td>
                {/* <div>
                    <button onClick={() => handleUpdateRole(r, roleUpdate)}>Update</button>
                    <button onClick={() => handleDeleteRole(r)}>Delete</button>
                </div>
                 */}
                 <div>
                    <Link to='/roles/update' state={{role:r}} className="nav-link">
                        <i className="material-icons">edit</i>
                        <span>edit</span>
                    </Link>
                    <Link to='/roles/delete' state={{role:r}} className="nav-link">
                        <i className="material-icons">delete</i>
                        <span>delete</span>
                    </Link>
                </div>
            </td>
        </tr>
    ))

    const addform = (
        <form  method="post" onSubmit={handleAddRole}>
            <div  className="form-group">
            <input 
                type="text" 
                placeholder="add new role" 
                onChange={(e) => 
                    setNewRole(e.target.value)
                }
                className="form-control"
                />
                </div>
            <button type="submit" className="btn btn-primary btn-block">Add</button>
        </form>
    )

    const updateform = (
        <div>
            <p className="text-center">Old Role: {roleToEdit}</p>
            <p className="text-center">New role: <input type="text" placeholder="enter new role name" onChange={(e)=> setRoleUpdate(e.target.value)}/> </p>
            
            <button type="submit" onClick={() => {
                // e.preventDefault();
                handleUpdateRole(roleToEdit, roleUpdate)}} 
                className="btn btn-primary btn-block">Yes</button>
            <br />
            <Link to='/roles'>
            <button className="btn btn-primary btn-block">No</button>
            </Link>
        </div>
    )
    

    if (action=="add"){
        return(
            <>
                <Forms Formname={"Add Role"} form={addform} response={resp}/>
            </>
        )
    }
    else if(action=="update"){
        return(
            <>
                <Forms Formname={"Update role"} form={updateform} response={resp}/>
            </>
        )
    }
    else {
        return(
            <div>
                <LightTable tablename={"Roles"} thead={thead} tbody={tbody} link={'/roles/add'} />
                {response && <p>{response}</p>}
            </div>
            )
    }
}

export function RolesDelete(){

    const [resp, setResp] = useState('');
    const location = useLocation();
    const roleToEdit = location.state?.role;
    const navigate = useNavigate();

    async function handleDeleteRole(r){
        setResp('');
        console.log("role to be deleted: ", r);
        try{
            const res = await api.delete('api/Role/remove-role', {
                data: {roleName: r},
                withCredentials: true,
            });
            // console.log("role deleted", res.data);
            // fetchRoles();
            // setRefresh( prev => !prev)
            navigate('/roles')

        } catch(error){
            console.log("error message ", error)
            setResp(error.response?.data?.message || 'Something went wrong while deleting role');
        }

    }
    const deleteform = (
        <div>
            {/* <div  className="form-group">
            <p className="text-center">Delete role <strong>{roleToEdit}</strong></p>
            </div> */}
            <button type="submit" onClick={() => {
                // e.preventDefault();
                handleDeleteRole(roleToEdit)}} 
                className="btn btn-primary btn-block">Yes</button>
            <br />
            <Link to='/roles'>
            <button className="btn btn-primary btn-block">No</button>
            </Link>
        </div>
    )

    return(
        <Forms Formname={`Are you sure you want to delete role "${roleToEdit}" ?`} form={deleteform} response={resp}/>
    )
}