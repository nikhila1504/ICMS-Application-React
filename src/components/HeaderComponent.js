import { React } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const HeaderComponent = () => {
  const location = useLocation();
  const path = location.pathname.includes("parties");
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
            <h2>ICMS Application</h2>
          </div>
          <div className="float-right">
            {path ? (
              <button
                className="btn btn-light"
                style={{ marginLeft: "900px" }}
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
