import { useLocation, useNavigate } from "react-router-dom";
import logo from '../sbwc_logo.gif';
import icmslogo from '../icms_logo.gif';
import { Link } from 'react-router-dom';

const DataTableComponent = () => {
    const location = useLocation();
    const path = location.pathname.includes("reports") ||  location.pathname.includes("wc1") ||  location.pathname.includes("calendarList");
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            localStorage.removeItem("token");
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
                <img src={icmslogo} alt="ICMS Logo" className="icms-logo" />
            </div>
            <nav className="navbar navbar-expand-md">
                {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button> */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        {/* Reports Section */}
                        <li className="nav-item dropdown">
                            <h2>
                                <Link
                                    className="nav-link dropdown-toggle"
                                    to="#"
                                    id="claimDropdown"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                // style={{ paddingBottom: '10px' }}
                                >
                                    Reports
                                </Link>
                            </h2>
                            <div className="dropdown-menu" aria-labelledby="claimDropdown">
                                <div className="dropdown-item">
                                    <Link className="dropdown-item" to="/reports">
                                        <i className="pi pi-folder" style={{ color: 'black', fontSize: '20px', paddingRight: '5px' }}></i>
                                        User Productivity Report
                                    </Link>
                                </div>
                            </div>
                        </li>

                        {/* Calendar Section */}
                        <li className="nav-item dropdown">
                            <h2>
                                <Link
                                    className="nav-link dropdown-toggle"
                                    to="#"
                                    id="calDropdown"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                    style={{ paddingBottom: '10px' }}
                                >
                                    Calendar
                                </Link>
                            </h2>
                            <div className="dropdown-menu" aria-labelledby="calDropdown">
                                <div className="dropdown-item">
                                    <Link className="dropdown-item" to="/calendarList">
                                        <i className="pi pi-folder" style={{ color: 'black', fontSize: '20px' }}></i>
                                        Calendar
                                    </Link>
                                </div>
                            </div>
                        </li>
                        {/* </ul>
                <ul className="navbar-nav">                         */}
                        {/* //</div>style={{    
                                        // marginLeft: '70%'
                                    //}}       */}
                        {/* <li className="nav-item ml-auto ml-button" style={{marginLeft:'70%'}}>
                            {path && (
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleLogout}
                                    style={{
                                        fontSize: '15px',
                                        maxWidth: '200px',
                                        marginBottom: '12px',marginTop: '12px',color:'black'
                                    }}
                                >
                                    <i className="pi pi-sign-out"></i> Logout
                                </button>
                            )}
                        </li> */}

                        <div className="ms-auto">
                            {path ? (
                                <button
                                    className="btn"
                                    onClick={(e) => handleLogout(e)}
                                    style={{ fontSize: '15px', minWidth: '100px',color: 'white' }}
                                >
                                    <i className="pi pi-sign-out" ></i> Logout
                                </button>
                            ) : null}
                        </div>
                    </ul>
                </div>
            </nav>

        </div>
    );
};

export default DataTableComponent;