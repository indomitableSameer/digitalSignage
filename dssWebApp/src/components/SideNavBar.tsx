import "../App.css";

function SideNavBar() {
  return (
    <div className="container-fluid">
      <div className=" row">
        <div className="col-auto col-sm-2 bg-dark d-flex flex-column justify-content-between min-vh-100">
          <div>
            <a className="text-decoration-none ms-4 d-flex align-items-center text-white d-none d-sm-inline">
              <span className="fs-4">DSS</span>
            </a>
          </div>
          <div className="dropdown open">
            <a
              className="btn border-none dropdown-toggle text-white"
              type="button"
              id="triggerId"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="bi bi-person fs-4"></i>
              <span className="fs-4 ms-3">Profile</span>
            </a>
            <div className="dropdown-menu" aria-labelledby="triggerId">
              <a className="dropdown-item" href="#">
                Action
              </a>
              <a className="dropdown-item disabled" href="#">
                Disabled action
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideNavBar;
