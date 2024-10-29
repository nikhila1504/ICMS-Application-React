import React from 'react'
import { Link } from 'react-router-dom';

const NewClaimComponent = () => {
    return (
        // <div>NewClaimComponent</div>
        <nav className="navbar navbar-expand-md mt-3 ml-0">
            <ul className="navbar navbar-nav">
                <li className="nav-item dropdown">
                    <h2> <Link
                        className="nav-link dropdown-toggle"
                        to="#"
                        id="claimDropdown"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false" 
                    >
                        Claim
                    </Link></h2>
                    <div className="dropdown-menu" aria-labelledby="claimDropdown">
                        <div className="dropdown-item">
                            <Link className="dropdown-item" to="#">
                                <i className="pi pi-folder " style={{ color: '#b6dde5', fontSize: '20px', paddingRight: '5px' }}></i>
                                File New Claim
                            </Link>
                            <div className="submenu">
                                <h2> <Link className="dropdown-item" to="/newWc1" style={{padding:'10px 10px'}}>
                                    <i className="pi pi-file " style={{ color: '#b6dde5', fontSize: '20px', paddingRight: '10px' }}></i>
                                    WC1 Form
                                </Link></h2>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </nav>
    )
}

export default NewClaimComponent;