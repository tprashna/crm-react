import { Link } from "react-router-dom"

function Sidebar(){

    // return(
    //     <div className="sidebar">
    //         <div className="sidebarContent">
    //             {/* <div>company icon</div> */}
    //             {/* stack of stuff */}
    //             <div className="sidebarList"> 
    //                 <ul className="no-bullets">
    //                 <li ><Link to='/dashboard'><span>Dashboard</span></Link></li>
    //                 <li><Link to='/register'><span>Register</span></Link></li>
    //                 <li><Link to='/permissions'><span>Permissions</span></Link></li>
    //                 <li><Link to='/roles'><span>Roles</span></Link></li>
    //                 <li><Link to='/users'><span>Users</span></Link></li>
    //         </ul>
    //             </div>
    //         </div>
    //     </div>
    // )

    return(
        // <!-- Main Sidebar -->
          <aside className="main-sidebar col-12 col-md-3 col-lg-2 px-0">
            <div className="main-navbar">
              <nav className="navbar align-items-stretch navbar-light bg-white flex-md-nowrap border-bottom p-0">
                <a className="navbar-brand w-100 mr-0" href="#" style={{ lineHeight: '25px' }}>
                  <div className="d-table m-auto">
                    <img
                      id="main-logo"
                      className="d-inline-block align-top mr-1"
                      style={{ maxWidth: '25px' }}
                      src="/assets/urtechrida_logo.jpg"
                      alt="logo image"
                    />
                    <span className="d-none d-md-inline ml-1">Techrida Dashboard</span>
                  </div>
                </a>
                <a className="toggle-sidebar d-sm-inline d-md-none d-lg-none" href="#">
                  <i className="material-icons">&#xE5C4;</i>
                </a>
              </nav>
            </div>

            <form action="#" className="main-sidebar__search w-100 border-right d-sm-flex d-md-none d-lg-none">
              <div className="input-group input-group-seamless ml-3">
                <div className="input-group-prepend">
                  <div className="input-group-text">
                    <i className="fas fa-search"></i>
                  </div>
                </div>
                <input
                  className="navbar-search form-control"
                  type="text"
                  placeholder="Search for something..."
                  aria-label="Search"
                />
              </div>
            </form>

            <div className="nav-wrapper">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <a className="nav-link active" href="/dashboard">
                    <i className="material-icons">dashboard</i>
                    <span>Dashboard</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/users">
                    <i className="material-icons">group</i>
                    <span>Users</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/permissions">
                    <i className="material-icons">lock_open</i>
                    <span>Permissions</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/roles">
                    <i className="material-icons">assignment_ind</i>
                    <span>Roles</span>
                  </a>
                </li>
                <li className="nav-item">
                <div className="dropdown">
                  <a className="nav-link dropdown-toggle" href="#" data-toggle="dropdown">
                    <i className="material-icons">lock_open</i>
                    <span>VAPS</span>
                  </a>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <a className="dropdown-item" href="/VAPS/vendors">Vendor</a>
                    <a className="dropdown-item" href="/VAPS/assets">Asset</a>
                    <a className="dropdown-item" href="/VAPS/products">Product</a>
                    <a className="dropdown-item" href="/VAPS/services">Service</a>
                  </div>
                  </div>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/memo">
                    <i className="material-icons">assignment_ind</i>
                    <span>Memo</span>
                  </a>
                </li>
              </ul>
            </div>
          </aside>

    )
}

export default Sidebar