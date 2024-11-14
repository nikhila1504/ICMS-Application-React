import React from 'react'
import { Link } from 'react-router-dom';

const DataTableComponent = () => {
    return (
        // <div>NewClaimComponent</div>
        <nav className="navbar navbar-expand-md mt-3 ml-0">
            <ul className="navbar navbar-nav">
                <li className="nav-item dropdown">
                    <h2> <Link
                        className="nav-link dropdown-toggle"
                        to="#"
                        id="claimDropdown"
                        // role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false" 
                    >
                        Reports
                    </Link></h2>
                    <div className="dropdown-menu" aria-labelledby="claimDropdown">
                        <div className="dropdown-item">
                            <Link className="dropdown-item" to="/reports">
                                <i className="pi pi-folder " style={{ color: 'black', fontSize: '20px', paddingRight: '5px' }}></i>
                                User Productvity Report
                            </Link>
                           
                        </div>
                    </div>
                </li>
            </ul>
        </nav>
    )
}

export default DataTableComponent;