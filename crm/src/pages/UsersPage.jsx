import ProtectedRoute from "../services/ProtectedRoute";
import Dashboard from '../components/Dashboard'
import Sidebar from '../components/Sidebar'
import Logout from "../components/Logout";
import { Users } from "../components/Users";
import MainLayout from "../components/MainLayout";

function UsersPage(){

    return(
        <>
        {/* <ProtectedRoute> */}
        <MainLayout>
            <Users/>
        </MainLayout>
        {/* </ProtectedRoute> */}
        </>
    )
}

export default UsersPage