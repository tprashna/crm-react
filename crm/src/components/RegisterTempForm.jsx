import React, {useState} from "react";
import {api} from '../services/api';
import { Navigate, Link } from "react-router-dom";
import { RolesDropdown } from "./Roles";
import { Forms } from "./Forms";
import logo from '/assets/urtechrida_logo.jpg';

function RegistrationTempForm(){

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone ] = useState('');
    const [department, setDepartment] = useState('');
    const [role, setRole] = useState('');
    const [response, setResponse] = useState('');

    async function handleSubmit(event){
        event.preventDefault();
        setResponse('')
        console.log("role selected is: ", role)
        try {
            const res = await api.post('/api/Account/register-tempUser', {
                fullName: name,
                email: email,
                phoneNumber: phone,
                department: department,
                role: role,
            });
            // setResponse(JSON.stringify(res.data, null, 2));
            console.log("response from the api", res)
            if (res.data.success) {
                setResponse(res.data.message);
            } else {
                setResponse('Something went wrong');
            }
            console.log(response.data);

        } catch (error) {
            setResponse ('Error: ' + (error.response?.data?.message || 'Something went wrong'));
            console.log(error);
        }
        setName('');
        setEmail('');
        setPhone('');
        setDepartment('');
        setRole('');
    };

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
    };

    const form =(
        <form method="post" onSubmit={handleSubmit}>
                    <div className="form-group">
                    <input type="text" value={name} placeholder="name" onChange={(e) => setName(e.target.value)} className="form-control" required/> 
                    </div>
                    <div className="form-group">
                    <input type="email" value={email} placeholder="email" onChange={(e) => setEmail(e.target.value)} className="form-control" required/>
                    </div>
                     <div className="form-group">
                    <input type="text" value={phone} placeholder="phone number" onChange={(e) => setPhone(e.target.value)}  className="form-control" required/>
                    </div>
                     <div className="form-group">
                    <input type="text" value={department} placeholder="department" onChange={(e) => setDepartment(e.target.value)} className="form-control" required/> 
                    </div>
                    <div className="form-group">
                    {/* <input type="text" placeholder="role" onChange={(e) => setRole(e.target.value)} required/>  */}
                    <RolesDropdown onRoleSelect={handleRoleSelect} selectedRole={role}/>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">submit</button>
                </form>
    )

    const link = "/login"
    const navigateTo = "Already have an account? Login"
    const formname = "Register"

    return(
        <Forms Formname={formname} form={form} logo={logo} response={response} link={link} navigateTo={navigateTo}/>
    );
}

export default RegistrationTempForm