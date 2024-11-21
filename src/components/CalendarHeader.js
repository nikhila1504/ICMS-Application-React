import { bottom } from '@popperjs/core';
import React from 'react'
import { Link } from 'react-router-dom';

const CalendarHeader = () => {
    return (
        
        <nav className="navbar navbar-expand-md ml-0">
            <ul className="navbar navbar-nav">
                <li className="nav-item dropdown">
                    <h2> 
                    {/* <Link className="dropdown-item" to="/reports">
                                <i className="nav-link dropdown-toggle" style={{ color: 'black', fontSize: '20px', paddingRight: '5px' }}></i>
                                Calendar
                            </Link> */}
                         <Link
                        className="nav-link dropdown-toggle"
                        to="#"
                        id="calDropdown"
                        // role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false" 
                        style={{paddingBottom: '10px'}}
                    >
                        Calendar
                    </Link> 
                    </h2>
                    <div className="dropdown-menu" aria-labelledby="calDropdown">
                        <div className="dropdown-item">
                            <Link className="dropdown-item" to="/calendar/41">
                                <i className="pi pi-folder " style={{ color: 'black', fontSize: '20px', paddingRight: '5px' }}></i>
                                Calendar
                            </Link>
                           
                        </div>
                    </div> 
                </li>
            </ul>
        </nav>
    )
}

export default CalendarHeader;