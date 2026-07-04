import { useLayoutContext } from "@/context/useLayoutContext";
import ThemeToggler from "@/layouts/components/topbar/components/ThemeToggler";
import UserProfile from "@/layouts/components/topbar/components/UserProfile";
import { Link } from "react-router";
import { Container, FormControl } from "react-bootstrap";
import { LuSearch } from "react-icons/lu";
import { TbMenu4 } from "react-icons/tb";
import FullscreenToggle from "@/layouts/components/topbar/components/FullscreenToggle";
import MonochromeThemeModeToggler from "@/layouts/components/topbar/components/MonochromeThemeModeToggler";

const Topbar = () => {
  const { sidenav, changeSideNavSize, showBackdrop } = useLayoutContext();
  const toggleSideNav = () => {
    const html = document.documentElement;
    const currentSize = html.getAttribute("data-sidenav-size");
    if (currentSize === "offcanvas") {
      html.classList.toggle("sidebar-enable");
      showBackdrop();
    } else if (sidenav.size === "compact") {
      changeSideNavSize(
        currentSize === "compact" ? "condensed" : "compact",
        false
      );
    } else {
      changeSideNavSize(currentSize === "condensed" ? "default" : "condensed");
    }
  };

  return (
    <header className="app-topbar">
      <Container fluid className="topbar-menu">
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={toggleSideNav}
            className="sidenav-toggle-button btn btn-default btn-icon"
          >
            <TbMenu4 className="fs-22" />
          </button>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div className="app-search d-none d-xl-flex me-2">
            <FormControl
              type="search"
              className="topbar-search rounded-pill"
              name="search"
              placeholder="Quick Search..."
            />
            <LuSearch className="app-search-icon text-muted" />
          </div>

          <ThemeToggler />

          <FullscreenToggle />

          <MonochromeThemeModeToggler />

          <UserProfile />
        </div>
      </Container>
    </header>
  );
};
export default Topbar;
