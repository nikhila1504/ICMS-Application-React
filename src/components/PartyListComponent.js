import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup"; // To use <ConfirmPopup> tag
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import PartyService from "../services/party.service";

const PartyListComponent = () => {
  const [Parties, setPartys] = useState([]);
  const navigate = useNavigate();

  const handleSelectId = (id) => {
    navigate(`/calendar/${id}`);
  };

  useEffect(() => {
    getAllParties();
  }, []);

  const confirmDelete = (event, id) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Do you want to delete Party id?",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: () => deleteParty(id),
      reject: null,
    });
  };

  const getAllParties = () => {
    PartyService.getAllParties()
      .then((response) => {
        setPartys(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const deleteParty = (id) => {
    PartyService.deleteParty(id)
      .then((response) => {
        getAllParties();
      })
      .catch((error) => {
        console.log(error.message.includes("403"));
        if (error.message.includes("403")) {
          return toast.error("Only admin have rights to delete party", {
            position: "top-center",
          });
        }
        console.log(error);
      });
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Party List</h2>
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px',marginLeft:'131px' }}>
        <Link to="/add-Party" className="heading btn btn-outline-info">
          Add Party
        </Link>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <table className="table table-striped table-bordered table-custom" style={{ width: '80%', maxWidth: '11000px' }}>
          <thead>
            <tr>
              <th>Party Id</th>
              <th>Party Name</th>
              <th>Party Type</th>
              <th>Email Id</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Parties.map((Party) => (
              <tr key={Party.id}>
                <td>{Party.id}</td>
                <td>
                  <Link className="link" to={`/edit-Party/${Party.id}`}>
                    {Party.name}
                  </Link>
                </td>
                <td>{Party.partyType}</td>
                <td>{Party.emailId}</td>
                <td style={{ textAlign: 'left' }}>
                  <Link
                    className="btn btn-info"
                    to={`/wc1/${Party.id}`}
                    style={{ marginRight: '10px' }}
                  >
                    WC1-Form
                  </Link>
                  <button
                    onClick={(e) => confirmDelete(e, Party.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                  <ToastContainer />
                  <ConfirmPopup />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartyListComponent;
