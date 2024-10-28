import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NewClaimComponent from "./NewClaimComponent.js";

const NewWc1 = () => {
    const [filerType, setFilerType] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Form submitted: ${filerType}`);
    };

    return (
        <div className="form-container-ncc">
            <NewClaimComponent />
            <div className="container d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="card p-4" style={{ width: '600px', height: '300px' }}>
                    <h2 className="text-center mb-4">WC-1 Form</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Filer Type</label>
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
                        <div className="text-center mb-3">
                            <button type="submit" className="btn btn-info" style={{ fontSize: '15px' }}>Continue</button></div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewWc1;