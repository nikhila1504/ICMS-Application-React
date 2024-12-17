import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NewClaimComponent from "./NewClaimComponent.js";
import { useNavigate } from "react-router-dom";
import DataTableComponent from "./DataTableComponent.js";

const NewWc1 = () => {
    const [filerType, setFilerType] = useState('');
    const navigate = useNavigate();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/newClaim");
    };

    return (
        <div className="form-container-ncc" style={{ position: 'relative', minHeight: '100vh' }}>
            <DataTableComponent />
            <div className="d-flex justify-content-center align-items-center" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: '600px' }}>
                <div className="card p-4" style={{ width: '100%' }}>
                    <h2 className="text-center mb-4">WC-1 Form</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label" style={{ fontSize: '12px', paddingLeft: '10px' }}>
                                <b>Attorney for Employee/Claimant cannot file a WC-1.<br />
                                This WC-1 has been filed on behalf of the</b>
                            </label>
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <input
                                        type="radio"
                                        id="employer"
                                        name="filerType"
                                        value="Employer"
                                        checked={filerType === 'Employer'}
                                        onChange={(e) => setFilerType(e.target.value)}
                                    />
                                    <label htmlFor="employer" className="ms-2 custom-label-NWC">Employer</label>
                                </li>
                                <li className="list-group-item">
                                    <input
                                        type="radio"
                                        id="insurer"
                                        name="filerType"
                                        value="Insurer"
                                        checked={filerType === 'Insurer'}
                                        onChange={(e) => setFilerType(e.target.value)}
                                    />
                                    <label htmlFor="insurer" className="ms-2 custom-label-NWC">Insurer</label>
                                </li>
                                <li className="list-group-item">
                                    <input
                                        type="radio"
                                        id="employerAndInsurer"
                                        name="filerType"
                                        value="Employer and Insurer"
                                        checked={filerType === 'Employer and Insurer'}
                                        onChange={(e) => setFilerType(e.target.value)}
                                    />
                                    <label htmlFor="employerAndInsurer" className="ms-2 custom-label-NWC">Employer and Insurer</label>
                                </li>
                            </ul>
                        </div>
                        <div className="row mt-4">
          <div className="col-12 d-flex justify-content-center flex-wrap flex-md-nowrap">
            <div className="mx-1">
              <button className="btn  btn-lg custom-btn">
              <i className="pi pi-arrow-right" ></i> Continue
                  {/* <i className="pi pi-angle-double-right" ></i> Continue */}
                  {/* <i className="pi pi-chevron-right" ></i> Continue */}
              </button>
            </div>
            </div>
            </div>
                        {/* <div className="text-center mb-3">
                            <button type="submit" className="btn btn-info" style={{ fontSize: '15px' }}>Continue</button>
                        </div> */}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewWc1;