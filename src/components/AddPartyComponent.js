import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import PartyService from "../services/party.service";

const AddPartyComponent = () => {
  const [name, setName] = useState("");
  const [partyType, setPartyType] = useState("");
  const [emailId, setEmailId] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const options = [
    { value: "Attorney", label: "Attorney" },
    { value: "Claims Office", label: "Claims Office" },
    { value: "Insurer", label: "Insurer" },
    { value: "Employer", label: "Employer" },
  ];

  const saveOrUpdateParty = (e) => {
    e.preventDefault();
    const party = { id, name, partyType, emailId };
    if (id) {
      PartyService.updateParty(id, party)
        .then((response) => {
          navigate("/parties");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      PartyService.createParty(party)
        .then((response) => {
          console.log(response.data);

          navigate("/parties");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    PartyService.getPartyById(id)
      .then((response) => {
        setName(response.data.name);
        setPartyType(response.data.partyType);
        setEmailId(response.data.emailId);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const title = () => {
    if (id) {
      return <h2 className="text-center">Update Party</h2>;
    } else {
      return <h2 className="text-center">Add Party</h2>;
    }
  };

  return (
    <div>
      <br />
      <br />
      <div className="container">
        <div className="row">
          <div className="card col-md-6 offset-md-3 offset-md-3">
            {title()}
            <div className="card-body">
              <form>
                <div className="form-group mb-2">
                  <label className="form-label"> Party Name :</label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    name="name"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '625px', height: '40px', fontSize: '16px' }} 
                  ></input>
                </div>
                <div className="pt form-group mb-2">
                  <label className="form-label"> Party Type :</label>
                  <Select
                    className="select"
                    options={options}
                    value={options.filter((e) => {
                      return (
                        String(e.value) === String({ partyType }.partyType)
                      );
                    })}
                    onChange={(e) => setPartyType(e.value)}
                  />

                  {/* <input
                    type="text"
                    placeholder="Enter Party Type"
                    name="partyType"
                    className="form-control"
                    value={partyType}
                    onChange={(e) => setPartyType(e.target.value)}
                  ></input> */}
                </div>
                <div className="form-group mb-2">
                  <label className="form-label"> Email Id :</label>
                  <input
                    type="email"
                    placeholder="Enter email Id"
                    name="emailId"
                    className="form-control"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    style={{ width: '625px', height: '40px', fontSize: '16px' }} 
                  ></input>
                </div>
                <button
                  className="btn btn-outline-success"
                  onClick={(e) => saveOrUpdateParty(e)}
                  style={{ marginTop: '10px' }}
                >
                  Submit
                </button>
                &nbsp;&nbsp;
                <Link to="/parties" className="btn btn-outline-danger" style={{ marginTop: '10px' }}>
                  Cancel
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPartyComponent;
