import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import LoginForm from './components/LoginForm';
import DashboardPage from './pages/DashboardPage';
import RegisterUserPage from './pages/RegisterUserPage';
import RegistrationTempForm from './components/RegisterTempForm';
import UsersPage from './pages/UsersPage';
import { PermissionsAddPage, PermissionsDeletePage, PermissionsPage } from './pages/PermissionsPage';
import { RolesDeleteConfirmPage, RolesPage } from './pages/RolesPage';
import { VendorsPage , ConfirmRegisterPage, AssetsPage, ProductPage, ServicePage} from './pages/VAPSPage';
import {MemoPage, MemoSubmitPage} from './pages/MemoPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<><p>WELCOME TO THE HOMEPAGE</p></>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/dashboard" element={<DashboardPage/>}/>
        <Route path="/addUser" element={<RegisterUserPage/>}/>
        <Route path="/registerTemp" element={<RegistrationTempForm/>}/>
        <Route path="/permissions" element={<PermissionsPage/>}/>
        <Route path="/permissions/delete" element={<PermissionsDeletePage/>}/>
        <Route path="/addPermission" element={<PermissionsAddPage/>}/>
        <Route path="/roles" element={<RolesPage action=""/>}/>
        <Route path="/roles/add" element={<RolesPage action="add"/>}/>
        <Route path="/roles/update" element={<RolesPage action="update"/>}/>
        <Route path="/roles/delete" element={<RolesDeleteConfirmPage/>}/>
        <Route path="/users" element={<UsersPage/>}/>

        <Route path="/VAPS/vendors" element={<VendorsPage/>}/>
        <Route path="/VAPS/vendors/add" element={<VendorsPage action="add"/>}/>
        <Route path="/VAPS/vendors/delete" element={<VendorsPage action="delete"/>}/>
        <Route path="/VAPS/vendors/update" element={<VendorsPage action="update"/>}/>
        {/* <Route path="/VAPS/vendors/add/status" element={<ConfirmRegisterPage/>}/> */}
        
        <Route path="/VAPS/vendors/add/success" element={<ConfirmRegisterPage status={true}/>}/>
        <Route path="/VAPS/vendors/add/failed" element={<ConfirmRegisterPage status={false}/>}/>

        <Route path="/VAPS/assets" element={<AssetsPage/>}/>
        <Route path="/VAPS/assets/add" element={<AssetsPage action="add"/>}/>
        <Route path="/VAPS/assets/delete" element={<AssetsPage action="delete"/>}/>
        <Route path="/VAPS/assets/update" element={<AssetsPage action="update"/>}/>
        <Route path="/VAPS/assets/add/status" element={<ConfirmRegisterPage/>}/>

        <Route path="/VAPS/products" element={<ProductPage/>}/>
        <Route path="/VAPS/products/add" element={<ProductPage action="add"/>}/>
        <Route path="/VAPS/products/delete" element={<ProductPage action="delete"/>}/>
        <Route path="/VAPS/products/update" element={<ProductPage action="update"/>}/>
        <Route path="/VAPS/products/add/status" element={<ConfirmRegisterPage/>}/>

        <Route path="/VAPS/services" element={<ServicePage/>}/>
        <Route path="/VAPS/services/add" element={<ServicePage action="add"/>}/>
        <Route path="/VAPS/services/delete" element={<ServicePage action="delete"/>}/>
        <Route path="/VAPS/services/update" element={<ServicePage action="update"/>}/>
        <Route path="/VAPS/services/add/status" element={<ConfirmRegisterPage/>}/>

        <Route path="/memo" element={<MemoPage/>}/>
        <Route path="/memo/add" element={<MemoPage action="add"/>}/>
        <Route path="/memo/update" element={<MemoPage action="update"/>}/>
        <Route path="/memo/delete" element={<MemoPage action="delete"/>}/>
        <Route path="/memo/submit" element={<MemoSubmitPage/>}/>


      </Routes>
    </Router>
  )
}

export default App
