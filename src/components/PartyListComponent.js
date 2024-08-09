import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup"; // To use <ConfirmPopup> tag
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import PartyService from "../services/party.service";

const PartyListComponent = () => {
  const [Parties, setPartys] = useState([]);

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
          // return (
          //   <Alert variant="danger">
          //     <Alert.Heading>
          //       Only admin have rights to delete party
          //     </Alert.Heading>
          //   </Alert>
          // );
          //alert("Only admin have rights to delete party");
        }
        console.log(error);
      });
  };

  return (
    <div>
      <h2 className="text-center">Party List</h2>
      <Link to="/add-Party" className="heading btn btn-outline-info mb-2">
        Add Party
      </Link>

      <table className="table table-striped table-bordered">
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
              <br></br>
              <Link className="link" to={`/edit-Party/${Party.id}`}>
                <td>{Party.name}</td>
              </Link>
              <td>{Party.partyType}</td>
              <td>{Party.emailId}</td>
              <td>
                {/* <Link
                  className="btn btn-outline-info"
                  to={`/edit-Party/${Party.id}`}
                >
                  Update
                </Link> */}
                <ToastContainer />
                <ConfirmPopup />
                <button
                  onClick={(e) => confirmDelete(e, Party.id)}
                  icon="pi pi-times"
                  label="Delete"
                  className="btn btn-outline-danger"
                  style={{ marginLeft: "10px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PartyListComponent;
