import { useState } from "react";
import { RolesDropdown } from "./Roles";
import { Link } from "react-router-dom";

export function SelectReviewer({Formname, form, response, link, navigateTo}){

    const [reviewer, SelectReviewer] = useState(); 

    const handleRoleSelect = (selectedRole) => {
        SelectReviewer(selectedRole);
    };

    return(
        <>
            <div className="login-page container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
            <div className="row w-100 justify-content-center">
            <div className="col-md-6 col-lg-4">
                <div className="card p-4 shadow-sm">
                <h4 className="text-center mb-4">{Formname}</h4>
                {form}
                {response && <p className="text-danger text-center mt-3">{response}</p>}
                <RolesDropdown onRoleSelect={handleRoleSelect} selectedRole={role}/>
                <div className="text-center mt-3">
                    <Link to={link} className="text-primary">
                    {navigateTo}
                    </Link>
                </div>
                </div>
            </div>
            </div>
        </div>
        </>
    )
}