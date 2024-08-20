import { React } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const HeaderComponent = () => {
  const location = useLocation();
  const path = location.pathname.includes("parties", "calendar");
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
          <div>
            <h3>ICMS Application Demo</h3>
          </div>
          <div className="float-right">
            {path ? (
              <button
                className="btn btn-light"
                style={{ marginLeft: "1100px" }}
                onClick={(e) => handleLogout(e)}
              >
                logout
              </button>
            ) : (
              // <Link to="/" onClick={(e) => handleLogout(e)}>
              //   Home
              // </Link>
              ""
            )}
          </div>
        </nav>
      </header>
    </div>
  );
};

export default HeaderComponent;
