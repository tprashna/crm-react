import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie';

function ProtectedRoute({ children }) {
    const token = Cookies.get('token');

    if (!token) {
        console.log("if not then true returning back to the login page")
        return <Navigate to="/login" replace />;
    }
    console.log("token present")
    return children;
}

export default ProtectedRoute;
