import ProtectedRoute from "../services/ProtectedRoute";
import { PermissionsTable, PermissionsAdd, PermissionDelete} from "../components/Permissions";
import MainLayout from "../components/MainLayout";

export function PermissionsPage(){

    return(
            <>
            {/* <ProtectedRoute> */}
            <MainLayout>
                <PermissionsTable/>
            </MainLayout>
            {/* </ProtectedRoute> */}
            </>
    )
}

export function PermissionsAddPage(){

    return(
            <>
            {/* <ProtectedRoute> */}
            <MainLayout>
                <PermissionsAdd/>
            </MainLayout>
            {/* </ProtectedRoute> */}
            </>
    )
}

export function PermissionsDeletePage(){

    return(
            <>
            {/* <ProtectedRoute> */}
            <MainLayout>
                <PermissionDelete/>
            </MainLayout>
            {/* </ProtectedRoute> */}
            </>
    )
}