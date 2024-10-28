import { React } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
  <header>
    <nav className="navbar navbar-expand-md">
      <div className="container-fluid">
        <h2 className="navbar-brand" style={{ color: 'black', fontSize: '20px', paddingTop: '15px' }}>
          WC-1, Employers First Report of Injury
        </h2>

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
