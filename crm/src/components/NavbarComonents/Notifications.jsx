import { api } from "../../services/api";
import { useEffect, useState } from "react";

export function Notifications() {

    const [response1, setResponse1] = useState();
    const [response2, setResponse2] = useState();
    const [response, setResponse] = useState();
    const [notificationCount, setNotificationCount] = useState();
    const [notifications, setNotifications] = useState([]);

    async function getNotificationCountById() {
        try {
            const res = await api.get(`/api/Notifications/get-notificationCount`);
            setNotificationCount(res.data.data);
            console.log("api response notification count", res.data.data);
        } catch (error) {
            setResponse1("something went wrong fetching notification by id")
        }
    }

    async function getNotificationById() {
        try {
            const res = await api.get(`/api/Notifications/byUserId`);
            setNotifications(res.data.data);
            console.log("api response data from get notification by ID", res.data.data);
        } catch (error) {
            setResponse2("something went wrong fetching notification by id")
        }
    }

    useEffect(() => {
        getNotificationCountById();
        getNotificationById();
    }, []);

    async function markAsSeen(id) {
        try {
            const res = await api.post(`/api/Notifications/markSeenById?notificationId=${id}`);
            console.log("api response data from get notification by ID", res.data);
            await getNotificationById();
            await getNotificationCountById();
        } catch (error) {
            setResponse("something went wrong fetching notification by id")
        }
    }

    async function markAllAsSeen(e) {
        e.preventDefault();
        try {
            const res = await api.post(`/api/Notifications/markAllSeen`);
            console.log("api response data from mark all as seen", res.data);
            await getNotificationById();
            await getNotificationCountById();
        } catch (error) {
            setResponse("something went wrong fetching notification by id")
        }
    }


    return (
        <>
            {/* notification  */}
            <li className="nav-item border-right dropdown notifications">
                <a
                    className="nav-link nav-link-icon text-center"
                    href="#"
                    role="button"
                    id="dropdownMenuLink"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                >
                    <div className="nav-link-icon__wrapper">
                        <i className="material-icons">&#xE7F4;</i>
                        <span className="badge badge-pill badge-danger">{notificationCount}</span>
                    </div>
                </a>
                <div className="dropdown-menu dropdown-menu-small" aria-labelledby="dropdownMenuLink">
                    {notificationCount === 0 && (
                        <>
                            <div >
                                <p className="text-center">No Notifications</p>
                                {/* <div className="notification__content">
                                    <span className="notification__category">No Notifications</span>
                                </div> */}
                            </div>
                        </>
                    )}
                    {notifications.filter((n) => !n.isSeen).map((n) => (
                        <>
                            <a className="dropdown-item" href="#" onClick={() => markAsSeen(n.id)} key={n.id}>
                                <div className="notification__icon-wrapper">
                                    <div className="notification__icon">
                                        <i className="material-icons">&#xE6E1;</i>
                                    </div>
                                </div>
                                <div className="notification__content">
                                    <span className="notification__category">{n.title}</span>
                                    <p>
                                        {n.message}, {n.id}
                                        {' '}
                                        <br />
                                        <span className="text-success text-semibold">url</span>
                                    </p>
                                </div>
                            </a>
                        </>
                    ))}
                    <a className="dropdown-item notification__all text-center" href="#" onClick={markAllAsSeen}>
                        Mark All As Seen
                    </a>
                </div>
            </li>
            {/* notification end  */}
        </>
    )
}