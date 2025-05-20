import Sidebar from "./Sidebar";
import { Navbar } from "./NavbarComonents/Navbar";
import { Footer } from "./Footer";

function MainLayout({children}){

    return(
        <div className="container-fluid">
            <div className="row">
                <Sidebar />
                <main className="main-content col-lg-10 col-md-9 col-sm-12 p-0 offset-lg-2 offset-md-3">
                <Navbar />
                <div className="main-content-container container-fluid px-4">
                    {children}
                </div>
                <Footer />
                </main>
            </div>
        </div>
    )
}

export default MainLayout;