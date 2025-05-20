import ProtectedRoute from "../services/ProtectedRoute";
import Logout from "../components/Logout";
import {Roles, RolesDelete} from "../components/Roles";
import MainLayout from "../components/MainLayout";


export function RolesPage({action}){

    return(
        <>
        {/* <ProtectedRoute> */}
            <MainLayout>
                <Roles action={action}/>
            </MainLayout>
        {/* </ProtectedRoute> */}
        </>
    )
}

export function RolesDeleteConfirmPage(){

    return(
        <>
        {/* <ProtectedRoute> */}
            <MainLayout>
                <RolesDelete/>
            </MainLayout>
        {/* </ProtectedRoute> */}
        </>
    )
}