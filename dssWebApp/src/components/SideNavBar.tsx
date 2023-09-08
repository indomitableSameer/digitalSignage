import { Link, Outlet } from "react-router-dom";
import "../App.css";
import Content from "../routes/Contents";
import { LocatonData, SidebarData } from "./SideBarData";

function SideNavBar() {
  return (
    <>
      <div className="flex-shrink-0 p-3" style={{ width: "280px" }}>
        <a
          href="/"
          className="d-flex align-items-center pb-3 mb-3 link-body-emphasis text-decoration-none border-bottom"
        >
          <svg className="bi pe-none me-2" width="30" height="24">
            <use xlinkHref="#bootstrap" />
          </svg>
          <span className="fs-5 fw-semibold">Digital Signage System</span>
        </a>
        <ul className="list-unstyled ps-0">
          <li className="mb-1">
            <button
              className="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#dashboard-collapse"
              aria-expanded="false"
            >
              Dashboard
            </button>
          </li>
          <li className="mb-1">
            <button
              className="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#orders-collapse"
              aria-expanded="false"
            >
              Locations
            </button>
            <div className="collapse" id="orders-collapse">
              <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                <li>
                  <button className="btn btn-toggle d-inline-flex align-items-center rounded border-0">
                    Add New
                  </button>
                </li>
                {LocatonData.map((item, index) => {
                  return (
                    <li>
                      <a key={index} className={item.cName}>
                        <span>{item.country}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </li>
          <li className="mb-1">
            <a className="d-inline-flex align-items-center rounded border-0">
              <Link to={`content`}>Content</Link>
            </a>
          </li>
          <li className="border-top my-3"></li>
          <li className="mb-1">
            <button
              className="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#account-collapse"
              aria-expanded="false"
            >
              Account
            </button>
            <div className="collapse" id="account-collapse">
              <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                <li>
                  <a
                    href="#"
                    className="link-body-emphasis d-inline-flex text-decoration-none rounded"
                  >
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}

export default SideNavBar;
