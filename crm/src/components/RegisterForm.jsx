import React, {useState} from "react";
import {api} from '../services/api';
import { Navigate, Link, useNavigate } from "react-router-dom";
import { RolesDropdown } from "./Roles";
import { Forms } from "./Forms";
import logo from '/assets/urtechrida_logo.jpg';


function RegistrationForm(){

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone ] = useState('');
    const [department, setDepartment] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [response, setResponse] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(event){
        event.preventDefault();
        setResponse('')
        try {
            const res = await api.post('/api/Account/register', {
                fullName: name,
                email: email,
                phoneNumber: phone,
                department: department,
                role: role,
                password: password,
                confirmPassword: confirmPassword,
            },{
                withCredentials: true,
            });
            // setResponse(JSON.stringify(res.data, null, 2));
            console.log(res.data);
            setName('');
            setEmail('');
            setDepartment('');
            setPhone('');
            setPassword('');
            setConfirmPassword('');
            navigate('/users')
        } catch (error) {
            setResponse ('Error: ' + (error.response?.data?.message || 'Something went wrong'));
            console.log(error);
        }
    };

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
    };

    const form = (
        <form method="post" onSubmit={handleSubmit}>
                <div className="form-group">
                <input type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} className="form-control" required/> 
                </div>
                <div className="form-group">
                <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required/>
                </div>
                 <div className="form-group">
                <input type="text" placeholder="phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" required/>
                </div>
                 <div className="form-group">
                <input type="text" placeholder="department" value={department} onChange={(e) => setDepartment(e.target.value)} className="form-control" required/>
                </div>
                 <div className="form-group">
                {/* <input type="text" placeholder="role" onChange={(e) => setRole(e.target.value)} required/>  */}
                </div>
                <RolesDropdown onRoleSelect={handleRoleSelect} selectedRole={role}/>
                <div className="form-group">
                <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required/>
                </div>
                <div className="form-group">
                <input type="password" placeholder="confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-control" required/>
                </div>
                <button type="submit" className="btn btn-primary btn-block">register</button>
            </form>
    )


    return(
        
        <Forms Formname={'Add new user'} form={form} logo={logo} response={response}/>

    );
}

export default RegistrationForm