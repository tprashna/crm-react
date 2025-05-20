import { useFetchUsers } from "./Users"
import { RolesDropdown } from "./Roles"
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetDrafts } from "./memo";
import { api } from "../services/api";

export function MemoSubmit() {

    const [selectedRole, setSelectedRole] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [resp, setResp] = useState();
    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const memoId = queryParams.get("MemoId");

    const { users, response, totalCount, fetchUsers } = useFetchUsers({
        role: selectedRole || undefined
    });

    console.log("users are", users)
    useEffect(() => {
        fetchUsers();
        setSelectedUserId(null); // reset selected user
    }, [selectedRole]);
    function handleRoleSelect(role) {
        setSelectedRole(role);
    }

    function handleUserSelect(event) {
        setSelectedUserId(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const res = await api.post(`/api/Memo/submit/${memoId}?reviewerId=${selectedUserId}`)
            console.log("data returned from the api for memo submit: ", res.data)
            GetDrafts();
            navigate('/memo')
        } catch (error) {
            console.log("error message ", error)
            setResp(error.response?.data?.message || 'Something went wrong while submitting memo');
        }
    }

    console.log("we are in the memosubmit")
    return (
        <div>
            <RolesDropdown
                selectedRole={selectedRole}
                onRoleSelect={handleRoleSelect}
            />

            <select
                className="form-control"
                value={selectedUserId || ""}
                onChange={handleUserSelect}
            // disabled={!selectedRole || users.length === 0}
            >
                <option value="">---choose your user---</option>
                {users
                    .filter(user => user.role === selectedRole)
                    .map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.fullName}
                        </option>
                    ))}
            </select>
            <br />
            <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
            {response && <p>{response}</p>}

            {/* Debug display */}
            <p>Selected Role: {selectedRole}</p>
            <p>Selected User ID: {selectedUserId}</p>
            {console.log(selectedUserId)}
        </div>
    );
}