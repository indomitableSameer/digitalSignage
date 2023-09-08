import { Outlet } from "react-router-dom";
import SideNavBar from "../components/SideNavBar";

export default function Root() {
  return (
    <>
      <SideNavBar />
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
