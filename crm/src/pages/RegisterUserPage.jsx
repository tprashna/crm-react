import ProtectedRoute from "../services/ProtectedRoute";
import Sidebar from "../components/Sidebar"
import RegistrationForm from "../components/RegisterForm"
import MainLayout from "../components/MainLayout";

function RegisterUserPage(){

    return(
        // <ProtectedRoute>
        <MainLayout>
            <RegistrationForm/>
        </MainLayout>
        // </ProtectedRoute>
    )
}

export default RegisterUserPage