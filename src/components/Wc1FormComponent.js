import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PickList } from 'primereact/picklist';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Link } from "react-router-dom";
import NewClaimComponent from "./NewClaimComponent.js";
import Modal from './Modal.js';

const Wc1FormComponent = () => {
  const Pagination = ({ className, currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange }) => {
    return (
      <div className={`pagination-container d-flex justify-content-${className} mb-3`}>
        <select className="form-select custom-select" style={{ width: '50px', fontSize: '14px', padding: '5px'  }}
          value={itemsPerPage} onChange={(e) => onItemsPerPageChange(Number(e.target.value))}>
          {[2, 4, 6, 8].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>

        <button
          className="btn btn-outline-info btn-sm  mx-1"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span style={{ marginTop: "5px" }}>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className="btn btn-outline-info btn-sm mx-1"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };
  const WidePagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
      <div className="pagination-container d-flex justify-content-center mb-3">
        <button
          className="btn btn-outline-primary btn-sm mx-2"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          First
        </button>
        <button
          className="btn-primary mx-2"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="mx-2">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className="btn btn-primary mx-2"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          className="btn btn-primary mx-2"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>
    );
  };

  const headerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [source, setSource] = useState([]);
  const [target, setTarget] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [fileUrl, setFileUrl] = useState(null);
  const [docToDelete, setDocToDelete] = useState(null);
  const [viewVisible, setViewVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [hasToggledMedicalInjury, setHasToggledMedicalInjury] = useState(false);
  const toast = React.useRef(null);
  const [clicked, setClicked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);

  const openModal = (party) => {
    console.log("Opening modal for party:", party);
    setSelectedParty(party);
    setIsModalOpen(true);
    console.log("Modal state after opening:", isModalOpen, selectedParty);
  };

  const closeModal = () => {
    console.log("Closing modal");
    setIsModalOpen(false);
    setSelectedParty(null);
    console.log("Modal state after closing:", isModalOpen, selectedParty);
  };
  useEffect(() => {
    console.log("Modal state after opening:", isModalOpen);
  }, [isModalOpen]);

  useEffect(() => {
    console.log("Selected party:", selectedParty);
  }, [selectedParty]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newDocument = { id: documents.length + 1, name: file.name, fileUrl: url };
      setDocuments([...documents, newDocument]);
      toast.current.show({ severity: 'success', summary: 'File Uploaded', detail: file.name, life: 3000, style: { backgroundColor: '#b6dde5', color: '#FFFFFF', color: 'black' }, });
      event.target.value = null;
    }
  };
  const hideViewModal = () => {
    setViewVisible(false);
    setFileUrl(null);
  };
  const confirmDelete = () => {
    setDocuments(documents.filter(doc => doc.id !== docToDelete));
    toast.current.show({ severity: 'warn', summary: 'Document Deleted', detail: `Deleted ID ${docToDelete}`, life: 3000, style: { backgroundColor: '#dd4f4f', color: '#FFFFFF', color: 'black' }, });
    setDeleteVisible(false);
    setDocToDelete(null);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button label="View" onClick={() => {
          setFileUrl(rowData.fileUrl);
          setViewVisible(true);
        }} className="p-button-info" style={{ marginRight: '10px', marginBottom: '10px', marginTop: '10px' }} />
        <Button label="Delete" onClick={() => {
          setDocToDelete(rowData.id);
          setDeleteVisible(true);
        }} className="p-button-danger" style={{ marginRight: '10px', marginBottom: '10px', marginTop: '10px' }} />
      </>
    );
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleInitial: '',
    birthdate: '',
    gender: 'Male',
    NoOfDays: '',
    insurerFile: '',
    jobClssifiedCodeNo: '',
    hiredDate: '',
    wageRate: '',
    daysOff: 'Yes',
    wageRateFrequency: 'perHour',
    outOfCountryAddress: '',
    mailingAddress1: '',
    mailingAddress2: '',
    city: '',
    state: '',
    zip: '',
    email: '',
    phoneNumber: '',
    naicsCode: '',
    dateOfInjury: '',
    timeOfInjury: '',
    countyOfInjury: '',
    dateEmployerKnowledge: '',
    firstDateFailed: '',
    fullPayOnDate: 'Yes',
    occurredOnPremises: 'Yes',
    injuryType: '',
    bodyPartAffected: [],
    howOccurred: '',
    tPhysicianAddress: '',
    tPhysicianName: '',
    tPhysicianPhoneExt: '',
    PhysicianPhone: '',
    tPhysicianZIPExt: '',
    PhysicianZIP: '',
    tPhysicianState: '',
    tPhysicianCity: '',
    tPhysicianAddress2: '',
    tPhysicianAddress1: '',
    initialTreatment: '',
    treatingFacility: '',
    treatingFacilityAddress1: '',
    treatingFacilityAddress2: '',
    treatingFacilityCity: '',
    treatingFacilityState: '',
    treatingFacilityZIP: '',
    treatingFacilityZIPExt: '',
    hospitalPhone: '',
    hospitalPhoneExt: '',
    RtwDate: '',
    ReturnedWagePerWeek: '',
    FatalDeathDate: '',
    reportPreparedBy: '',
    telePhoneNumber: '',
    telePhoneExt: '',
    DateOfReport: '',
    benifitsBeingPaid: '',
    convertType: '',
    BenifitsNPReasons: '',
    isIncomeBenefitsEnabled: false,
    isControvertEnabled: false,
    isMedicalInjuryEnabled: false,
    indemnityEnabaled: false,
    document: null,
  });

  const [parties, setParties] = useState([
    { partyType: 'Claimant', partyName: 'TEST A', parentParty: 'Parent 1', selfInsured: 'Yes', selfAdministered: 'No', groupFundMember: 'No' },
    { partyType: 'Employer', partyName: 'TEST B', parentParty: 'Parent 2', selfInsured: 'No', selfAdministered: 'Yes', groupFundMember: 'No' },
    { partyType: 'Attorney', partyName: 'Party C', parentParty: 'Parent 3', selfInsured: 'Yes', selfAdministered: 'No', groupFundMember: 'Yes' },
    { partyType: 'AParty', partyName: 'Party D', parentParty: 'Parent 4', selfInsured: 'No', selfAdministered: 'No', groupFundMember: 'Yes' },

  ]);

  const handleCheckboxChange = () => {
    setFormData((prev) => {
      if (prev.isIncomeBenefitsEnabled) {
        return {
          ...prev,
          isIncomeBenefitsEnabled: false,
          benifitsBeingPaid: '',
          averageWeeklyWage: '',
          weeklyBenifit: '',
          DateOfDisablity: '',
          DateOFFirstPayment: '',
          CompensationPaid: '',
          penalityPaid: '',
          BenifitsPayableByDate: '',
          BenifitsPAyableFor: '',
          payBenifitUntil: '',
        };
      } else {
        return { ...prev, isIncomeBenefitsEnabled: true };
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // setFormData({ ...formData, [name]: value });
    // setAmount(e.target.value.replace(/[^0-9.]/g, '');
    setFormData({ ...formData, [name]: name === 'ReturnedWagePerWeek' ? value.replace(/[^0-9.]/g, '') : value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleBlur = () => {
    setFormData((prev) => ({
      ...prev,
      ReturnedWagePerWeek: prev.ReturnedWagePerWeek ? parseFloat(prev.ReturnedWagePerWeek).toFixed(2) : '',
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = [
        'Abdomen Including Groin',
        'Ankle',
        'Artificial Appliance',
        'Wrist',
        'Whole Body',
      ];
      setSource(data);
    };
    fetchData();
  }, []);


  const itemTemplate = (item) => {
    return (
      <div>
        <div>
          <span className="font-bold" style={{ fontSize: '15px' }}>{item}</span>
        </div>
      </div>
    );
  };


  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log('Form Submitted:', formData);

  //   const allRequiredFieldsFilled = checkRequiredFields(formData);
  //   const isBodyPartAffectedEmpty = !formData.bodyPartAffected || formData.bodyPartAffected.length === 0;

  //   console.log("isBodyPartAffectedEmpty", isBodyPartAffectedEmpty);

  //   if (allRequiredFieldsFilled || isBodyPartAffectedEmpty) {
  //     console.log("in If - Form Not Submitted");
  //     setErrors((prev) => ({
  //       ...prev,
  //       bodyPartAffected: 'Please select at least one body part affected.',
  //     }));
  //     setIsActive(true);
  //     return;
  //   }

  //   console.log("Form is valid. Proceeding with submission...");
  //   setIsActive(false);
  //   // Add submission logic (API call)
  //   setFormData({});
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    handleInvalid();
    if (Object.keys(errors).some((key) => errors[key])) {
      console.log("Form not submitted due to errors");
      return;
    }
    setIsActive(false);
    console.log("Form is valid. Proceeding with submission...");
    setFormData({});
  };

  // const onChange = (event) => {
  //   setSource(event.source);
  //   setTarget(event.target);
  //   if (event.target.length > 0) {
  //     setErrors(prev => ({ ...prev, bodyPartAffected: false }));
  //   }
  // };

  const onChange = (event) => {
    const { source, target } = event;
    const { name, value } = event.target;
    setSource(event.source);
    setTarget(event.target);

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      bodyPartAffected: target,
    }));
    console.log('Source:', source);
    console.log('Target:', target);

    if (target.length > 0) {
      setErrors(prev => ({ ...prev, bodyPartAffected: false }));
    } else {
      setErrors(prev => ({ ...prev, bodyPartAffected: true }));
    }
  };
  const [errors, setErrors] = useState({
    bodyPartAffected: false,
  });


  const handleInvalid = () => {
    const allRequiredFieldsFilled = checkRequiredFields(formData);
    const isBodyPartAffectedEmpty = !formData.bodyPartAffected || formData.bodyPartAffected.length === 0;

    // Open the collapsible if any required fields are empty or bodyPartAffected is empty
    if (!allRequiredFieldsFilled || isBodyPartAffectedEmpty) {
      if (isBodyPartAffectedEmpty) {
        setErrors((prev) => ({
          ...prev,
          bodyPartAffected: 'Please select at least one body part affected.',
        }));
      }
      setIsActive(true); // Open the collapsible
    }
  };
  const checkRequiredFields = (data) => {
    return (
      data.dateOfInjury &&
      data.countyOfInjury &&
      data.injuryType &&
      data.howOccurred
    );
  };
  const totalPages = Math.ceil(parties.length / itemsPerPage);
  const paginatedParties = parties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="form-container">
      <NewClaimComponent />
      <h1 className="custom-h1 header mt-3">Claimant Information</h1>
      <form onSubmit={handleSubmit} onInvalid={handleInvalid}>
        <div className="d-flex flex-wrap">
          <div className="form-section  flex-fill">

            <div className="form-group row mb-1">
              <label htmlFor="firstName" className="col-md-4 col-form-label custom-label ">Employee First Name: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-md-6">
                <input autoComplete="off"
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group row mb-1">
              <label htmlFor="lastName" className="col-md-4 col-form-label custom-label">Employee Last Name: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-md-6">
                <input autoComplete="off"
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group row mb-1">
              <label htmlFor="middleInitial" className="col-md-4 col-form-label custom-label">M.I.:</label>
              <div className="col-md-6">
                <input autoComplete="off"
                  type="text"
                  className="form-control"
                  id="middleInitial"
                  name="middleInitial"
                  value={formData.middleInitial}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group row mb-1">
              <label htmlFor="birthdate" className="col-md-4 col-form-label custom-label">Birthdate:</label>
              <div className="col-md-3">
                <input autoComplete="off"
                  type="date"
                  className="form-control"
                  id="birthdate"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  onFocus={(e) => e.target.showPicker()}
                />
              </div>
            </div>
            <div className="form-group row mb-1">
              <label className="col-md-4 col-form-label custom-label">Gender: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-md-6 custom-radio">
                <div>
                  <div className="form-check form-check-inline">
                    <input autoComplete="off"
                      className="form-check-input "
                      type="radio"
                      name="gender"
                      id="genderMale"
                      value="Male"
                      style={{ marginTop: "14px" }}
                      checked={formData.gender === 'Male'}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="genderMale">Male</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input autoComplete="off"
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="genderFemale"
                      value="Female"
                      style={{ marginTop: "14px" }}
                      checked={formData.gender === 'Female'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="genderFemale">Female</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input autoComplete="off"
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="genderUnknown"
                      style={{ marginTop: "14px" }}
                      value="Unknown"
                      checked={formData.gender === 'Unknown'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="genderUnknown">Unknown</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section flex-fill pl-3">
            {/* <form onSubmit={handleSubmit}> */}
            <div className="form-group row mb-1">
              <label htmlFor="outOfCountryAddress" className="col-md-4 col-form-label custom-label">Out of Country Address:</label>
              <div className="col-md-6">
                <input autoComplete="off"
                  type="text"
                  className="form-control"
                  id="outOfCountryAddress"
                  name="outOfCountryAddress"
                  value={formData.outOfCountryAddress}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group row mb-1">
              <label htmlFor="mailingAddress1" className="col-md-4 col-form-label custom-label">Mailing Address1: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-md-6">
                <input autoComplete="off"
                  type="text"
                  className="form-control"
                  id="mailingAddress1"
                  name="mailingAddress1"
                  value={formData.mailingAddress1}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group row mb-1">
              <label htmlFor="mailingAddress2" className="col-md-4 col-form-label custom-label">Mailing Address2:</label>
              <div className="col-md-6">
                <input autoComplete="off"
                  type="text"
                  className="form-control"
                  id="mailingAddress2"
                  name="mailingAddress2"
                  value={formData.mailingAddress2}
                  onChange={handleChange}

                />
              </div>
            </div>
            <div className="form-group row mb-1">
              <label htmlFor="city" className="col-md-4 col-form-label custom-label">City: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-md-6">
                <input autoComplete="off"
                  type="text"
                  className="form-control"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group row mb-1">
              <label htmlFor="state" className="col-md-4 col-form-label custom-label">State: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-md-6">
                <input autoComplete="off"
                  type="text"
                  className="form-control"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group row mb-1">
              <label htmlFor="zip" className="col-md-4 col-form-label custom-label">Zip: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-md-6">
                <input autoComplete="off"
                  type="text"
                  className="form-control"
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group row mb-1">
              <label htmlFor="email" className="col-md-4 col-form-label custom-label">Employee E-mail:</label>
              <div className="col-md-6">
                <input autoComplete="off"
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group row mb-1">
              <label htmlFor="phoneNumber" className="col-md-4 col-form-label custom-label">Phone Number:</label>
              <div className="col-md-6">
                <input autoComplete="off"
                  type="text"
                  className="form-control"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* <div className="text-center">
              <button className="btn btn-outline-info" style={{ fontSize: "15px" }}>Submit</button>
            </div> */}
            {/* </form> */}
          </div>
        </div>
        <div>
          <h1 className="custom-h1  header ">Party Information</h1>
          <table className="table table-custom table-striped table-bordered w-100">
            <thead className="thead-light">
              <tr>
                <th>Party Type</th>
                <th>Party Name</th>
                <th>Parent Party</th>
                <th>Self Insured</th>
                <th>Self Administered</th>
                <th>Group Fund Member</th>
              </tr>
            </thead>
            <tbody>
              {paginatedParties.map((party, index) => (
                <tr key={index}>
                  <td>{party.partyType}</td>
                  <td><a href="#" onClick={(e) => { e.preventDefault(); openModal(party); }}>{party.partyName}</a></td>
                  <td>{party.parentParty}</td>
                  <td>{party.selfInsured}</td>
                  <td>{party.selfAdministered}</td>
                  <td>{party.groupFundMember}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {isModalOpen && <Modal isOpen={isModalOpen} onClose={closeModal} party={selectedParty} />}
          <Pagination
            className="center"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
        <div>
          <h1 className="custom-h1  header">Employment/Wage</h1>
          <div className="d-flex flex-wrap">
            <div className="form-section  flex-fill">
              {/* <form onSubmit={handleSubmit}> */}
              <div className="form-group row mb-1">
                <label htmlFor="hiredDate" className="col-sm-4 col-form-label custom-label">Date Hired by Employer :</label>
                <div className="col-md-4">
                  <input autoComplete="off"
                    type="date"
                    className="form-control"
                    id="hiredDate"
                    name="hiredDate"
                    value={formData.hiredDate}
                    onChange={handleChange}
                    onFocus={(e) => e.target.showPicker()}
                  />
                </div>
              </div>
              <div className="form-group row mb-1">
                <label htmlFor="jobClssifiedCodeNo" className="col-sm-4 col-form-label custom-label">Job Classified Code No :</label>
                <div className="col-md-4">
                  <input autoComplete="off"
                    type="text"
                    className="form-control"
                    id="jobClssifiedCodeNo"
                    name="jobClssifiedCodeNo"
                    value={formData.jobClssifiedCodeNo}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group row mb-1">
                <label htmlFor="insurerFile" className="col-sm-4 col-form-label custom-label">Insurer/Self Insurer File# :</label>
                <div className="col-md-4">
                  <input autoComplete="off"
                    type="text"
                    className="form-control"
                    id="insurerFile"
                    name="insurerFile"
                    value={formData.insurerFile}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* </form> */}
            </div>
            <div className="form-section flex-fill pl-3">
              {/* <form onSubmit={handleSubmit}> */}
              <div className="form-group row mb-1">
                <label htmlFor="NoOfDays" className="col-sm-5 col-form-label custom-label">Number of Days Worked Per Week:<span style={{ color: 'red' }}>*</span></label>
                <div className="col-md-4">
                  <input autoComplete="off"
                    type="text"
                    className="form-control"
                    id="NoOfDays"
                    name="NoOfDays"
                    value={formData.NoOfDays}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group row mb-1 custom-radio">
                <label className="col-md-5 col-form-label custom-label">Do you have any days Off?<span style={{ color: 'red' }}>*</span></label>
                <div className="col-md-6">
                  <div>
                    <div className="form-check form-check-inline">
                      <input autoComplete="off"
                        className="form-check-input"
                        type="radio"
                        name="daysOff"
                        id="daysOffYes"
                        value="Yes"
                        style={{ marginTop: "14px" }}
                        checked={formData.daysOff === 'Yes'}
                        onChange={handleChange}
                        required
                      />
                      <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="daysOffYes">Yes</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input autoComplete="off"
                        className="form-check-input"
                        type="radio"
                        name="daysOff"
                        id="daysOffNo"
                        value="No"
                        style={{ marginTop: "14px" }}
                        checked={formData.daysOff === 'No'}
                        onChange={handleChange}
                        required
                      />
                      <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="daysOffNo">No</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group row mb-1">
                <label htmlFor="wageRate" className="col-sm-5 col-form-label custom-label">Wage rate at time of Injury or Disease:</label>
                <div className="col-md-4">
                  <input autoComplete="off"
                    type="text"
                    className="form-control"
                    id="wageRate"
                    name="wageRate"
                    value={formData.wageRate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group row mb-1 custom-radio">
                <label className="col-md-5 col-form-label custom-label">Wage Rate Frequency:</label>
                <div className="col-md-7">
                  <div>
                    <div className="form-check form-check-inline">
                      <input autoComplete="off"
                        className="form-check-input"
                        type="radio"
                        name="wageRateFrequency"
                        id="perHour"
                        value="perHour"
                        style={{ marginTop: "14px" }}
                        checked={formData.wageRateFrequency === 'perHour'}
                        onChange={handleChange}

                      />
                      <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="perHour">Per Hour</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input autoComplete="off"
                        className="form-check-input"
                        type="radio"
                        name="wageRateFrequency"
                        id="perDay"
                        value="perDay"
                        style={{ marginTop: "14px" }}
                        checked={formData.wageRateFrequency === 'perDay'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="perDay">Per Day</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input autoComplete="off"
                        className="form-check-input"
                        type="radio"
                        name="wageRateFrequency"
                        id="perWeek"
                        value="perWeek"
                        style={{ marginTop: "14px" }}
                        checked={formData.wageRateFrequency === 'perWeek'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="perWeek">Per Week</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input autoComplete="off"
                        className="form-check-input"
                        type="radio"
                        name="wageRateFrequency"
                        id="perMonth"
                        value="perMonth"
                        style={{ marginTop: "14px" }}
                        checked={formData.wageRateFrequency === 'perMonth'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="perMonth">Per Month</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* </form> */}
            </div>
          </div>
        </div>
        <div ref={headerRef} className='collapsible-container'>
          <h1 className="custom-h1  header" style={{ cursor: 'pointer' }} onClick={() => setIsActive(prev => !prev)}
            ref={headerRef}
            tabIndex={0}>
            Injury/Illness and Medical
            <span style={{ float: 'right', marginRight: '20px', fontSize: '25px' }}>
              {/* <FontAwesomeIcon icon={isActive ? faChevronUp : faChevronDown} className="fa-sm" /> */}
              <i className={`pi ${isActive ? 'pi-sort-up-fill' : 'pi-sort-down-fill'}`} style={{ fontSize: '1rem'}}></i>
            </span>
          </h1>
          <div className={`collapsible-content ${isActive ? 'active' : ''}`}>
            <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
              <label htmlFor="naicsCode" className="col-sm-4 col-form-label custom-label">NAICS Code:</label>
              <div className="col-sm-8">
                <select
                  id="naicsCode"
                  name="naicsCode"
                  className="form-control "
                  value={formData.naicsCode}
                  onChange={handleChange}
                >
                  <option>--Select One--</option>
                  <option>Abrasive Product Manufacturing</option>
                  <option>Adhesive Manufacturing</option>
                  <option>Administration of Education Programs</option>
                  <option>Administration of Housing Programs</option>
                </select>
              </div>
            </div>

            <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
              <label htmlFor="dateOfInjury" className="col-sm-4 col-form-label custom-label">Date Of Injury: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-sm-8">
                <input autoComplete="off"
                  type="date"
                  className="form-control"
                  id="dateOfInjury"
                  name="dateOfInjury"
                  value={formData.dateOfInjury}
                  onChange={handleChange}
                  onFocus={(e) => e.target.showPicker()}
                  required
                />
              </div>
            </div>

            <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
              <label htmlFor="timeOfInjury" className="col-sm-4 col-form-label custom-label">Time of Injury:</label>
              <div className="col-sm-8">
                <input autoComplete="off"
                  type="time"
                  className="form-control"
                  id="timeOfInjury"
                  name="timeOfInjury"
                  value={formData.timeOfInjury}
                  onChange={handleChange}
                  onFocus={(e) => e.target.showPicker()}
                />
              </div>
            </div>

            <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
              <label htmlFor="countyOfInjury" className="col-sm-4 col-form-label custom-label">County Of Injury: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-sm-8">
                <input autoComplete="off"
                  type="text"
                  className="form-control"
                  id="countyOfInjury"
                  name="countyOfInjury"
                  value={formData.countyOfInjury}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
              <label htmlFor="dateEmployerKnowledge" className="col-sm-4 col-form-label custom-label">Date Employer had knowledge of Injury:</label>
              <div className="col-sm-8">
                <input autoComplete="off"
                  type="date"
                  className="form-control"
                  id="dateEmployerKnowledge"
                  name="dateEmployerKnowledge"
                  value={formData.dateEmployerKnowledge}
                  onChange={handleChange}
                  onFocus={(e) => e.target.showPicker()}
                />
              </div>
            </div>

            <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
              <label htmlFor="firstDateFailed" className="col-sm-4 col-form-label custom-label">Enter First Date Employee Failed to Work a Full Day:</label>
              <div className="col-sm-8">
                <input autoComplete="off"
                  type="date"
                  className="form-control"
                  id="firstDateFailed"
                  name="firstDateFailed"
                  value={formData.firstDateFailed}
                  onFocus={(e) => e.target.showPicker()}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
              <label className="col-sm-4 col-form-label custom-label">Did Employee Receive Full Pay on Date of Injury: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-sm-8 custom-radio">
                <div>
                  <div className="form-check form-check-inline">
                    <input autoComplete="off"
                      className="form-check-input"
                      type="radio"
                      name="fullPayOnDate"
                      value="Yes"
                      style={{ marginTop: "14px" }}
                      checked={formData.fullPayOnDate === 'Yes'}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="Yes">Yes</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input autoComplete="off"
                      className="form-check-input"
                      type="radio"
                      name="fullPayOnDate"
                      value="No"
                      style={{ marginTop: "14px" }}
                      checked={formData.fullPayOnDate === 'No'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="No">No</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input autoComplete="off"
                      className="form-check-input"
                      type="radio"
                      name="fullPayOnDate"
                      value="None"
                      style={{ marginTop: "14px" }}
                      checked={formData.fullPayOnDate === 'None'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="None">None</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
              <label className="col-sm-4 col-form-label custom-label">Did Injury/Illness Occur on Employer's premises?: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-sm-8 custom-radio">
                <div>
                  <div className="form-check form-check-inline">
                    <input autoComplete="off"
                      className="form-check-input"
                      type="radio"
                      name="occurredOnPremises"
                      value="Yes"
                      style={{ marginTop: "14px" }}
                      checked={formData.occurredOnPremises === 'Yes'}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="Yes">Yes</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input autoComplete="off"
                      className="form-check-input"
                      type="radio"
                      name="occurredOnPremises"
                      value="No"
                      style={{ marginTop: "14px" }}
                      checked={formData.occurredOnPremises === 'No'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="No">No</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input autoComplete="off"
                      className="form-check-input"
                      type="radio"
                      name="occurredOnPremises"
                      value="None"
                      style={{ marginTop: "14px" }}
                      checked={formData.occurredOnPremises === 'None'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="None">None</label>
                  </div>
                </div>

              </div>
            </div>

            <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
              <label htmlFor="injuryType" className="col-sm-4 col-form-label custom-label">Type of Injury/Illness: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-sm-8">
                <select
                  required
                  id="injuryType"
                  name="injuryType"
                  className="form-control "
                  value={formData.injuryType}
                  onChange={handleChange}

                >
                  <option value="" disabled>--Select One--</option>
                  <option value="AIDS">AIDS</option>
                  <option value="Adverse reaction to a vaccination or inoculation">Adverse reaction to a vaccination or inoculation</option>
                  <option value="Cancer">Cancer</option>
                </select>
              </div>
            </div>

            <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
              <label className="col-sm-4 col-form-label custom-label">Body Part Affected: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-sm-6 picklist-container" style={{ width: '800px' }}>
                {/* <PickList
                  name='bodyPartAffected'
                  dataKey="id"
                  source={source}
                  target={target}
                  onChange={onChange}
                  itemTemplate={itemTemplate}
                  sourceHeader={<span style={{ fontSize: '1.5rem' }}>Available</span>}
                  targetHeader={<span style={{ fontSize: '1.5rem' }}>Selected</span>}
                  sourceStyle={{ height: '0px' }}
                  className={errors.bodyPartAffected ? 'error' : ''}
                  targetStyle={{ height: '0px' }} required /> */}
                {/* {errors.bodyPartAffected && <div className="error-message">
                  Please select at least one item.</div>} */}
                {errors.bodyPartAffected && (
                  <div className="error-message" style={{ color: 'red', marginTop: '5px',fontSize:'12px' }}>
                    {errors.bodyPartAffected}
                  </div>
                )}
                <PickList dataKey="id" source={source} target={target} onChange={onChange} itemTemplate={itemTemplate} breakpoint="1280px"
                  sourceHeader={<span style={{ fontSize: '1.0rem' }}>Available</span>} targetHeader={<span style={{ fontSize: '1.0rem' }}>Selected</span>} sourceStyle={{ height: '10rem' }} targetStyle={{ height: '10rem' }} />

                {/* <PickList
                  name='bodyPartAffected'
                  source={source}
                  target={formData.bodyPartAffected}
                  onChange={handlePickListChange}
                  onRemoveItem={handleMoveToSource}
                  itemTemplate={(item) => <span style={{ fontSize: '15px' }}>{item}</span>}
                  sourceHeader={<span style={{ fontSize: '20px' }}>Available</span>}
                  targetHeader={<span style={{ fontSize: '20px' }}>Selected</span>}
                  className={errors.bodyPartAffected ? 'error-highlight' : ''}
                  data-tip={errors.bodyPartAffected || ''}
                />  */}
              </div>
            </div>
            <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
              <label htmlFor="howOccurred" className="col-sm-4 col-form-label custom-label">How Injury or Illness Occurred: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-sm-8">
                <select
                  id="howOccurred"
                  name="howOccurred"
                  className="form-control"
                  value={formData.howOccurred}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>--Select One--</option>
                  <option value="Abnormal Air Pressure">Abnormal Air Pressure</option>
                  <option value="Absorption, Ingestion or Inhalation, NOC">Absorption, Ingestion or Inhalation, NOC</option>
                  <option value="Broken Glass">Broken Glass</option>
                </select>
              </div>
            </div>
            {/* </form> */}
            {/* <hr style={{ color:'#b6dde5' }} /> */}
            <hr style={{ height: '1px', backgroundColor: 'black', border: 'none', margin: '20px 0' }} />
            <div className="d-flex flex-wrap">
              <div className=" flex-fill">
                {/* <form onSubmit={handleSubmit}> */}
                <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                  <label htmlFor="tPhysicianName" className="col-md-4 col-form-label custom-label ">Treating Physician Name: </label>
                  <div className="col-md-6">
                    <input autoComplete="off"
                      type="text"
                      className="form-control"
                      id="tPhysicianName"
                      name="tPhysicianName"
                      value={formData.tPhysicianName}
                      onChange={handleChange}

                    />
                  </div>
                </div>
                <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                  <label htmlFor="tPhysicianAddress1" className="col-md-4 col-form-label custom-label">Treating Physician Address 1:</label>
                  <div className="col-md-6">
                    <input autoComplete="off"
                      type="text"
                      className="form-control"
                      id="tPhysicianAddress1"
                      name="tPhysicianAddress1"
                      value={formData.tPhysicianAddress1}
                      onChange={handleChange}

                    />
                  </div>
                </div>
                <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                  <label htmlFor="tPhysicianAddress2" className="col-md-4 col-form-label custom-label">Treating Physician Address 2:</label>
                  <div className="col-md-6">
                    <input autoComplete="off"
                      type="text"
                      className="form-control"
                      id="tPhysicianAddress2"
                      name="tPhysicianAddress2"
                      value={formData.tPhysicianAddress2}
                      onChange={handleChange}

                    />
                  </div>
                </div>
                <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                  <label htmlFor="tPhysicianCity" className="col-md-4 col-form-label custom-label">Treating Physician City:</label>
                  <div className="col-md-6">
                    <input autoComplete="off"
                      type="text"
                      className="form-control"
                      id="tPhysicianCity"
                      name="tPhysicianCity"
                      value={formData.tPhysicianCity}
                      onChange={handleChange}

                    />
                  </div>
                </div>
                <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                  <label htmlFor="tPhysicianState" className="col-md-4 col-form-label custom-label">Treating Physician State:</label>
                  <div className="col-md-6">
                    <select
                      id="tPhysicianState"
                      name="tPhysicianState"
                      className="form-control"
                      value={formData.tPhysicianState}
                      onChange={handleChange}

                    >
                      <option>--Select One--</option>
                      <option>Georgia</option>
                      <option>Atlanta</option>
                      <option>Illinois</option>
                    </select>
                  </div>
                </div>
                <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                  <label htmlFor="tPhysicianZIP" className="col-md-4 col-form-label custom-label">Treating Physician ZIP:</label>
                  <div className="col-md-3">
                    <input autoComplete="off"
                      type="text"
                      className="form-control"
                      id="tPhysicianZIP"
                      name="tPhysicianZIP"
                      value={formData.tPhysicianZIP}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-2 d-flex align-items-center">
                    <label htmlFor="tPhysicianZIPExt" className="col-sm col-form-label custom-label">Ext:</label>
                    {/* <div className="col-md-2" style={{ paddingLeft: '0', marginLeft: '0' }}> */}
                    <input autoComplete="off"
                      type="text"
                      className="form-control"
                      id="tPhysicianZIPExt"
                      name="tPhysicianZIPExt"
                      value={formData.tPhysicianZIPExt}
                      onChange={handleChange}
                      style={{ marginLeft: '9px' }}
                    />
                  </div>
                </div>
                <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                  <label htmlFor="tPhysicianPhone" className="col-md-4 col-form-label custom-label">Treating Physician Phone:</label>
                  <div className="col-md-3">
                    <input autoComplete="off"
                      type="text"
                      className="form-control"
                      id="tPhysicianPhone"
                      name="tPhysicianPhone"
                      value={formData.tPhysicianPhone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-2 d-flex align-items-center">
                    <label htmlFor="tPhysicianPhoneExt" className="col-sm col-form-label custom-label">Ext:</label>
                    {/* <div className="col-md-2" style={{ paddingLeft: '0', marginLeft: '0' }}> */}
                    <input autoComplete="off"
                      type="text"
                      className="form-control"
                      id="tPhysicianPhoneExt"
                      name="tPhysicianPhoneExt"
                      value={formData.tPhysicianPhoneExt}
                      onChange={handleChange}
                      style={{ marginLeft: '9px' }}
                    />
                  </div>
                </div>
                {/* </form> */}
              </div>
              <div className=" flex-fill ">
                {/* <form onSubmit={handleSubmit}> */}
                <div className="form-group row mb-1">
                  <label htmlFor="initialTreatment" className="col-md-5 col-form-label custom-label">Initial Treatment: </label>
                  <div className="col-md-6">
                    <input autoComplete="off"
                      type="text"
                      className="form-control"
                      id="initialTreatment"
                      name="initialTreatment"
                      value={formData.initialTreatment}
                      onChange={handleChange}

                    />
                  </div>
                </div>
                <div className="form-group row mb-1">
                  <label htmlFor="treatingFacility" className="col-md-5 col-form-label custom-label">Hospital/Treating Facility:</label>
                  <div className="col-md-6">
                    <input autoComplete="off"
                      type="text"
                      className="form-control"
                      id="treatingFacility"
                      name="treatingFacility"
                      value={formData.treatingFacility}
                      onChange={handleChange}

                    />
                  </div>
                </div>
                <div className="form-group row mb-1">
                  <label htmlFor="treatingFacilityAddress1" className="col-md-5 col-form-label custom-label">Hospital/Treating Facility Address 1:</label>
                  <div className="col-md-6">
                    <input autoComplete="off"
                      type="text"
                      className="form-control"
                      id="treatingFacilityAddress1"
                      name="treatingFacilityAddress1"
                      value={formData.treatingFacilityAddress1}
                      onChange={handleChange}

                    />
                  </div>
                </div>
                <div className="form-group row mb-1">
                  <label htmlFor="treatingFacilityAddress2" className="col-md-5 col-form-label custom-label">Hospital/Treating Facility Address 2:</label>
                  <div className="col-md-6">
                    <input autoComplete="off"
                      type="text"
                      className="form-control"
                      id="treatingFacilityAddress2"
                      name="treatingFacilityAddress2"
                      value={formData.treatingFacilityAddress2}
                      onChange={handleChange}

                    />
                  </div>
                </div>
                <div className="form-group row mb-1">
                  <label htmlFor="treatingFacilityCity" className="col-md-5 col-form-label custom-label">Hospital/Treating Facility City:</label>
                  <div className="col-md-6">
                    <input autoComplete="off"
                      type="text"
                      className="form-control"
                      id="treatingFacilityCity"
                      name="treatingFacilityCity"
                      value={formData.treatingFacilityCity}
                      onChange={handleChange}

                    />
                  </div>
                </div>
                <div className="form-group row mb-1">
                  <label htmlFor="treatingFacilityState" className="col-md-5 col-form-label custom-label">Hospital/Treating Facility State:</label>
                  <div className="col-md-6">
                    <select
                      id="treatingFacilityState"
                      name="treatingFacilityState"
                      className="form-control"
                      value={formData.treatingFacilityState}
                      onChange={handleChange}

                    >
                      <option>--Select One--</option>
                      <option>Georgia</option>
                      <option>Atlanta</option>
                      <option>Illinois</option>
                    </select>
                  </div>
                </div>
                <div className="form-group row mb-1" >
                  <label htmlFor="treatingFacilityZIP" className="col-md-5 col-form-label custom-label">Hospital/Treating Facility Zip:</label>
                  <div className="col-md-3">
                    <input autoComplete="off"
                      type="text"
                      className="form-control"
                      id="treatingFacilityZIP"
                      name="treatingFacilityZIP"
                      value={formData.treatingFacilityZIP}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-2 d-flex align-items-center">
                    <label htmlFor="treatingFacilityZIPExt" className="col-sm col-form-label custom-label">Ext:</label>
                    {/* <div className="col-md-2" style={{ paddingLeft: '0', marginLeft: '0' }}> */}
                    <input autoComplete="off"
                      type="text"
                      className="form-control"
                      id="treatingFacilityZIPExt"
                      name="treatingFacilityZIPExt"
                      value={formData.treatingFacilityZIPExt}
                      onChange={handleChange}
                      style={{ marginLeft: '9px' }}
                    />
                  </div>
                </div>
                <div className="form-group row mb-1" >
                  <label htmlFor="hospitalPhone" className="col-md-5 col-form-label custom-label">Hospital Phone:</label>
                  <div className="col-md-3">
                    <input autoComplete="off"
                      type="text"
                      className="form-control"
                      id="hospitalPhone"
                      name="hospitalPhone"
                      value={formData.hospitalPhone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-2 d-flex align-items-center">
                    <label htmlFor="hospitalPhoneExt" className="col-sm col-form-label custom-label">Ext:</label>
                    {/* <div className="col-md-2" style={{ paddingLeft: '0', marginLeft: '0' }}> */}
                    <input autoComplete="off"
                      type="text"
                      className="form-control"
                      id="hospitalPhoneExt"
                      name="hospitalPhoneExt"
                      value={formData.hospitalPhoneExt}
                      onChange={handleChange}
                      style={{ marginLeft: '9px' }}
                    />
                  </div>
                </div>
                {/* </form> */}
              </div>
            </div>
            <hr style={{ height: '1px', backgroundColor: 'black', border: 'none', margin: '20px 0' }} />
            <div className="d-flex flex-wrap">
              <div className="form-section  flex-fill">
                <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                  <label htmlFor="RtwDate" className="col-md-3 col-form-label custom-label mt-0">If Returned to Work, Give Date: </label>
                  <div className="col-md-2">
                    <input autoComplete="off"
                      type="date"
                      className="form-control"
                      id="RtwDate"
                      name="RtwDate"
                      value={formData.RtwDate}
                      onChange={handleChange}
                      onFocus={(e) => e.target.showPicker()}
                    />
                  </div>
                </div>
                <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                  <label htmlFor="ReturnedWagePerWeek" className="col-md-3 col-form-label custom-label">Returned at what wage per week:</label>
                  <div className="col-md-2 osition-relative">
                    <input autoComplete="off"
                      style={{ marginRight: '5px' }}
                      type="text"
                      className="form-control"
                      id="ReturnedWagePerWeek"
                      name="ReturnedWagePerWeek"
                      value={formData.ReturnedWagePerWeek ? `$${formData.ReturnedWagePerWeek}` : ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                  <label htmlFor="FatalDeathDate" className="col-md-3 col-form-label custom-label ">If Fatal, Enter Complete Date of Death:</label>
                  <div className="col-md-2">
                    <input autoComplete="off"
                      type="date"
                      className="form-control"
                      id="FatalDeathDate"
                      name="FatalDeathDate"
                      value={formData.FatalDeathDate}
                      onChange={handleChange}
                      onFocus={(e) => e.target.showPicker()}
                    />
                  </div>
                </div>
              </div>
            </div>
            <hr style={{ height: '1px', backgroundColor: 'black', border: 'none', margin: '20px 0' }} />
            <div className="d-flex flex-wrap">
              <div className="form-section  flex-fill">
                <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                  <label htmlFor="reportPreparedBy" className="col-md-3 col-form-label custom-label ">Report Prepared By (Print or Type):</label>
                  <div className="col-md-4">
                    <input autoComplete="off"
                      type="date"
                      className="form-control"
                      id="reportPreparedBy"
                      name="reportPreparedBy"
                      value={formData.reportPreparedBy}
                      onChange={handleChange}
                      onFocus={(e) => e.target.showPicker()}
                    />
                  </div>
                </div>
                <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                  <label htmlFor="telePhoneNumber" className="col-md-3 col-form-label custom-label">Telephone Number:</label>
                  <div className="col-md-3">
                    <input autoComplete="off"
                      type="text"
                      className="form-control"
                      id="telePhoneNumber"
                      name="telePhoneNumber"
                      value={formData.telePhoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-1 d-flex align-items-center">
                    <label htmlFor="telePhoneExt" className="col-sm col-form-label custom-label">Ext:</label>
                    <input autoComplete="off"
                      type="text"
                      className="form-control"
                      id="telePhoneExt"
                      name="telePhoneExt"
                      value={formData.telePhoneExt}
                      onChange={handleChange}
                      style={{ marginLeft: '9px' }}
                    />
                  </div>
                  <div className="form-group row mb-1" >
                    <label htmlFor="DateOfReport" className="col-md-3 col-form-label custom-label ">Date of Report:</label>
                    <div className="col-md-3 ml-3" style={{marginLeft:'4px'}}>
                      <input autoComplete="off"
                        type="date"
                        className="form-control"
                        id="DateOfReport"
                        name="DateOfReport"
                        value={formData.DateOfReport}
                        onChange={handleChange}
                        onFocus={(e) => e.target.showPicker()}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>

            </div>
          </div>

        </div>
        <div>
          <h1 className="custom-h1 header">
            <input
              autoComplete="off"
              type="checkbox"
              checked={formData.isIncomeBenefitsEnabled}
              onChange={handleCheckboxChange}
              className="large-checkbox"
              style={{ marginLeft: '10px', marginRight: '5px', marginBottom: '0px' }}
            />
            B. INCOME BENEFITS Form WC-6 must be filed if weekly benefit is less than maximum
          </h1>
          <div>
            <div className="form-group row mb-1">
              <label className="col-md-3 col-form-label custom-label">
                Check which benefits are being paid:<span style={{ color: 'red' }}>*</span>
              </label>
              <div className="col-md-3 custom-radio d-flex align-items-center">
                <div className="d-flex flex-wrap">
                  <div className="form-check form-check-inline mb-0">
                    <input
                      autoComplete="off"
                      className="form-check-input"
                      type="radio"
                      name="benifitsBeingPaid"
                      id="incomeBenifits"
                      value="incomeBenifits"
                      disabled={!formData.isIncomeBenefitsEnabled}
                      style={{ marginTop: '12px' }}
                      checked={formData.benifitsBeingPaid === 'incomeBenifits'}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label custom-label" style={{ marginTop: '10px' }} htmlFor="incomeBenifits">
                      Income benefits
                    </label>
                  </div>
                  <div className="form-check form-check-inline mb-0">
                    <input
                      autoComplete="off"
                      className="form-check-input"
                      type="radio"
                      name="benifitsBeingPaid"
                      id="salaryInLieu"
                      value="salaryInLieu"
                      disabled={!formData.isIncomeBenefitsEnabled}
                      style={{ marginTop: '12px' }}
                      checked={formData.benifitsBeingPaid === 'salaryInLieu'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label custom-label" style={{ marginTop: '10px' }} htmlFor="salaryInLieu">
                      Salary in Lieu
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {formData.benifitsBeingPaid === 'incomeBenifits' && (
              <div className="form-group Income-Benifits-Form">
                <div className="d-flex flex-wrap">
                  <div className="form-section  flex-fill">
                    <div className="form-group row mb-1">
                      <label htmlFor="averageWeeklyWage" className="col-md-4 col-form-label custom-label">
                        Average Weekly Wage: $* <span style={{ color: 'red' }}>*</span>
                      </label>
                      <div className="col-md-6">
                        <input
                          autoComplete="off"
                          type="text"
                          className="form-control"
                          id="averageWeeklyWage"
                          name="averageWeeklyWage"
                          value={formData.averageWeeklyWage}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group row mb-1">
                      <label htmlFor="weeklyBenifit" className="col-md-4 col-form-label custom-label">
                        Weekly benefit: $ <span style={{ color: 'red' }}>*</span>
                      </label>
                      <div className="col-md-6">
                        <input
                          autoComplete="off"
                          type="text"
                          className="form-control"
                          id="weeklyBenifit"
                          name="weeklyBenifit"
                          value={formData.weeklyBenifit}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group row mb-1">
                      <label htmlFor="DateOfDisablity" className="col-md-4 col-form-label custom-label">
                        Date of disability:
                      </label>
                      <div className="col-md-6">
                        <input
                          autoComplete="off"
                          type="text"
                          className="form-control"
                          id="DateOfDisablity"
                          name="DateOfDisablity"
                          value={formData.DateOfDisablity}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group row mb-1">
                      <label htmlFor="DateOFFirstPayment" className="col-md-4 col-form-label custom-label">
                        Date Of first Payment: <span style={{ color: 'red' }}>*</span>
                      </label>
                      <div className="col-md-6">
                        <input
                          autoComplete="off"
                          type="text"
                          className="form-control"
                          id="DateOFFirstPayment"
                          name="DateOFFirstPayment"
                          value={formData.DateOFFirstPayment}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group row mb-1">
                      <label htmlFor="CompensationPaid" className="col-md-4 col-form-label custom-label">
                        Compensation paid: $ <span style={{ color: 'red' }}>*</span>
                      </label>
                      <div className="col-md-6">
                        <input
                          autoComplete="off"
                          type="text"
                          className="form-control"
                          id="CompensationPaid"
                          name="CompensationPaid"
                          value={formData.CompensationPaid}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group row mb-1">
                      <label htmlFor="penalityPaid" className="col-md-4 col-form-label custom-label">
                        Penalty paid: $
                      </label>
                      <div className="col-md-6">
                        <input
                          autoComplete="off"
                          type="text"
                          className="form-control"
                          id="penalityPaid"
                          name="penalityPaid"
                          value={formData.penalityPaid}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-section flex-fill pl-3">
                    <div className="form-group row mb-1">
                      <label htmlFor="BenifitsPayableByDate" className="col-md-4 col-form-label custom-label">
                        Benefits Payable From Date:<span style={{ color: 'red' }}>*</span>
                      </label>
                      <div className="col-md-6">
                        <input
                          autoComplete="off"
                          type="date"
                          className="form-control"
                          id="BenifitsPayableByDate"
                          name="BenifitsPayableByDate"
                          value={formData.BenifitsPayableByDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group row mb-1">
                      <label htmlFor="BenifitsPAyableFor" className="col-md-4 col-form-label custom-label">
                        Benefits Payable For: <span style={{ color: 'red' }}>*</span>
                      </label>
                      <div className="col-md-6">
                        <input
                          autoComplete="off"
                          type="text"
                          className="form-control"
                          id="BenifitsPAyableFor"
                          name="BenifitsPAyableFor"
                          value={formData.BenifitsPAyableFor}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group row mb-1">
                      <label htmlFor="payBenifitUntil" className="col-md-4 col-form-label custom-label">
                        Pay Benefit Until:
                      </label>
                      <div className="col-md-6">
                        <input
                          autoComplete="off"
                          type="text"
                          className="form-control"
                          id="payBenifitUntil"
                          name="payBenifitUntil"
                          value={formData.payBenifitUntil}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {formData.benifitsBeingPaid === 'salaryInLieu' && (
              <div className="d-flex flex-wrap">
                <div className="form-section  flex-fill">
                  <div className="form-group row mb-1 custom-radio">
                    <label className="col-md-4 col-form-label custom-label">Previously Medical Only:</label>
                    <div className="col-md-6 d-flex flex-wrap ">
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          className="form-check-input"
                          name="previouslyMedicalOnly"
                          id="previouslyMedicalYes"
                          value="Yes"
                          style={{ fontSize: '10px', color: 'black', marginTop: '10px' }}
                        />
                        <label className="form-check-label custom-label" htmlFor="previouslyMedicalYes">Yes</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          className="form-check-input "
                          name="previouslyMedicalOnly"
                          id="previouslyMedicalNo"
                          value="No"
                          style={{ fontSize: '10px', color: 'black', marginTop: '10px' }}
                        />
                        <label className="form-check-label custom-label" htmlFor="previouslyMedicalNo">No</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          className="form-check-input"
                          name="previouslyMedicalOnly"
                          id="previouslyMedicalNone"
                          value="None"
                          style={{ fontSize: '10px', color: 'black', marginTop: '10px' }}
                        />
                        <label className="form-check-label custom-label" htmlFor="previouslyMedicalNone">None</label>
                      </div>
                    </div>
                  </div>
                  <div className="form-group row mb-1">
                    <label htmlFor="averageWeeklyWage" className="col-md-4 col-form-label custom-label">Average Weekly Wage Amount: $</label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        id="averageWeeklyWage"
                        name="averageWeeklyWage"
                      />
                    </div>
                  </div>
                  <div className="form-group row mb-1">
                    <label htmlFor="weeklyBenefitAmount" className="col-md-4 col-form-label custom-label">Weekly Benefit Amount: $</label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        id="weeklyBenefitAmount"
                        name="weeklyBenefitAmount"
                      />
                    </div>
                  </div>
                  <div className="form-group row mb-1">
                    <label htmlFor="dateOfDisability" className="col-md-4 col-form-label custom-label">Date of Disability:</label>
                    <div className="col-md-6">
                      <input
                        type="date"
                        className="form-control"
                        id="dateOfDisability"
                        name="dateOfDisability"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section flex-fill pl-3">
                  <div className="form-group row mb-1">
                    <label htmlFor="dateSalaryPaid" className="col-md-4 col-form-label custom-label">Date Salary Paid:<span style={{ color: 'red' }}>*</span></label>
                    <div className="col-md-6">
                      <input
                        type="date"
                        className="form-control"
                        id="dateSalaryPaid"
                        name="dateSalaryPaid"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group row mb-1">
                    <label htmlFor="benefitsPayableFromDate" className="col-md-4 col-form-label custom-label">Benefits Payable From Date:<span style={{ color: 'red' }}>*</span></label>
                    <div className="col-md-6">
                      <input
                        type="date"
                        className="form-control"
                        id="benefitsPayableFromDate"
                        name="benefitsPayableFromDate"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group row mb-1">
                    <label htmlFor="benefitsPayableFor" className="col-md-4 col-form-label custom-label">Benefits Payable For:<span style={{ color: 'red' }}>*</span></label>
                    <div className="col-md-6">
                      <select
                        className="form-control"
                        id="benefitsPayableFor"
                        name="benefitsPayableFor"
                        required
                      >
                        <option value="">Select</option>
                        <option value="Total Disability">TOTAL DISABILITY</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group row mb-1">
                    <label htmlFor="payBenefitUntil" className="col-md-4 col-form-label custom-label">Pay Benefit Until:</label>
                    <div className="col-md-6">
                      <input
                        type="date"
                        className="form-control"
                        id="payBenefitUntil"
                        name="payBenefitUntil"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <h1 className="custom-h1  header" style={{margingBottom:'10px'}}>
            <input autoComplete="off"
              type="checkbox"
              checked={formData.isControvertEnabled}
              onChange={() => setFormData((prev) => ({ ...prev, isControvertEnabled: !prev.isControvertEnabled }))}
              className="large-checkbox"
              style={{ marginLeft: '10px', marginRight: '5px', marginBottom: '0px'}}
            />
            C. Notice To Convert Payment Of Compensation</h1>
          <div className="form-group row mb-1">
            <label htmlFor="convertType" className="col-md-2 col-form-label custom-label">Controvert Type:<span style={{ color: 'red' }}>*</span></label>
            <div className="col-md-3">
              <select
                id="convertType"
                name="convertType"
                className="form-control"
                value={formData.convertType}
                disabled={!formData.isControvertEnabled}
                onChange={handleChange}
                required
              >
                <option value="" disabled>--Select One--</option>
                <option value="ALL THE ENTIRE CASE IS CONTROVERTED">ALL THE ENTIRE CASE IS CONTROVERTED</option>
                <option value="LOST TIME IS CONTROVERTED, HOWEVER MEDICAL OR OTHER BENEFITS HAVE BEEN ACCEPTED">LOST TIME IS CONTROVERTED, HOWEVER MEDICAL OR OTHER BENEFITS HAVE BEEN ACCEPTED</option>
                <option value="MEDICAL IS DENIED">MEDICAL IS DENIED</option>
                <option value="PARTIAL DENIAL OF MEDICAL">PARTIAL DENIAL OF MEDICAL</option>
              </select>
            </div>
          </div>
          <div className="form-group row mb-1">
            <label htmlFor="BenifitsNPReasons" className="col-md-2 col-form-label custom-label">Reason Benefits will not be paid:</label>
            <div className="col-md-5">
              <textarea
                name="BenifitsNPReasons"
                className="form-control"
                value={formData.BenifitsNPReasons}
                disabled={!formData.isControvertEnabled}
                onChange={handleChange}
                rows="8"
                cols="100"
                style={{ marginTop: '10px', resize: 'none' }}
              />
            </div>
          </div>
        </div>
        <div>
          <h1 className="custom-h1 header" ref={headerRef}>
            <input autoComplete="off"
              type="checkbox"
              checked={formData.isMedicalInjuryEnabled}
              onChange={() => {
                setFormData((prev) => ({
                  ...prev,
                  isMedicalInjuryEnabled: !formData.isMedicalInjuryEnabled,
                  indemnityEnabaled: formData.isMedicalInjuryEnabled ? false : prev.indemnityEnabaled,
                }));
              }}
              // onChange={() => {
              //   setFormData((prev) => ({
              //     ...prev,
              //     isMedicalInjuryEnabled: !prev.isMedicalInjuryEnabled,
              //     indemnityEnabaled: prev.isMedicalInjuryEnabled ? false : prev.indemnityEnabaled
              //   }));

              // }}
              className="large-checkbox"
              style={{ marginLeft: '10px', marginRight: '5px', marginBottom: '0px' }}
            />
            D. Medical Only Injury</h1>
          <div className="form-group mb-1" style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: 'red', marginRight: '10px', marginLeft: '10px', fontSize: '20px', marginBottom: '20px', marginTop: '10px' }}>*</span>
            <input autoComplete="off"
              type="checkbox"
              name="indemnityEnabaled"
              checked={formData.indemnityEnabaled}
              onChange={() => setFormData((prev) => ({ ...prev, indemnityEnabaled: !prev.indemnityEnabaled }))}
              disabled={!formData.isMedicalInjuryEnabled}
              className="large-checkbox"
              style={{ marginLeft: '0px', marginRight: '5px', marginBottom: '20px', marginTop: '10px' }} required
            />
            <label style={{ marginBottom: '20px', marginTop: '10px' }} className="custom-label">No indemnity benefits are due and/or have NOT been controverted.</label>
          </div>

        </div>
        <div>
          <h1 className="custom-h1 header">Attachments</h1>
          <Toast ref={toast} />
          <label className="custom-file-upload">
            <input autoComplete="off" type="file" onChange={handleFileUpload} accept="application/pdf, .doc, .docx, .jpg, .png" style={{ display: 'none' }} />
            Choose File
          </label>
          <div className="card">
            <DataTable value={documents} paginator rows={5} className="datatable custom-label" tableStyle={{ minWidth: '100rem' }} >
              <Column field="id" header="#" />
              <Column field="name" header="Document Name" />
              <Column body={actionBodyTemplate} header="Actions" />
            </DataTable>
          </div>

          <Dialog
            header={<span style={{ fontSize: '15px' }}>Confirmation</span>}
            visible={deleteVisible}
            onHide={() => setDeleteVisible(false)}
            style={{ width: '400px', height: '200px' }}
            modal
          >
            <p style={{ fontSize: '15px' }}>Are you sure you want to delete this document?</p>
            <Button label="Yes" onClick={confirmDelete} className="p-button-info" style={{ marginRight: '10px', fontSize: '12px' }} />
            <Button label="No" onClick={() => setDeleteVisible(false)} className="p-button-danger" style={{ marginRight: '10px', fontSize: '12px' }} />
          </Dialog>


          <Dialog
            header="View Document"
            visible={viewVisible}
            onHide={hideViewModal}
            modal
          >
            {fileUrl && (
              <iframe
                src={fileUrl}
                style={{ width: '1000px', height: '800px' }}
                title="Document Viewer"
              />
            )}
          </Dialog>

        </div>
        <div>
          <h1 className="custom-h1 header" style={{ marginTop: '5px' }}>Submitter Information</h1>
          <div className="d-flex flex-wrap">
            <div className="form-section  flex-fill">
              <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                <label className="col-sm-7 col-form-label custom-label custom-label-no-padding">Insurer/Self-Insurer: Type or Print Name of Person Filing Form:</label>
                <div className="col-sm-2  mt-2 ml-2">
                  <span style={{ fontSize: '15px' }} className='value'>Nikhila D</span>
                </div>
              </div>
              <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                <label htmlFor="submittedDate" className="col-sm-7 col-form-label custom-label ">Date:</label>
                <div className="col-2  mt-2 ml-">
                  <span style={{ fontSize: '15px' }} className='value'>10/20/2024</span>
                </div>
              </div>
            </div>
            <div className="form-section flex-fill pl-3">
              <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                <label className="col-sm-3 col-form-label custom-label custom-label-no-padding">Phone Number:</label>
                <div className="col-sm-3  mt-2">
                  <span style={{ fontSize: '15px' }} >(404) 657-2995</span>
                </div>
                <label className="col-sm-1 col-form-label custom-label custom-label-no-padding">Ext:</label>
                <div className="col-sm-2  mt-2 ">
                  <span style={{ fontSize: '15px' }}>ext</span>
                </div>
              </div>
              <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                <label className="col-sm-3 col-form-label custom-label custom-label-no-padding"> E-mail:</label>
                <div className="col-sm-3  mt-2 ml-2">
                  <span style={{ fontSize: '15px' }}>nikhila@myequitek.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center mt-5 mb-10">
          <button type="reset" className="btn btn-secondary mx-2 mb-10 custom-label">Reset</button>
          <button type="button" className="btn btn-success mx-2 mb-10  custom-label"
            style={{
              backgroundColor: clicked ? '#b6dde5' : '#b6dde5', border: 'none', color: 'black'
            }}
            onClick={() => setClicked(!clicked)}>Save</button>
          <button type="submit" className="btn btn-success mx-2 mb-10  custom-label"
            style={{
              backgroundColor: clicked ? '#b6dde5' : '#b6dde5', border: 'none', color: 'black'
            }}
            onClick={() => setClicked(!clicked)}>Submit</button>
          {/* <button type="button" className="btn btn-secondary mx-2 mb-10  custom-label">Back</button> */}
          {/* <Link
            className="btn btn-secondary mx-2 mb-10  custom-label"
            to={`/parties`}
            style={{ marginLeft: "12px" }}
          >
            Back
          </Link> */}
        </div>
      </form>
    </div >
  );
};

export default Wc1FormComponent;
