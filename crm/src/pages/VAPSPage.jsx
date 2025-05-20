import MainLayout from "../components/MainLayout";
import { Vendor } from "../components/Vendors";
import { RegisteredConfirm } from "../components/Vendors";
import { Asset } from "../components/Assets";
import { Product } from "../components/Product";
import { Service } from "../components/Service";

export function VendorsPage({action}){
    
    return(
        <MainLayout>
            <Vendor action={action}/>
        </MainLayout>
    )
}

export function ConfirmRegisterPage({status}){
    return(
        <MainLayout>
            <RegisteredConfirm status={status}/>
        </MainLayout>
    )
}

export function AssetsPage({action}){
    
    return(
        <MainLayout>
            <Asset action={action}/>
        </MainLayout>
    )
}

export function ProductPage({action}){
    
    return(
        <MainLayout>
            <Product action={action}/>
        </MainLayout>
    )
}

export function ServicePage({action}){
    
    return(
        <MainLayout>
            <Service action={action}/>
        </MainLayout>
    )
}