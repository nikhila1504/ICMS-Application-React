import { React } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from '../sbwc_logo.gif'; // Tell webpack this JS file uses this image
import icmslogo from '../icms_logo.gif'; // Tell webpack this JS file uses this image

const HeaderComponent = () => {
  const location = useLocation();
  const path = location.pathname.includes("wc1");
  const navigate = useNavigate();
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      setTimeout(() => {
        console.log(error);
      }, 5000);
    }
  };
  return (
<div>
<img src={logo} alt="Logo" /><img src={icmslogo} alt="Logo" style={{ marginLeft: '800px'}}/>
  <header>
    <nav className="navbar navbar-expand-md">
      <div className="container-fluid">
        

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="ms-auto">
            {path ? (
              <button
                className="btn btn-secondary"
                onClick={(e) => handleLogout(e)}
                style={{ fontSize: '15px', minWidth: '100px' }}
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  </header>
</div>

  );
};

export default HeaderComponent;
