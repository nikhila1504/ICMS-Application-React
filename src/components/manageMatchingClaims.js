import React from 'react'
import { Message } from 'primereact/message';
import { InputText } from 'primereact/inputtext';
import DataTableComponent from "./DataTableComponent.js";

const manageMatchingClaims = () => {
    return (
        
        <div>
            <DataTableComponent />
            <h1 className="custom-h1 header" style={{ marginTop: '5px' }}>WC-1, Employers First Report of Injury</h1>
        </div>
    )
}

export default manageMatchingClaims