import SideNavBar from "./components/SideNavBar";
import "./App.css";
import { Outlet } from "react-router";

function App() {
  return (
    <div>
      <SideNavBar />
      <Outlet />
    </div>
  );
}

export default App;
