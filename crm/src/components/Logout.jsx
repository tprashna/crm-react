import { Link, useNavigate } from "react-router-dom"
import Cookies from 'js-cookie'
import { Navigate } from "react-router-dom"

function Logout(){
    const navigate = useNavigate();

    function handleLogout(){
        Cookies.remove('token')
        navigate('/login')
    }

    return(
        <div>
            <button onClick={() => handleLogout()}>Logout</button>
            {/* <Link to='/login'>LOGOUT</Link> */}
        </div>
    )
}

export default Logout