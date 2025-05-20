import { useState } from 'react';
import {api} from '../services/api'
import { Navigate, useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import logo from '/assets/urtechrida_logo.jpg';
import { Forms } from './Forms';


function LoginForm(){

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState('');

    async function handleSubmit(event){
        event.preventDefault();
        try{
            const res = await api.post('api/Account/login', {
                email: email,
                password: password,
            });
            console.log("data returned from login is:", res.data);
            const token = res.data.data.token;
            Cookies.set('token', token, {
                expires: 10000,
                secure: false,
                sameSite: 'Lax'
            });
            console.log("token set in cookie is ", Cookies.get('token'));
            navigate('/dashboard');

        }catch(error){
            setResponse ('Error: ' + (error.response?.data?.message || 'Something went wrong'));
            console.log(error);
            setEmail('')
            setPassword('')
            console.log("we set pass and username to null again");
        }
    };

    const form = (
        <form onSubmit={handleSubmit}>
                <div className="form-group">
                <input
                    type="text"
                    placeholder="Username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    required
                />
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    required
                />
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                Login
                </button>
            </form>
    )

    const link = "/registerTemp"
    const navigateTo = "Do not have an account? Register"
    const formname = "Login"

    return (
        <Forms Formname={formname} form={form} logo={logo} response={response} link={link} navigateTo={navigateTo}/>
    );
}

export default LoginForm
