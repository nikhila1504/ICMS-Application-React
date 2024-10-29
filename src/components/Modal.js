import React from 'react';

const Modal = ({ isOpen, onClose, party }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        <h5>Party</h5>
        <button className="close-button" onClick={onClose} style={{ padding: '15px', backgroundColor: 'transparent' }}>&times;</button>
        <h5>Party Information</h5>
        {party && (
          <div>
            <p className='custom-label'>
              <span className='label'>Party Type:</span>
              <span className='value'>{party.partyType}</span>
            </p>
            <p className='custom-label'>
              <span className='label'>Party Name:</span>
              <span className='value'>{party.partyName}</span>
            </p>
            <h5>Address</h5>
            <p className='custom-label'>
              <span className='label'>Mailing Address1:</span>
              <span className='value'>{party.address1 || 'N/A'}</span>
            </p>
             <p className='custom-label'>
              <span className='label'>Mailing Address2:</span>
              <span className='value'>{party.address2 || 'N/A'}</span>
            </p>
             <p className='custom-label'>
              <span className='label'>City:</span>
              <span className='value'>{party.city || 'N/A'}</span>
            </p>
             <p className='custom-label'>
              <span className='label'>State:</span>
              <span className='value'>{party.state || 'N/A'}</span>
            </p>
             <p className='custom-label'>
              <span className='label'>Zip:</span>
              <span className='value'>{party.zip || 'N/A'}</span>
            </p>
            <h5>Contact</h5>
             <p className='custom-label'>
              <span className='label'>Preferred Contact Name:</span>
              <span className='value'>{party.contactName || 'N/A'}</span>
            </p>
             <p className='custom-label'>
              <span className='label'>Primary Email:</span>
              <span className='value'>{party.primaryEmail || 'N/A'}</span>
            </p>
             <p className='custom-label'>
              <span className='label'>Secondary Email:</span>
              <span className='value'>{party.secondaryEmail || 'N/A'}</span>
            </p>
             <p className='custom-label'>
              <span className='label'>Primary Phone:</span>
              <span className='value'>{party.primaryPhone || 'N/A'}</span>
            </p>
             <p className='custom-label'>
              <span className='label'>Secondary Phone:</span>
              <span className='value'>{party.secondaryPhone || 'N/A'}</span>
            </p>
          </div>
        )}
        {/* <button onClick={onClose}>Close</button> */}
      </div>
    </div>
  );
};

export default Modal;