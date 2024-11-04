import React, { useState, useEffect, useRef } from 'react';
import { PickList } from 'primereact/picklist';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import NewClaimComponent from "./NewClaimComponent.js";
import Modal from './Modal.js';
import ClaimService from "../services/claim.service";
import { Dropdown } from 'primereact/dropdown';

const Wc1FormComponent = () => {
  const Pagination = ({ className, currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange }) => {
    return (
      <div className={`pagination-container d-flex justify-content-${className} mb-3`}>
        <select className="form-select custom-select" style={{ width: '50px', fontSize: '14px', padding: '5px' }}
          value={itemsPerPage} onChange={(e) => onItemsPerPageChange(Number(e.target.value))}>
          {[2, 4, 6, 8].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>

        <button
          className="btn btn-outline-info  btn-sm mx-1"
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
  const [clicked, setClicked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);
  const fieldRefs = useRef({});
  const attachmentsRef = useRef(null);
  const toastRef = React.useRef(null);
  const toast = React.useRef(null);
  const pickListRef = useRef(null);
  //const [isHovering, setIsHovering] = useState(false);


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


  // useEffect(() => {
  //   // const handleWc1 = async (e) => {
  //   //   e.preventDefault();
  //     try {
  //       ClaimService.getClaimById();
  //     } catch (error) {
  //       console.log(error);
  //       setError("Incorrect username and password .Please Try again.");
  //       setTimeout(() => {
  //         setError("");
  //       }, 1000);
  //     }
  //   // };
  // }, []);

  useEffect(() => {
    ClaimService.getClaimById()
      .then((response) => {
        console.log(response);
        setFormData(response.data);
        console.log("formData", formData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newDocument = { id: documents.length + 1, name: file.name, fileUrl: url };
      setDocuments([...documents, newDocument]);
      toast.current.show({ severity: 'success', summary: 'File Uploaded', detail: file.name, life: 3000, style: { backgroundColor: '#4baaf5', color: '#FFFFFF', color: 'black' }, });
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
        <Button type="button" label="View" onClick={() => {
          setFileUrl(rowData.fileUrl);
          setViewVisible(true);
        }} className="p-button-info" style={{ marginRight: '10px', marginBottom: '10px', marginTop: '10px' }} />
        <Button type="button" label="Delete" onClick={() => {
          setDocToDelete(rowData.id);
          setDeleteVisible(true);
        }} className="p-button-danger" style={{ marginRight: '10px', marginBottom: '10px', marginTop: '10px' }} />
      </>
    );
  };


  const [formData, setFormData] = useState({
    claimant: {
      firstName: '',
      lastName: '',
      middleIntial: '',
      dateOfBirth: '',
      gender: 'Male',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      primaryEmail: '',
      primaryPhone: '',
    },
    countyOfInjury: {
      description: '',
    },
    NoOfDays: '',
    insurerFile: '',
    jobClssifiedCodeNo: '',
    hiredDate: '',
    wageRate: '',
    daysOff: '',
    wageRateFrequency: 'perHour',
    outOfCountryAddress: '',
    naicsCode: '',
    dateOfInjury: '',
    timeOfInjury: '',
    countyOfInjury: '',
    dateEmployerKnowledge: '',
    firstDateFailed: '',
    fullPayOnDate: 'Yes',
    occurredOnPremises: '',
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
    weeklyBenifit: '',
    DateOfReport: '',
    benifitsBeingPaid: '',
    convertType: '',
    BenifitsNPReasons: '',
    isIncomeBenefitsEnabled: false,
    isControvertEnabled: false,
    isMedicalInjuryEnabled: false,
    indemnityEnabaled: false,
    document: null,
    payBenefitUntil: '',
    benefitsPayableFor: '',
    benefitsPayableFromDate: '',
    dateSalaryPaid: '',
    dateOfDisability: '',
    weeklyBenefitAmount: '',
    averageWeeklyWage: '',
    previouslyMedicalOnly: '',
    averageWeeklyWage:'',weeklyBenefitAmount:'',averageWeeklyWageAmount:''
  });

  const [parties, setParties] = useState([
    { partyType: 'Claimant', partyName: 'TEST A', parentParty: 'Parent 1', selfInsured: 'Yes', selfAdministered: 'No', groupFundMember: 'No' },
    { partyType: 'Employer', partyName: 'TEST B', parentParty: 'Parent 2', selfInsured: 'No', selfAdministered: 'Yes', groupFundMember: 'No' },
    { partyType: 'Attorney', partyName: 'Party C', parentParty: 'Parent 3', selfInsured: 'Yes', selfAdministered: 'No', groupFundMember: 'Yes' },
    { partyType: 'AParty', partyName: 'Party D', parentParty: 'Parent 4', selfInsured: 'No', selfAdministered: 'No', groupFundMember: 'Yes' },

  ]);
  const naicsOptions = [
    // { label: '---Select One---', value: ' ' },
    { label: 'Abrasive Product Manufacturing', value: 'Abrasive Product Manufacturing' },
    { label: 'Adhesive Manufacturing', value: 'Adhesive Manufacturing' },
    { label: 'Administration of Education Programs', value: 'Administration of Education Programs' },
    { label: 'Administration of Housing Programs', value: 'Administration of Housing Programs' }
  ];
  const injuryTypes = [
    { label: 'AIDS', value: 'AIDS' },
    { label: 'Adverse reaction to a vaccination or inoculation', value: 'Adverse reaction to a vaccination or inoculation' },
    { label: 'Cancer', value: 'Cancer' },
  ]
  const howOccurred = [
    { label: 'Abnormal Air Pressure', value: 'Abnormal Air Pressure' },
    { label: 'Absorption, Ingestion or Inhalation, NOC', value: '"Absorption, Ingestion or Inhalation, NOC' },
    { label: 'Broken Glass', value: 'Broken Glass' }
  ]
  const convertTypes = [
    { label: 'ALL THE ENTIRE CASE IS CONTROVERTED', value: 'ALL THE ENTIRE CASE IS CONTROVERTED' },
    { label: 'LOST TIME IS CONTROVERTED, HOWEVER MEDICAL OR OTHER BENEFITS HAVE BEEN ACCEPTED', value: 'LOST TIME IS CONTROVERTED, HOWEVER MEDICAL OR OTHER BENEFITS HAVE BEEN ACCEPTED' },
    { label: 'MEDICAL IS DENIED', value: 'MEDICAL IS DENIED' },
    { label: 'PARTIAL DENIAL OF MEDICAL', value: 'PARTIAL DENIAL OF MEDICAL' }
  ]
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
          DateOfDisablity: '',

        };
      } else {
        return { ...prev, isIncomeBenefitsEnabled: true };
      }
    });
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   // setFormData({ ...formData, [name]: value });
  //   // setAmount(e.target.value.replace(/[^0-9.]/g, '');
  //   setFormData({ ...formData, [name]: name === 'ReturnedWagePerWeek' ? value.replace(/[^0-9.]/g, '') : value });
  //   if (errors[name]) {
  //     setErrors({ ...errors, [name]: '' });
  //   }
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split('.');
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));

    if (nameParts.length > 1) {
      setFormData((prevData) => ({
        ...prevData,
        [nameParts[0]]: {
          ...prevData[nameParts[0]],
          [nameParts[1]]: value
        }
      }));
    }else {
      const numericFields = ['ReturnedWagePerWeek', 'averageWeeklyWage', 'weeklyBenefitAmount','averageWeeklyWageAmount', 'CompensationPaid', 'penalityPaid', 'weeklyBenifit'];
  
      if (numericFields.includes(name)) {
        if (/^\d*\.?\d*$/.test(value) || value === '') {
          setFormData((prevData) => ({
            ...prevData,
            [name]: value,
          }));
        }
        //  else {
        //   setFormData((prevData) => ({
        //     ...prevData,
        //     [name]: '', 
        //   }));
        // }
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setFormData((prev) => {
      const newValue = prev[name] && prev[name] !== ''
        ? `$${parseFloat(prev[name]).toFixed(2)}`
        : '';
  
      return {
        ...prev,
        [name]: newValue,
      };
    });
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


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form to be Submitted:', formData);
    const requiredFields = [
      'claimant.firstName', 'claimant.lastName', 'claimant.address1', 'claimant.city',
      'claimant.state', 'claimant.zip', 'claimant.gender', 'NoOfDays',
      'daysOff', 'dateOfInjury', 'countyOfInjury.description', 'fullPayOnDate',
      'occurredOnPremises', 'howOccurred', 'injuryType'
    ];
    const newErrors = validateRequiredFields(formData, requiredFields);
    const validateConditionalFields = () => {
      if (formData.isIncomeBenefitsEnabled) {
        if (formData.benifitsBeingPaid === 'incomeBenifits') {
          const incomeBenefitsRequiredFields = [
            'averageWeeklyWage', 'DateOFFirstPayment',
            'CompensationPaid', 'BenifitsPayableByDate', 'BenifitsPAyableFor', 'weeklyBenifit'
          ];
          Object.assign(newErrors, validateRequiredFields(formData, incomeBenefitsRequiredFields));
        }
        if (formData.benifitsBeingPaid === 'salaryInLieu') {
          const salaryInLieuRequiredFields = [
            'dateSalaryPaid', 'benefitsPayableFromDate', 'benefitsPayableFor'
          ];
          Object.assign(newErrors, validateRequiredFields(formData, salaryInLieuRequiredFields));
        }
      }
      if (formData.isControvertEnabled) {
        const controvertRequiredFields = ['convertType'];
        Object.assign(newErrors, validateRequiredFields(formData, controvertRequiredFields));
      }
      if (formData.isMedicalInjuryEnabled) {
        const indemnityRequiredFields = ['indemnityEnabaled'];
        Object.assign(newErrors, validateRequiredFields(formData, indemnityRequiredFields));
      }
    };
    validateConditionalFields();
    console.log('Validation Errors:', newErrors);
    if (!formData.bodyPartAffected || formData.bodyPartAffected.length === 0) {
      newErrors.bodyPartAffected = 'Please select at least one body part affected.';
    }
    const scrollToFirstError = () => {
      if (Object.keys(newErrors).length > 0) {
        const firstErrorField = Object.keys(newErrors)[0];
        if (fieldRefs.current[firstErrorField]) {
          const ref = fieldRefs.current[firstErrorField].current;
          if (ref && ref instanceof HTMLElement) {
            ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
            ref.focus();
          }
        }
      }
    };
    const errorFieldsToCheck = requiredFields.filter(field =>
      ['injuryType', 'fullPayOnDate', 'bodyPartAffected', 'occurredOnPremises'].includes(field)
    );
    const hasRelevantErrors = errorFieldsToCheck.some(field => newErrors[field]);
    if (Object.keys(newErrors).length > 0) {
      console.log('Errors found:', newErrors);
      setErrors(newErrors);
      console.log("newError", newErrors);
      if (hasRelevantErrors) {
        setIsActive(true);
      }
      scrollToFirstError();
      return;
    }
    else {
      toastRef.current.show({
        severity: 'success',
        summary: 'Submission Successful',
        detail: 'Your form has been successfully submitted!',
        life: 3000,
      });
      console.log('Submitting form with data:', formData);
      setIsActive(false);
    }
    setIsActive(false);
    console.log("Form is valid. Proceeding with submission...");
    setFormData(prev => ({
      ...prev,
    }));
  };

  const validateRequiredFields = (data, requiredFields) => {
    const newErrors = {};
    requiredFields.forEach(field => {
      const fieldParts = field.split('.');
      let value = data;
      for (const part of fieldParts) {
        value = value[part];
      }
      if (typeof value !== 'string' || value.trim() === '') {
        newErrors[field] = `${field.replace('claimant.', '')} is required.`;
      }
    });
    return newErrors;
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const checkRequiredFields = (data) => {
    return (
      data.dateOfInjury &&
      data.countyOfInjury &&
      data.injuryType &&
      data.howOccurred
    );
  };

  const getFieldRef = (fieldName) => {
    if (!fieldRefs.current[fieldName]) {
      fieldRefs.current[fieldName] = React.createRef();
    }
    return fieldRefs.current[fieldName];
  };

  const onChange = (event) => {
    const { source, target } = event;
    if (!Array.isArray(source) || !Array.isArray(target)) {
      console.error('Source or target is not an array:', source, target);
      return;
    }
    setSource(source);
    setTarget(target);
    console.log('Previous formData:', formData);
    setFormData((prevState) => {
      const updatedFormData = {
        ...prevState,
        bodyPartAffected: target,
      };
      console.log('Updated formData:', updatedFormData);
      if (target.length > 0) {
        setErrors((prevErrors) => {
          const { bodyPartAffected, ...rest } = prevErrors;
          return rest;
        });
        if (Object.keys(errors).length === 1 && errors.bodyPartAffected) {
          setIsActive(false);
        }
      }
      return updatedFormData;
    });
  };

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    mailingAddress1: '',
    city: '',
    state: '',
    zip: '',
    gender: '',
    NoOfDays: '', dateOfInjury: '', countyOfInjury: '', fullPayOnDate: '', occurredOnPremises: '', howOccurred: '', injuryType: '',
    bodyPartAffected: false, averageWeeklyWage: '',
    weeklyBenifit: '', DateOFFirstPayment: '', CompensationPaid: '',
    BenifitsPayableByDate: '', BenifitsPAyableFor: ''
    , benefitsPayableFromDate: '',
    dateSalaryPaid: '', benefitsPayableFor: '', occurredOnPremises: '', fullPayOnDate: '', convertType: '', indemnityEnabaled: ''
  });



  const totalPages = Math.ceil(parties.length / itemsPerPage);
  const paginatedParties = parties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="form-container">
      <Toast ref={toastRef} />
      <NewClaimComponent />
      <h1 className="custom-h1 header mt-3">Claimant Information</h1>
      {/* <Toast ref={toastRef} /> */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="d-flex flex-wrap">
          <div className="form-section  flex-fill">

            <div className="form-group row mb-1">
              <label htmlFor="firstName" className="col-md-4 col-form-label custom-label ">Employee First Name: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-md-6">
                <input autoComplete="off"
                  type="text"
                  ref={getFieldRef('claimant.firstName')}
                  className={`form-control custom-input ${errors.firstName ? 'p-invalid' : ''}`}
                  id="firstName"
                  name="firstName"
                  value={formData.claimant.firstName || ''}
                  onChange={handleChange}
                  required disabled='true'
                />
                {errors.firstName && (
                  <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                    {errors.firstName}
                  </div>
                )}
              </div>
            </div>
            <div className="form-group row mb-1">
              <label htmlFor="lastName" className="col-md-4 col-form-label custom-label">Employee Last Name: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-md-6">
                <input autoComplete="off"
                  type="text"
                  ref={getFieldRef('claimant.lastName')}
                  className={`form-control custom-input ${errors.lastName ? 'p-invalid' : ''}`}
                  id="lastName"
                  name="lastName"
                  value={formData.claimant.lastName || ''}
                  onChange={handleChange}
                  required disabled='true'
                />
                {errors.lastName && (
                  <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                    {errors.lastName}
                  </div>
                )}
              </div>
            </div>
            <div className="form-group row mb-1">
              <label htmlFor="middleIntial" className="col-md-4 col-form-label custom-label">M.I.:</label>
              <div className="col-md-6">
                <input autoComplete="off"
                  type="text"
                  className="form-control custom-input"
                  id="middleIntial"
                  name="middleIntial"
                  value={formData.claimant.middleIntial || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group row mb-1">
              <label htmlFor="dateOfBirth" className="col-md-4 col-form-label custom-label">Birthdate:</label>
              <div className="col-md-3">
                <input autoComplete="off"
                  type="date"
                  className="form-control custom-input"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formatDateForInput(formData.claimant.dateOfBirth) || ''}
                  onChange={handleChange}
                  onClick={(e) => e.target.showPicker()}
                  disabled='true'
                />
              </div>
            </div>
            <div className="form-group row mb-1">
              <label className="col-md-4 col-form-label custom-label" ref={fieldRefs.current.gender} >Gender: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-md-6 custom-radio">
                <div>
                  <div className="form-check form-check-inline">
                    <input autoComplete="off"
                      className={`form-check-input ${errors.gender ? 'p-invalid' : ''}`}
                      type="radio"
                      name="gender"
                      id="genderMale"
                      value="M"
                      style={{ marginTop: "14px" }}
                      checked={formData.claimant.gender === 'M' || ''}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="genderMale">Male</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input autoComplete="off"
                      className={`form-check-input ${errors.gender ? 'p-invalid' : ''}`}
                      type="radio"
                      name="gender"
                      id="genderFemale"
                      value="F"
                      style={{ marginTop: "14px" }}
                      checked={formData.claimant.gender === '' || ''}
                      onChange={handleChange}
                    />
                    <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="genderFemale">Female</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input autoComplete="off"
                      className={`form-check-input ${errors.gender ? 'p-invalid' : ''}`}
                      type="radio"
                      name="gender"
                      id="genderUnknown"
                      style={{ marginTop: "14px" }}
                      value="Unknown"
                      checked={formData.claimant.gender === 'Unknown' || ''}
                      onChange={handleChange}
                    />
                    <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="genderUnknown">Unknown</label>
                  </div>
                </div>
                {errors.gender && (
                  <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                    {errors.gender}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-section flex-fill pl-3">
            {/* <form onSubmit={handleSubmit}> */}
            <div className="form-group row mb-1">
              <label htmlFor="outOfCountryAddress" className="col-md-4 col-form-label custom-label">Out of Country Address:</label>
              <div className="col-md-6">
                <div
                  className={`custom-checkbox ${formData.outOfCountryAddress ? 'checked' : ''}`}
                  onClick={() => handleChange({ target: { name: 'outOfCountryAddress', value: !formData.outOfCountryAddress } })}
                />
                <input
                  type="checkbox"
                  id="outOfCountryAddress"
                  name="outOfCountryAddress"
                  value={formData.outOfCountryAddress}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
            <div className="form-group row mb-1">
              <label htmlFor="address1" className="col-md-4 col-form-label custom-label">Mailing Address1: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-md-6">
                <input autoComplete="off"
                  type="text"
                  ref={getFieldRef('claimant.address1')}
                  className={`form-control custom-input ${errors['claimant.address1'] ? 'p-invalid' : ''}`}
                  id="address1"
                  name="claimant.address1"
                  value={formData.claimant.address1 || ''}
                  onChange={handleChange}
                  required
                />
                {errors['claimant.address1'] && (
                  <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                    {errors['claimant.address1']}
                  </div>
                )}
              </div>
            </div>
            <div className="form-group row mb-1">
              <label htmlFor="address2" className="col-md-4 col-form-label custom-label">Mailing Address2:</label>
              <div className="col-md-6">
                <input autoComplete="off"
                  type="text"
                  className="form-control custom-input"
                  id="address2"
                  name="address2"
                  value={formData.claimant.address2}
                  onChange={handleChange}

                />
              </div>
            </div>
            <div className="form-group row mb-1">
              <label htmlFor="city" className="col-md-4 col-form-label custom-label">City: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-md-6">
                <input autoComplete="off"
                  type="text"
                  ref={getFieldRef('claimant.city')}
                  className={`form-control custom-input ${errors['claimant.city'] ? 'p-invalid' : ''}`}
                  id="city"
                  name="claimant.city"
                  value={formData.claimant.city || ''}
                  onChange={handleChange}
                  required
                />
                {errors['claimant.city'] && (
                  <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                    {errors['claimant.city']}
                  </div>
                )}
              </div>
            </div>
            <div className="form-group row mb-1">
              <label htmlFor="state" className="col-md-4 col-form-label custom-label">State: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-md-6">
                <input autoComplete="off"
                  type="text"
                  ref={getFieldRef('claimant.state')}
                  className={`form-control custom-input ${errors['claimant.state'] ? 'p-invalid' : ''}`}
                  id="state"
                  name="claimant.state"
                  value={formData.claimant.state || ''}
                  onChange={handleChange}
                  required
                />
                {errors['claimant.state'] && (
                  <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                    {errors['claimant.state']}
                  </div>
                )}
              </div>
            </div>
            <div className="form-group row mb-1">
              <label htmlFor="zip" className="col-md-4 col-form-label custom-label">Zip: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-md-6">
                <input autoComplete="off"
                  type="text"
                  ref={getFieldRef('claimant.zip')}
                  className={`form-control custom-input ${errors['claimant.zip'] ? 'p-invalid' : ''}`}
                  id="zip"
                  name="claimant.zip"
                  value={formData.claimant.zip || ''}
                  onChange={handleChange}
                  required
                />
                {errors['claimant.zip'] && (
                  <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                    {errors['claimant.zip']}
                  </div>
                )}
              </div>
            </div>
            <div className="form-group row mb-1">
              <label htmlFor="primaryEmail" className="col-md-4 col-form-label custom-label">Employee E-mail:</label>
              <div className="col-md-6">
                <input autoComplete="off"
                  type="claimant.primaryEmail"
                  className="form-control custom-input"
                  id="primaryEmail"
                  name="claimant.primaryEmail"
                  value={formData.claimant.primaryEmail}
                  onChange={handleChange}
                  disabled='true'
                />
              </div>
            </div>
            <div className="form-group row mb-1">
              <label htmlFor="primaryPhone" className="col-md-4 col-form-label custom-label">Phone Number:</label>
              <div className="col-md-6">
                <input autoComplete="off"
                  type="text"
                  className="form-control custom-input"
                  id="primaryPhone"
                  name="claimant.primaryPhone"
                  value={formData.claimant.primaryPhone}
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
                    className="form-control custom-input"
                    id="hiredDate"
                    name="hiredDate"
                    value={formData.hiredDate}
                    onChange={handleChange}
                    onClick={(e) => e.target.showPicker()}
                  />
                </div>
              </div>
              <div className="form-group row mb-1">
                <label htmlFor="jobClssifiedCodeNo" className="col-sm-4 col-form-label custom-label">Job Classified Code No :</label>
                <div className="col-md-4">
                  <input autoComplete="off"
                    type="text"
                    className="form-control custom-input"
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
                    className="form-control custom-input"
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
                    ref={getFieldRef('NoOfDays')}
                    className={`form-control custom-input ${errors.NoOfDays ? 'p-invalid' : ''}`}
                    id="NoOfDays"
                    name="NoOfDays"
                    value={formData.NoOfDays}
                    onChange={handleChange}
                    required
                  />
                  {errors.NoOfDays && (
                    <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                      {errors.NoOfDays}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group row mb-1 custom-radio">
                <label className="col-md-5 col-form-label custom-label">Do you have any days Off?<span style={{ color: 'red' }}>*</span></label>
                <div ref={fieldRefs.current.daysOff} className="col-md-6">
                  <div>
                    <div className="form-check form-check-inline">
                      <input autoComplete="off"
                        className={`form-check-input ${errors.daysOff ? 'p-invalid' : ''}`}
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
                        className={`form-check-input ${errors.daysOff ? 'p-invalid' : ''}`}
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
                  {errors.daysOff && (
                    <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                      {errors.daysOff}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group row mb-1">
                <label htmlFor="wageRate" className="col-sm-5 col-form-label custom-label">Wage rate at time of Injury or Disease:</label>
                <div className="col-md-4">
                  <input autoComplete="off"
                    type="text"
                    className="form-control custom-input"
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
        <div ref={headerRef}
          className='collapsible-container'
          onMouseEnter={() => setIsActive(true)}
          onMouseLeave={() => setIsActive(false)}
        >
          <h1 className="custom-h1  header" style={{ cursor: 'pointer' }} onClick={() => setIsActive(prev => !prev)}
            ref={headerRef}
            tabIndex={0}>
            Injury/Illness and Medical
            <span style={{ float: 'right', marginRight: '20px', fontSize: '25px' }}>
              {/* <FontAwesomeIcon icon={isActive ? faChevronUp : faChevronDown} className="fa-sm" /> */}
              <i className={`pi ${isActive ? 'pi-sort-up-fill' : 'pi-sort-down-fill'}`} style={{ fontSize: '1rem' }}></i>
            </span>
          </h1>
          <div className={`collapsible-content ${isActive ? 'active' : ''}`}>
            <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
              <label htmlFor="naicsCode" className="col-sm-4 col-form-label custom-label">NAICS Code:</label>
              <div className="col-sm-8">
                {/* <select
                  id="naicsCode"
                  name="naicsCode"
                  className="form-control custom-input "
                  value={formData.naicsCode}
                  onChange={handleChange}
                >
                  <option>--Select One--</option>
                  <option>Abrasive Product Manufacturing</option>
                  <option>Adhesive Manufacturing</option>
                  <option>Administration of Education Programs</option>
                  <option>Administration of Housing Programs</option>
                </select> */}
                <Dropdown
                  value={formData.naicsCode}
                  name="naicsCode"
                  onChange={handleChange}
                  options={naicsOptions}
                  placeholder="---Select One---"
                  filter
                  className="select-dropdown" />
              </div>
            </div>

            <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
              <label htmlFor="dateOfInjury" className="col-sm-4 col-form-label custom-label">Date Of Injury: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-sm-8">
                <input autoComplete="off"
                  type="date"
                  ref={getFieldRef('dateOfInjury')}
                  className={`form-control custom-input ${errors.dateOfInjury ? 'p-invalid' : ''}`}
                  id="dateOfInjury"
                  name="dateOfInjury"
                  value={formatDateForInput(formData.dateOfInjury)}
                  onChange={handleChange}
                  onClick={(e) => e.target.showPicker()}
                  required
                  disabled='true'
                />
                {errors.dateOfInjury && (
                  <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                    {errors.dateOfInjury}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
              <label htmlFor="timeOfInjury" className="col-sm-4 col-form-label custom-label">Time of Injury:</label>
              <div className="col-sm-8">
                <input autoComplete="off"
                  type="time"
                  className="form-control custom-input"
                  id="timeOfInjury"
                  name="timeOfInjury"
                  value={formData.timeOfInjury}
                  onBlur={(e) => e.target.blur()}
                  onChange={handleChange}
                  onClick={(e) => e.target.showPicker()}
                />
              </div>
            </div>

            <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
              <label htmlFor="countyOfInjury" className="col-sm-4 col-form-label custom-label">County Of Injury: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-sm-8">
                <input autoComplete="off"
                  type="text"
                  ref={getFieldRef('countyOfInjury.description')}
                  className={`form-control custom-input ${errors['countyOfInjury.description'] ? 'p-invalid' : ''}`}
                  id="countyOfInjury"
                  name="countyOfInjury.description"
                  value={formData.countyOfInjury.description}
                  onChange={handleChange}
                  disabled='true'
                  required
                />
                {errors['countyOfInjury.description'] && (
                  <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                    {errors['countyOfInjury.description']}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
              <label htmlFor="dateEmployerKnowledge" className="col-sm-4 col-form-label custom-label">Date Employer had knowledge of Injury:</label>
              <div className="col-sm-8">
                <input autoComplete="off"
                  type="date"
                  className="form-control custom-input"
                  id="dateEmployerKnowledge"
                  name="dateEmployerKnowledge"
                  value={formData.dateEmployerKnowledge}
                  onChange={handleChange}
                  onClick={(e) => e.target.showPicker()}
                />
              </div>
            </div>

            <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
              <label htmlFor="firstDateFailed" className="col-sm-4 col-form-label custom-label">Enter First Date Employee Failed to Work a Full Day:</label>
              <div className="col-sm-8">
                <input autoComplete="off"
                  type="date"
                  className="form-control custom-input"
                  id="firstDateFailed"
                  name="firstDateFailed"
                  value={formData.firstDateFailed}
                  onClick={(e) => e.target.showPicker()}
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
                      ref={getFieldRef('fullPayOnDate')}
                      className={`form-check-input ${errors.fullPayOnDate ? 'p-invalid' : ''}`}
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
                      ref={getFieldRef('fullPayOnDate')}
                      className={`form-check-input ${errors.fullPayOnDate ? 'p-invalid' : ''}`}
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
                      ref={getFieldRef('fullPayOnDate')}
                      className={`form-check-input ${errors.fullPayOnDate ? 'p-invalid' : ''}`}
                      type="radio"
                      name="fullPayOnDate"
                      value="None"
                      style={{ marginTop: "14px" }}
                      checked={formData.fullPayOnDate === 'None'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="None">None</label>
                  </div>
                  {errors.fullPayOnDate && (
                    <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                      {errors.fullPayOnDate}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
              <label className="col-sm-4 col-form-label custom-label">Did Injury/Illness Occur on Employer's premises?: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-sm-8 custom-radio">
                <div>
                  <div className="form-check form-check-inline">
                    <input autoComplete="off"
                      ref={getFieldRef('occurredOnPremises')}
                      className={`form-check-input ${errors.occurredOnPremises ? 'p-invalid' : ''}`}
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
                      ref={getFieldRef('occurredOnPremises')}
                      className={`form-check-input ${errors.occurredOnPremises ? 'p-invalid' : ''}`}
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
                      ref={getFieldRef('occurredOnPremises')}
                      className={`form-check-input ${errors.occurredOnPremises ? 'p-invalid' : ''}`}
                      type="radio"
                      name="occurredOnPremises"
                      value="None"
                      style={{ marginTop: "14px" }}
                      checked={formData.occurredOnPremises === 'None'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="None">None</label>
                  </div>
                  {errors.occurredOnPremises && (
                    <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                      {errors.occurredOnPremises}
                    </div>
                  )}
                </div>

              </div>
            </div>

            <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
              <label htmlFor="injuryType" className="col-sm-4 col-form-label custom-label">Type of Injury/Illness: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-sm-8">
                {/* <select
                  required
                  id="injuryType"
                  name="injuryType"
                  ref={getFieldRef('injuryType')}
                  className={`form-control custom-input ${errors.injuryType ? 'p-invalid' : ''}`}
                  value={formData.injuryType}
                  onChange={handleChange}

                >
                  <option value="">--Select One--</option>
                  <option value="AIDS">AIDS</option>
                  <option value="Adverse reaction to a vaccination or inoculation">Adverse reaction to a vaccination or inoculation</option>
                  <option value="Cancer">Cancer</option>
                </select> */}
                <Dropdown
                  value={formData.injuryType}
                  name="injuryType"
                  onChange={handleChange}
                  options={injuryTypes}
                  placeholder="---Select One---"
                  filter
                  inputRef={getFieldRef('howOccurred')}
                  className={`select-dropdown ${errors.howOccurred ? 'p-invalid' : ''}`}
                />
                {errors.injuryType && (
                  <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                    {errors.injuryType}
                  </div>
                )}
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
                <div className="col-md-14" >
                  {errors.bodyPartAffected && (
                    <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                      {errors.bodyPartAffected}
                    </div>
                  )}
                  <PickList
                    dataKey="id"
                    inputRef={pickListRef}
                    name='bodyPartAffected'
                    value={formData.bodyPartAffected}
                    source={source}
                    target={target}
                    onChange={onChange}
                    itemTemplate={itemTemplate}
                    breakpoint="1280px"
                    sourceHeader={<span style={{ fontSize: '1.0rem' }}>Available</span>}
                    targetHeader={<span style={{ fontSize: '1.0rem' }}>Selected</span>}
                    sourceStyle={{ height: '12rem' }}
                    targetStyle={{ height: '12rem' }}
                    filter
                    responsive
                  />
                </div>
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
                  data-tip={errors.bodyPartAffected  }
                />  */}
              </div>
            </div>
            <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
              <label htmlFor="howOccurred" className="col-sm-4 col-form-label custom-label">How Injury or Illness Occurred: <span style={{ color: 'red' }}>*</span></label>
              <div className="col-sm-8">
                {/* <select
                  id="howOccurred"
                  name="howOccurred"
                  ref={getFieldRef('howOccurred')}
                  className={`form-control custom-input ${errors.howOccurred ? 'p-invalid' : ''}`}
                  value={formData.howOccurred}
                  onChange={handleChange}
                  required
                >
                  <option value="">--Select One--</option>
                  <option value="Abnormal Air Pressure">Abnormal Air Pressure</option>
                  <option value="Absorption, Ingestion or Inhalation, NOC">Absorption, Ingestion or Inhalation, NOC</option>
                  <option value="Broken Glass">Broken Glass</option>
                </select> */}
                <Dropdown
                  value={formData.howOccurred}
                  name="howOccurred"
                  onChange={handleChange}
                  options={howOccurred}
                  placeholder="---Select One---"
                  filter
                  inputRef={getFieldRef('howOccurred')}
                  className={`select-dropdown ${errors.howOccurred ? 'p-invalid' : ''}`}
                />
                {errors.howOccurred && (
                  <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                    {errors.howOccurred}
                  </div>
                )}
              </div>
            </div>
            {/* </form> */}
            {/* <hr style={{ color:'#4baaf5' }} /> */}
            <hr style={{ height: '1px', backgroundColor: 'black', border: 'none', margin: '20px 0' }} />
            <div className="d-flex flex-wrap">
              <div className=" flex-fill">
                {/* <form onSubmit={handleSubmit}> */}
                <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                  <label htmlFor="tPhysicianName" className="col-md-4 col-form-label custom-label ">Treating Physician Name: </label>
                  <div className="col-md-6">
                    <input autoComplete="off"
                      type="text"
                      className="form-control custom-input"
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
                      className="form-control custom-input"
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
                      className="form-control custom-input"
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
                      className="form-control custom-input"
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
                      className="form-control custom-input"
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
                      className="form-control custom-input"
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
                      className="form-control custom-input"
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
                      className="form-control custom-input"
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
                      className="form-control custom-input"
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
                      className="form-control custom-input"
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
                      className="form-control custom-input"
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
                      className="form-control custom-input"
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
                      className="form-control custom-input"
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
                      className="form-control custom-input"
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
                      className="form-control custom-input"
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
                      className="form-control custom-input"
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
                      className="form-control custom-input"
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
                      className="form-control custom-input"
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
                      className="form-control custom-input"
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
                      className="form-control custom-input"
                      id="RtwDate"
                      name="RtwDate"
                      value={formData.RtwDate}
                      onChange={handleChange}
                      onClick={(e) => e.target.showPicker()}
                    />
                  </div>
                </div>
                <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                  <label htmlFor="ReturnedWagePerWeek" className="col-md-3 col-form-label custom-label">Returned at what wage per week:</label>
                  <div className="col-md-2 osition-relative">
                    <input autoComplete="off"
                      type="text"
                      className="form-control custom-input"
                      id="ReturnedWagePerWeek"
                      name="ReturnedWagePerWeek"
                      value={formData.ReturnedWagePerWeek ? formData.ReturnedWagePerWeek : ''}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      //onFocus={handleFocus}
                      style={{ marginRight: '5px' }}
                    />
                  </div>
                </div>
                <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                  <label htmlFor="FatalDeathDate" className="col-md-3 col-form-label custom-label ">If Fatal, Enter Complete Date of Death:</label>
                  <div className="col-md-2">
                    <input autoComplete="off"
                      type="date"
                      className="form-control custom-input"
                      id="FatalDeathDate"
                      name="FatalDeathDate"
                      value={formData.FatalDeathDate}
                      onChange={handleChange}
                      onClick={(e) => e.target.showPicker()}
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
                      className="form-control custom-input"
                      id="reportPreparedBy"
                      name="reportPreparedBy"
                      value={formData.reportPreparedBy}
                      onChange={handleChange}
                      onClick={(e) => e.target.showPicker()}
                    />
                  </div>
                </div>
                <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                  <label htmlFor="telePhoneNumber" className="col-md-3 col-form-label custom-label">Telephone Number:</label>
                  <div className="col-md-3">
                    <input autoComplete="off"
                      type="text"
                      className="form-control custom-input"
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
                      className="form-control custom-input"
                      id="telePhoneExt"
                      name="telePhoneExt"
                      value={formData.telePhoneExt}
                      onChange={handleChange}
                      style={{ marginLeft: '9px' }}
                    />
                  </div>
                  <div className="form-group row mb-1" >
                    <label htmlFor="DateOfReport" className="col-md-3 col-form-label custom-label ">Date of Report:</label>
                    <div className="col-md-3 ml-3" style={{ marginLeft: '4px' }}>
                      <input autoComplete="off"
                        type="date"
                        className="form-control custom-input"
                        id="DateOfReport"
                        name="DateOfReport"
                        value={formData.DateOfReport}
                        onChange={handleChange}
                        onClick={(e) => e.target.showPicker()}
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
            <div className="form-group row mb-1 col-md-11">
              <label className="col-3 col-form-label custom-label mr-0">
                Check which benefits are being paid:<span style={{ color: 'red' }}>*</span>
              </label>
              <div className="col-3 custom-radio d-flex  mt-0 ml-0">
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
                        Average Weekly Wage: $<span style={{ color: 'red' }}>*</span>
                      </label>
                      <div className="col-md-6">
                        <input
                          autoComplete="off"
                          type="text"
                          ref={getFieldRef('averageWeeklyWage')}
                          className={`form-control custom-input ${errors.averageWeeklyWage ? 'p-invalid' : ''}`}
                          id="averageWeeklyWage"
                          name="averageWeeklyWage"
                          value={formData.averageWeeklyWage}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          //onFocus={handleFocus}
                          required
                        />
                        {errors.averageWeeklyWage && (
                          <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                            {errors.averageWeeklyWage}
                          </div>
                        )}
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
                          ref={getFieldRef('weeklyBenifit')}
                          className={`form-control custom-input ${errors.weeklyBenifit ? 'p-invalid' : ''}`}
                          id="weeklyBenifit"
                          name="weeklyBenifit"
                          value={formData.weeklyBenifit}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          required
                        />
                        {errors.weeklyBenifit && (
                          <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                            {errors.weeklyBenifit}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row mb-1">
                      <label htmlFor="DateOfDisablity" className="col-md-4 col-form-label custom-label">
                        Date of disability:
                      </label>
                      <div className="col-md-6">
                        <input
                          autoComplete="off"
                          type="date"
                          className="form-control custom-input"
                          id="DateOfDisablity"
                          name="DateOfDisablity"
                          value={formData.DateOfDisablity}
                          onChange={handleChange}
                          onClick={(e) => e.target.showPicker()}
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
                          type="date"
                          ref={getFieldRef('DateOFFirstPayment')}
                          className={`form-control custom-input ${errors.DateOFFirstPayment ? 'p-invalid' : ''}`}
                          id="DateOFFirstPayment"
                          name="DateOFFirstPayment"
                          value={formData.DateOFFirstPayment}
                          onChange={handleChange}
                          onClick={(e) => e.target.showPicker()}
                          required
                        />
                        {errors.DateOFFirstPayment && (
                          <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                            {errors.DateOFFirstPayment}
                          </div>
                        )}
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
                          ref={getFieldRef('CompensationPaid')}
                          className={`form-control custom-input ${errors.CompensationPaid ? 'p-invalid' : ''}`}
                          id="CompensationPaid"
                          name="CompensationPaid"
                          value={formData.CompensationPaid}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          required
                        />
                        {errors.CompensationPaid && (
                          <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                            {errors.CompensationPaid}
                          </div>
                        )}
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
                          className="form-control custom-input"
                          id="penalityPaid"
                          name="penalityPaid"
                          value={formData.penalityPaid}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        //onFocus={handleFocus}
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
                          ref={getFieldRef('BenifitsPayableByDate')}
                          className={`form-control custom-input ${errors.BenifitsPayableByDate ? 'p-invalid' : ''}`}
                          id="BenifitsPayableByDate"
                          name="BenifitsPayableByDate"
                          value={formData.BenifitsPayableByDate}
                          onChange={handleChange}
                          onClick={(e) => e.target.showPicker()}
                          required
                        />
                        {errors.BenifitsPayableByDate && (
                          <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                            {errors.BenifitsPayableByDate}
                          </div>
                        )}
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
                          ref={getFieldRef('BenifitsPAyableFor')}
                          className={`form-control custom-input ${errors.BenifitsPAyableFor ? 'p-invalid' : ''}`}
                          id="BenifitsPAyableFor"
                          name="BenifitsPAyableFor"
                          value={formData.BenifitsPAyableFor}
                          onChange={handleChange}
                          onClick={(e) => e.target.showPicker()}
                          required
                        />
                        {errors.BenifitsPAyableFor && (
                          <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                            {errors.BenifitsPAyableFor}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row mb-1">
                      <label htmlFor="payBenifitUntil" className="col-md-4 col-form-label custom-label">
                        Pay Benefit Until:
                      </label>
                      <div className="col-md-6">
                        <input
                          autoComplete="off"
                          type="date"
                          className="form-control custom-input"
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
                  <div className="form-group row mb-1 ">
                    <label className="col-md-4 col-form-label  custom-label">Previously Medical Only:</label>
                    <div className="col-md-6 d-flex  flex-wrap ">
                      <div className="form-check custom-radio form-check-inline">
                        <input
                          type="radio"
                          className="form-check-input"
                          name="previouslyMedicalOnly"
                          id="previouslyMedicalYes"
                          value="Yes"
                          onChange={handleChange}
                          style={{ fontSize: '10px', color: 'black', marginTop: '10px' }}
                        />
                        <label className="form-check-label custom-label" htmlFor="previouslyMedicalYes">Yes</label>
                      </div>
                      <div className="form-check custom-radio form-check-inline">
                        <input
                          type="radio"
                          className="form-check-input "
                          name="previouslyMedicalOnly"
                          id="previouslyMedicalNo"
                          onChange={handleChange}
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
                          onChange={handleChange}
                          value="None"
                          style={{ fontSize: '10px', color: 'black', marginTop: '10px' }}
                        />
                        <label className="form-check-label custom-label" htmlFor="previouslyMedicalNone">None</label>
                      </div>
                    </div>
                  </div>
                  <div className="form-group row mb-1">
                    <label htmlFor="averageWeeklyWageAmount" className="col-md-4 col-form-label custom-label">Average Weekly Wage Amount: $</label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control custom-input"
                        id="averageWeeklyWageAmount"
                        name="averageWeeklyWageAmount"
                        value={formData.averageWeeklyWageAmount}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      //onFocus={handleFocus}
                      />
                    </div>
                  </div>
                  <div className="form-group row mb-1">
                    <label htmlFor="weeklyBenefitAmount" className="col-md-4 col-form-label custom-label">Weekly Benefit Amount: $</label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control custom-input"
                        id="weeklyBenefitAmount"
                        name="weeklyBenefitAmount"
                        value={formData.weeklyBenefitAmount}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      //onFocus={handleFocus}
                      />
                    </div>
                  </div>
                  <div className="form-group row mb-1">
                    <label htmlFor="dateOfDisability" className="col-md-4 col-form-label custom-label">Date of Disability:</label>
                    <div className="col-md-6">
                      <input
                        type="date"
                        className="form-control custom-input"
                        id="dateOfDisability"
                        name="dateOfDisability"
                        onChange={handleChange}
                        onClick={(e) => e.target.showPicker()}
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
                        ref={getFieldRef('dateSalaryPaid')}
                        className={`form-control custom-input ${errors.dateSalaryPaid ? 'p-invalid' : ''}`}
                        id="dateSalaryPaid"
                        name="dateSalaryPaid"
                        onClick={(e) => e.target.showPicker()}
                        onChange={handleChange}
                        required
                      />
                      {errors.dateSalaryPaid && (
                        <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                          {errors.dateSalaryPaid}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group row mb-1">
                    <label htmlFor="benefitsPayableFromDate" className="col-md-4 col-form-label custom-label">Benefits Payable From Date:<span style={{ color: 'red' }}>*</span></label>
                    <div className="col-md-6">
                      <input
                        type="date"
                        ref={getFieldRef('benefitsPayableFromDate')}
                        className={`form-control custom-input ${errors.benefitsPayableFromDate ? 'p-invalid' : ''}`}
                        id="benefitsPayableFromDate"
                        name="benefitsPayableFromDate"
                        onClick={(e) => e.target.showPicker()}
                        onChange={handleChange}
                        required
                      />
                      {errors.benefitsPayableFromDate && (
                        <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                          {errors.benefitsPayableFromDate}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group row mb-1">
                    <label htmlFor="benefitsPayableFor" className="col-md-4 col-form-label custom-label">Benefits Payable For:<span style={{ color: 'red' }}>*</span></label>
                    <div className="col-md-6">
                      <select
                        ref={getFieldRef('benefitsPayableFor')}
                        className={`form-control custom-input ${errors.benefitsPayableFor ? 'p-invalid' : ''}`}
                        id="benefitsPayableFor"
                        name="benefitsPayableFor"
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select</option>
                        <option value="Total Disability">TOTAL DISABILITY</option>
                      </select>
                      {errors.benefitsPayableFor && (
                        <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                          {errors.benefitsPayableFor}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group row mb-1">
                    <label htmlFor="payBenefitUntil" className="col-md-4 col-form-label custom-label">Pay Benefit Until:</label>
                    <div className="col-md-6">
                      <input
                        type="date"
                        className="form-control custom-input"
                        id="payBenefitUntil"
                        name="payBenefitUntil"
                        onClick={(e) => e.target.showPicker()}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <h1 className="custom-h1  header" style={{ margingBottom: '10px' }}>
            <input autoComplete="off"
              type="checkbox"
              checked={formData.isControvertEnabled}
              onChange={() => setFormData((prev) => ({ ...prev, isControvertEnabled: !prev.isControvertEnabled }))}
              className="large-checkbox"
              style={{ marginLeft: '10px', marginRight: '5px', marginBottom: '0px' }}
            />
            C. Notice To Convert Payment Of Compensation</h1>
          <div className="form-group row mb-1">
            <label htmlFor="convertType" className="col-md-2 col-form-label custom-label">Controvert Type:<span style={{ color: 'red' }}>*</span></label>
            <div className="col-md-3">
              {/* <select
                id="convertType"
                name="convertType"
                ref={getFieldRef('convertType')}
                className={`form-control custom-input ${errors.convertType ? 'p-invalid' : ''}`}
                value={formData.convertType}
                disabled={!formData.isControvertEnabled}
                onChange={handleChange}
                required
              >
                <option value="">--Select One--</option>
                <option value="ALL THE ENTIRE CASE IS CONTROVERTED">ALL THE ENTIRE CASE IS CONTROVERTED</option>
                <option value="LOST TIME IS CONTROVERTED, HOWEVER MEDICAL OR OTHER BENEFITS HAVE BEEN ACCEPTED">LOST TIME IS CONTROVERTED, HOWEVER MEDICAL OR OTHER BENEFITS HAVE BEEN ACCEPTED</option>
                <option value="MEDICAL IS DENIED">MEDICAL IS DENIED</option>
                <option value="PARTIAL DENIAL OF MEDICAL">PARTIAL DENIAL OF MEDICAL</option>
              </select> */}
              <Dropdown
                value={formData.convertType}
                id="convertType"
                name="convertType"
                onChange={handleChange}
                options={convertTypes}
                placeholder="---Select One---"
                disabled={!formData.isControvertEnabled}
                filter
                className={`select-dropdown-ct ${errors.convertType ? 'p-invalid' : ''}`}
              />
              {errors.convertType && (
                <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                  {errors.convertType}
                </div>
              )}
            </div>
          </div>
          <div className="form-group row mb-1">
            <label htmlFor="BenifitsNPReasons" className="col-md-2 col-form-label custom-label">Reason Benefits will not be paid:</label>
            <div className="col-md-5">
              <textarea
                name="BenifitsNPReasons"
                className="form-control-nr"
                value={formData.BenifitsNPReasons}
                disabled={!formData.isControvertEnabled}
                onChange={handleChange}
                rows="5"
                cols="70"
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
          <div className="form-group mb-1 d-flex align-items-center">
            <span className="text-danger me-2" style={{ fontSize: '20px' }}>*</span>

            <input
              autoComplete="off"
              type="checkbox"
              name="indemnityEnabaled"
              checked={formData.indemnityEnabaled}
              onChange={() => setFormData((prev) => ({ ...prev, indemnityEnabaled: !prev.indemnityEnabaled }))}
              disabled={!formData.isMedicalInjuryEnabled}
              ref={getFieldRef('convertType')}
              className={`large-checkbox ${errors.convertType ? 'p-invalid' : ''} me-1`}
            />

            <label className="custom-label">No indemnity benefits are due and/or have NOT been controverted.</label>
          </div>

          {errors.indemnityEnabaled && (
            <div className="error-message" style={{ fontSize: '12px', marginTop: '5px', marginLeft: '20px' }}>
              {errors.indemnityEnabaled}
            </div>
          )}
        </div>
        <div ref={attachmentsRef}>
          <h1 className="custom-h1 header">Attachments</h1>
          <Toast ref={toast} style={{ position: 'fixed', right: '20px', top: '20px' }} />
          <label className="custom-file-upload">
            <input autoComplete="off" type="file" onChange={handleFileUpload} accept="application/pdf, .doc, .docx, .jpg, .png" style={{ display: 'none' }} />
            Choose File
          </label>
          <div className="card">
            <DataTable value={documents} paginator rows={5} className="datatable custom-label custom-datatable"
              style={{ minWidth: '600px' }} >
              <Column field="id" header="#" />
              <Column field="name" header="Document Name" />
              <Column body={actionBodyTemplate} header="Actions" />
            </DataTable>
          </div>

          <Dialog
            header={<span style={{ fontSize: '15px' }}>Confirmation</span>}
            visible={deleteVisible}
            onHide={() => {
              setDeleteVisible(false);
              attachmentsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            style={{ width: '400px', height: '200px' }}
            modal
          >
            <p style={{ fontSize: '15px' }}>Are you sure you want to delete this document?</p>
            <Button label="Yes"
              onClick={() => {
                confirmDelete();
                attachmentsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="p-button-info" style={{ marginRight: '10px', fontSize: '12px' }} />
            <Button label="No"
              onClick={() => {
                setDeleteVisible(false);
                attachmentsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="p-button-danger" style={{ marginRight: '10px', fontSize: '12px' }} />
          </Dialog>


          <Dialog
            header="View Document"
            visible={viewVisible}
            onHide={() => {
              hideViewModal();
              attachmentsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
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
              <div className="form-group row mb-1" >
                <label className="col-sm-8 col-form-label custom-label custom-label-no-padding">Insurer/Self-Insurer: Type or Print Name of Person Filing Form:</label>
                <div className="col-sm-2  mt-2 ">
                  <span style={{ fontSize: '15px' }} className='value'>Nikhila D</span>
                </div>
              </div>
              <div className="form-group row mb-1" >
                <label htmlFor="submittedDate" className="col-sm-8 col-form-label custom-label ">Date:</label>
                <div className="col-2  mt-2 ">
                  <span style={{ fontSize: '15px' }} className='value'>10/20/2024</span>
                </div>
              </div>
            </div>
            <div className="form-section flex-fill pl-3">
              <div className="form-group row mb-1" >
                <label className="col-sm-3 col-form-label custom-label custom-label-no-padding">Phone Number:</label>
                <div className="col-sm-3  mt-2">
                  <span style={{ fontSize: '15px' }} >(404) 657-2995</span>
                </div>
                <label className="col-sm-1 col-form-label custom-label custom-label-no-padding">Ext:</label>
                <div className="col-sm-2  mt-2 ">
                  <span style={{ fontSize: '15px' }}>ext</span>
                </div>
              </div>
              <div className="form-group row mb-1" >
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
          <button type="button" className="btn btn-primary mx-2 mb-10  custom-label"
            style={{
              backgroundColor: clicked ? '#4baaf5' : '#4baaf5', border: 'none', color: 'black'
            }}
            onClick={() => setClicked(!clicked)}>Save</button>
          <button type="submit" className="btn btn-primary mx-2 mb-10  custom-label"
            style={{
              backgroundColor: clicked ? '#4baaf5' : '#4baaf5', border: 'none', color: 'black'
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
