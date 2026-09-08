import logo from "@/assets/images/logo.png";
import { useLayoutContext } from "@/context/useLayoutContext";
import AppMenu from "@/layouts/components/sidenav/components/AppMenu";
import UserProfile from "@/layouts/components/sidenav/components/UserProfile";
import { Link } from "react-router";
import { TbMenu4, TbX } from "react-icons/tb";
import SimpleBar from "simplebar-react";
import droneLogo from "../../../assets/images/drone logo.jpeg";
const Sidenav = () => {
  const { sidenav, hideBackdrop, changeSideNavSize } = useLayoutContext();
  const toggleSidebar = () => {
    changeSideNavSize(
      sidenav.size === "on-hover-active" ? "on-hover" : "on-hover-active"
    );
  };
  const closeSidebar = () => {
    const html = document.documentElement;
    html.classList.toggle("sidebar-enable");
    hideBackdrop();
  };
  return (
    <div className="sidenav-menu">
      <Link to="/" className="logo">
        <span className="logo logo-light" style={{ height: 70 }}>
          <span>
            <img
              src={droneLogo}
              alt="Drone Logo"
              style={{
                width: sidenav.size === "on-hover" ? "32px" : "140px",
                height: sidenav.size === "on-hover" ? "32px" : "70px",
                objectFit: "contain"
              }}
            />
          </span>
        </span>
      </Link>

      <button className="button-on-hover">
        <TbMenu4 onClick={toggleSidebar} className="fs-22 align-middle" />
      </button>

      <button className="button-close-offcanvas">
        <TbX onClick={closeSidebar} className="align-middle" />
      </button>

      <SimpleBar id="sidenav" className="scrollbar">
        {sidenav.user && <UserProfile />}
        <AppMenu />
      </SimpleBar>
    </div>
  );
};
export default Sidenav;
