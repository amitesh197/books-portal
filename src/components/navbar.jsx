import React, {useEffect, useRef, useState} from "react";
import {useGlobalContext} from "../context/globalContext";
import {Link, useNavigate} from "react-router-dom";
import {auth} from "../firebase.config";
import {signOut} from "firebase/auth";
import brand from "../assets/sarrthiias-logo.png";
import logo from "../assets/favicon.png";


function Navbar() {
    const {userInfo, setUserInfo} = useGlobalContext();
    const [expanded, setExpanded] = useState(true);
    const navigate = useNavigate();
    let currentUrl = window.location.href.split("/").pop();
    const navbarRef = useRef(null);
    const [userName, setUserName] = useState("")

    const logOut = () => {
        signOut(auth)
            .then(() => {
                console.log("signout successful");
                sessionStorage.removeItem("userInfo");
                navigate("/login");
                setUserInfo(null);
            })
            .catch((error) => {
                console.log("error is ", error);
            });
    };

    useEffect(() => {
        //strip the user name from the email
        const name = userInfo?.email.split("@")[0];
        //only
        setUserName(name);

    }, [userInfo]);

    return (
        <aside className="h-screen w-fit">
            <nav ref={navbarRef} className="h-full flex flex-col bg-white border-r shadow-sm">
                <div className="p-4 pb-2 flex justify-between items-center mb-5">
                    <div className="w-full flex justify-center items-center">
                        <img
                            className={`overflow-hidden transition-all ${expanded ? "w-20" : "w-10"}`}
                            src={expanded ? brand : logo}
                            alt="Logo"

                        />
                    </div>
                    <button
                        onClick={() => setExpanded((curr) => !curr)}
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                        {expanded ? (
                            <i className="fa-solid fa-chevron-left"></i>
                        ) : (
                            <i className="fa-solid fa-chevron-right"></i>
                        )}
                    </button>
                </div>

                <ul className="flex-1 px-3">
                    {[
                        {icon: "fa-solid fa-home", text: "Home", link: "/"},
                        {icon: "fa-solid fa-list", text: "All", link: "/all"},
                        {icon: "fa-solid fa-check-circle", text: "Resolved", link: "/resolved"},
                        {icon: "fa-solid fa-exclamation-circle", text: "Unresolved", link: "/unresolved"},
                        ...(userInfo?.isAdmin ? [
                            {icon: "fa-solid fa-chart-bar", text: "Stats", link: "/stats"},
                            {icon: "fa-solid fa-tachometer-alt", text: "Dashboard", link: "/dashboard"},
                            {
                                icon: "fa-solid fa-clock-rotate-left",
                                text: "Monthly user's history",
                                link: "/monthly-user-history"
                            },
                            {icon: "fa-solid fa-calendar", text: "Current Month Stats", link: "/current-users-stats"}
                        ] : [
                            {icon: "fa-solid fa-user", text: "Profile", link: "/profile"},
                            {icon: "fa-solid fa-clock-rotate-left", text: "History", link: "/history"}
                        ]),
                        {icon: "fa-solid fa-trophy", text: "Top Performers", link: "/topperformers"},
                        {icon: "fa-solid fa-bullhorn", text: "Announcements", link: "/announcements"}
                    ].map(({icon, text, link }) => (
                        <SidebarItem
                            key={link}
                            expanded={expanded}
                            icon={icon}
                            text={text}
                            active={currentUrl === link.slice(1)}
                            link={link}
                        />
                    ))
                    }
                </ul>

                <div className="border-t flex p-3">
                    {userInfo && (
                        <img
                            src={`https://ui-avatars.com/api/?name=${userName}&background=c7d2fe&color=3730a3&bold=true`}
                            alt=""
                            className="w-10 h-10 rounded-md"
                            width={40}
                            height={40}
                        />
                    )}
                    <div
                        className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
                    >
                        <div className="leading-4 w-32">
                            <h4 className="font-semibold text-ellipsis overflow-clip">
                                {userName}
                            </h4>

                        </div>
                        <button
                            className="rounded-full hover:bg-gray-100 w-8 h-8 relative hover:text-red-500"
                            title="Logout"
                            onClick={logOut}
                        >
                            <i className="fa-solid fa-power-off"></i>
                        </button>
                    </div>
                </div>
            </nav>
        </aside>
    );
}

// eslint-disable-next-line react/prop-types
function SidebarItem({icon, text, active, link, expanded}) {
    return (
        <Link
            to={link}
            className={`
        relative flex items-center ${expanded ? "" : "justify-center"} py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group h-10
        ${
                active
                    ? "bg-gradient-to-tr from-blue-200 to-blue-100 text-blue-800"
                    : "hover:bg-blue-50 text-gray-600"
            }
    `}
        >
            <i className={`${icon} w-5`}></i>
            {
                expanded ? <span className="ml-2">{text}</span> : ""
            }
        </Link>
    );
}

export default Navbar;