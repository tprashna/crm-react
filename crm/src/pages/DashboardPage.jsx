import ProtectedRoute from "../services/ProtectedRoute";
import Dashboard from '../components/Dashboard'
import Logout from "../components/Logout";
import {GetDrafts } from "../components/memo";
import MainLayout from "../components/MainLayout";

function DashboardPage(){

    return(
        <>
        {/* <ProtectedRoute> */}
        <MainLayout>
        <Dashboard/>
        </MainLayout>
        {/* </ProtectedRoute> */}
        </>
    )
}

export default DashboardPage