import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { PickList } from 'primereact/picklist';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { ButtonGroup } from 'primereact/buttongroup';
import { Dialog } from 'primereact/dialog';
import NewClaimComponent from "./NewClaimComponent.js";
import Modal from './Modal.js';
import ClaimService from "../services/claim.service";
import ClaimPartyService from "../services/claim.party.service";
import { Dropdown } from 'primereact/dropdown';
import StateTypeService from "../services/state.type.service";
import NaicsTypeService from "../services/naics.type.service";
import InjuryTypeService from "../services/injury.type.service";
import InjuryCauseTypeService from "../services/injury.cause.type.service";
import ControvertTypeService from "../services/controvert.type.service";
import TreatmentTypeService from "../services/treatment.type.service";
import { Accordion, AccordionTab } from 'primereact/accordion';
import DisabilityTypeService from "../services/disability.type.service";

const Wc1FormComponent = () => {
  const [stateTypes, setStateTypes] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [naicsTypes, setNaicsTypes] = useState([]);
  const [typeOfInjury, setInjuryTypes] = useState([]);
  const [injuryCauseTypes, setInjuryCauseTypes] = useState([]);
  const [activeTab, setActiveTab] = useState('tab1');
  const [controvertTypes, setControvertTypes] = useState([]);
  const [physicianStateTypes, setPhysicianStateTypes] = useState([]);
  const [hospitalStateTypes, setHospitalStateTypes] = useState([]);
  const [disabilityTypes, setDisabilityTypes] = useState([]);
  const [treatmentTypes, setTreatmentTypes] = useState([]);
  // Handle tab switch
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const Pagination = ({ className, currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange }) => {
    return (
      <div className={`pagination-container d-flex justify-content-${className} mb-3`}>
        <select className="form-select custom-select" style={{ width: '50px', fontSize: '14px', padding: '5px' }}
          value={itemsPerPage} onChange={(e) => onItemsPerPageChange(Number(e.target.value))}>
          {[2, 4, 6, 8, 10].map((num) => (
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
  

  const headerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [source, setSource] = useState([]);
  const [target, setTarget] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [fileUrl, setFileUrl] = useState(null);
  const [docToDelete, setDocToDelete] = useState(null);
  const [viewVisible, setViewVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  // const [clicked, setClicked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);
  const fieldRefs = useRef({});
  const attachmentsRef = useRef(null);
  const toastRef = React.useRef(null);
  const toast = React.useRef(null);
  const pickListRef = useRef(null);
  //const [isHovering, setIsHovering] = useState(false);
  // Keep track of which accordion section is open
  const [activeIndex, setActiveIndex] = useState(null);

  // Function to toggle the accordion section
  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

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

  useEffect(() => {
    ClaimPartyService.getClaimPartyByClaimId()
      .then((response) => {
        console.log(response);
        // setFormData(response.data);
        // console.log("formData", formData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    StateTypeService.getAllStateTypes()
      .then((response) => {
        console.log(response.data);

        const defaultState = response.data.find(state => state.code === 'GA');
        console.log("defaultState", defaultState);
        setStateTypes(response.data);
        setFormData(prevData => ({
          ...prevData,
          state: defaultState ? defaultState.code : 'GA',
        }));
        console.log("selectedState", formData.state);
        // setSelectedStateValue(response.data[0].value); // Set the default value
        console.log("stateTypes", stateTypes);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    StateTypeService.getAllStateTypes()
      .then((response) => {
        console.log(response);
        setPhysicianStateTypes(response.data);
        console.log("physicianStateTypes", stateTypes);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    StateTypeService.getAllStateTypes()
      .then((response) => {
        console.log(response);
        setHospitalStateTypes(response.data);
        console.log("hospitalStateTypes", stateTypes);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    TreatmentTypeService.getAllTreatmentTypes()
      .then((response) => {
        console.log(response);
        setTreatmentTypes(response.data);
        console.log("treatmentTypes", treatmentTypes);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  
  useEffect(() => {
    NaicsTypeService.getAllNaicsTypes()
      .then((response) => {
        console.log(response);
        setNaicsTypes(response.data);
        console.log("naicsTypes", naicsTypes);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    InjuryTypeService.getAllInjuryTypes()
      .then((response) => {
        console.log(response);
        setInjuryTypes(response.data);
        console.log("typeOfInjury", typeOfInjury);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    InjuryCauseTypeService.getAllInjuryCauseTypes()
      .then((response) => {
        console.log(response);
        setInjuryCauseTypes(response.data);
        console.log("injuryCauseTypes", injuryCauseTypes);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    ControvertTypeService.getAllControvertTypes()
      .then((response) => {
        console.log(response);
        setControvertTypes(response.data);
        console.log("controvertTypes", controvertTypes);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    DisabilityTypeService.getAllDisabilityTypes()
      .then((response) => {
        console.log(response);
        setDisabilityTypes(response.data);
        console.log("disabilityTypes", disabilityTypes);
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
      toast.current.show({ severity: 'success', summary: 'File Uploaded', detail: file.name, life: 3000, style: { backgroundColor: '#4baaf5', color: '#FFFFFF'}, });
      event.target.value = null;
    }
  };
  const hideViewModal = () => {
    setViewVisible(false);
    setFileUrl(null);
  };
  const confirmDelete = () => {
    setDocuments(documents.filter(doc => doc.id !== docToDelete));
    toast.current.show({ severity: 'warn', summary: 'Document Deleted', detail: `Deleted ID ${docToDelete}`, life: 3000, style: { backgroundColor: '#dd4f4f', color: '#FFFFFF'}, });
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
      state: 'Georgia',
      zip: '',
      primaryEmail: '',
      primaryPhone: '',
    },
    countyOfInjury: {
      description: '',
    },
    
    daysWorkedPerWeek: '',
    insurerFileNo: '',
    jobClassificationCode: '',
    dateHired: '',
    wageRate: '',
    daysOff: '',
    wageRateFrequency: 'perHour',
    outOfCountryAddress: '',
    stateTypes: [],
    physicianStateTypes: [],
    hospitalStateTypes: [],
    naicsType: '',
    naicsTypes: [],
    typeOfInjury: [],
    injuryCauseTypes: [],
    controvertTypes: [],
    dateOfInjury: '',
    timeOfInjury: '',
    dateEmployerNotified: '',
    dateFailedToWorkFullDay: '',
    receivedFullPay: 'Yes',
    injuredInEmpPermises: '',
    bodyPartAffected: [],
    treatmentTypes: [],
    otherInjuryCause: '',
    typeOfInjury: '',
    tPhysicianAddress: '',
    physicianName: '',
    physicianPhoneExt: '',
    PhysicianPhone: '',
    physicianZipExt: '',
    PhysicianZIP: '',
    tPhysicianState: '',
    physicianCity: '',
    physicianAddress2: '',
    physicianAddress1: '',
    initialTreatmentGiven: '',
    hospitalName: '',
    hospitalAddress1: '',
    hospitalAddress2: '',
    hospitalCity: '',
    hospitalState: '',
    hospitalZip: '',
    hospitalZipExt: '',
    hospitalPhone: '',
    hospitalPhoneExt: '',
    dateReturnedToWork: '',
    wagePerWeekAfterReturn: '',
    dateOfDeath: '',
    reportPreparedBy: '',
    reportPreparedPhone: '',
    reportPreparedPhoneExt: '',
    weeklyBenefit: '',
    dateOfReport: '',
    incomeBenefits: '',
    convertType: '',
    BenifitsNPReasons: '',
    sectionB: false,
    isControvertEnabled: false,
    isMedicalInjuryEnabled: false,
    controverted: false,
    document: null,
    payBenefitUntil: '',
    benefitsPayableFor: '',
    benefitsPayableFromDate: '',
    dateSalaryPaid: '',
    dateOfDisability: '',
    weeklyBenefitAmount: '',
    averageWeeklyWage: '',
    previousMedicalOnly: '',
    averageWeeklyWageAmount: '',
    disabilityTypes: []
  });

  const [parties, setParties] = useState([
    { partyType: 'Claimant', partyName: 'CLAYTON HUTCHINSON', parentParty: '', selfInsured: '', selfAdministered: '', groupFundMember: '' },
    { partyType: 'Employer', partyName: 'PC METRO BOTTLING', parentParty: '', selfInsured: 'No', selfAdministered: 'No', groupFundMember: 'No' },
    { partyType: 'Insurer', partyName: 'INDEMNITY INSURANCE COMPANY OF NORTH AMERICA', parentParty: 'PC METRO BOTTLING', selfInsured: '', selfAdministered: '', groupFundMember: '' },
    { partyType: 'Claims Office	', partyName: 'SEDGWICK CMS INC', parentParty: 'INDEMNITY INSURANCE COMPANY OF NORTH AMERICA	', selfInsured: '', selfAdministered: '', groupFundMember: '' },
    { partyType: 'Attorney', partyName: 'DAVID IMAHARA', parentParty: '', selfInsured: '', selfAdministered: '', groupFundMember: '' },
  ]);

  const convertTypes = [
    { label: 'ALL THE ENTIRE CASE IS CONTROVERTED', value: 'ALL THE ENTIRE CASE IS CONTROVERTED' },
    { label: 'LOST TIME IS CONTROVERTED, HOWEVER MEDICAL OR OTHER BENEFITS HAVE BEEN ACCEPTED', value: 'LOST TIME IS CONTROVERTED, HOWEVER MEDICAL OR OTHER BENEFITS HAVE BEEN ACCEPTED' },
    { label: 'MEDICAL IS DENIED', value: 'MEDICAL IS DENIED' },
    { label: 'PARTIAL DENIAL OF MEDICAL', value: 'PARTIAL DENIAL OF MEDICAL' }
  ]
  const handleCheckboxChange = () => {
    setFormData((prev) => {
      if (prev.sectionB) {
        return {
          ...prev,
          sectionB: false,
          incomeBenefits: '',
          averageWeeklyWage: '',
          weeklyBenefit: '',
          dateOfDisability: '',
          dateOfFirstPayment: '',
          compensationPaid: '',
          penalityPaid: '',
          dateBenefitsPayableFrom: '',
          benefitsPayableFor: '',
          disabilityTypes:'',
          dateUntilBenefitsPaid: '',
        };
      } else {
        return { ...prev, sectionB: true };
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("value::", value);
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
    } 
    
    else {
  //   const numericFields = ['wagePerWeekAfterReturn', 'averageWeeklyWage', 'weeklyBenefitAmount', 'averageWeeklyWageAmount', 'compensationPaid', 'penalityPaid', 'weeklyBenefit'];
  //   console.log("name === 'claimant.state'::", name === "claimant.state");
  // if (numericFields.includes(name)) {
  //   if (/^\d*\.?\d*$/.test(value) || value === '') {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: value,
  //     }));
  //   }
  // }else 
  if (name === 'claimant.state') {
    console.log("name::", value);
    // Handle state dropdown 
    setFormData((prevData) => ({
      ...prevData,
claimant: {
          ...prevData.claimant,
state: value,  
      },
  }));
                } 
           else {
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
        'Blindness in Both Eyes',
        'Body Systems and Multiple Body Systems',
        'Brain',
        'Buttocks',
        'Check',
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
  const errorTabMapping = {
    'claimant.firstName': 'tab1',
    'claimant.lastName': 'tab1',
    'claimant.address1': 'tab1',
    'claimant.city': 'tab1',
    'claimant.state': 'tab1',
    'claimant.zip': 'tab1',
    'claimant.gender': 'tab1',
    'daysWorkedPerWeek': 'tab3',
    'daysOff': 'tab3',
    'dateOfInjury': 'tab4',
    'countyOfInjury.description': 'tab4',
    'receivedFullPay': 'tab4',
    'injuredInEmpPermises': 'tab4',
    'typeOfInjury': 'tab4',
    'otherInjuryCause': 'tab4',
    'sectionB': 'tab5',
    'incomeBenefits': 'tab5',
    'averageWeeklyWage': 'tab5',
    'dateOfFirstPayment': 'tab5',
    'compensationPaid': 'tab5',
    'dateBenefitsPayableFrom': 'tab5',
    'benefitsPayableFor': 'tab5',
    'weeklyBenefit': 'tab5',
    'dateSalaryPaid': 'tab5',
    'benefitsPayableFromDate': 'tab5',
    'disabilityTypes':'tab5',
    'convertType': 'tab5',
    'controverted': 'tab5',
    'isControvertEnabled': 'tab5',
    'isMedicalInjuryEnabled': 'tab5',
    // Add more mappings as needed
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form to be Submitted:', formData);
    const requiredFields = [
      'claimant.firstName', 'claimant.lastName', 'claimant.address1', 'claimant.city',
      'claimant.state', 'claimant.zip', 'claimant.gender', 'daysWorkedPerWeek',
      'daysOff', 'dateOfInjury', 'countyOfInjury.description', 'receivedFullPay',
      'injuredInEmpPermises', 'otherInjuryCause', 'typeOfInjury'
    ];
    const newErrors = validateRequiredFields(formData, requiredFields);
    const validateConditionalFields = () => {


      if (formData.sectionB) {
        const sectionBRequired = ['incomeBenefits'];
        Object.assign(newErrors, validateRequiredFields(formData, sectionBRequired));
        if (formData.incomeBenefits === 'incomeBenefitsPaid') {
          const incomeBenefitsRequiredFields = [
            'averageWeeklyWage', 'dateOfFirstPayment',
            'compensationPaid', 'dateBenefitsPayableFrom', 'disabilityTypes', 'weeklyBenefit'
          ];
          Object.assign(newErrors, validateRequiredFields(formData, incomeBenefitsRequiredFields));
        }
        if (formData.incomeBenefits === 'salaryInLieu') {
          const salaryInLieuRequiredFields = [
            'dateSalaryPaid', 'benefitsPayableFromDate', 'disabilityTypes'
          ];
          Object.assign(newErrors, validateRequiredFields(formData, salaryInLieuRequiredFields));
        }
      }
      if (formData.isControvertEnabled) {
        const controvertRequiredFields = ['convertType'];
        Object.assign(newErrors, validateRequiredFields(formData, controvertRequiredFields));
      }
      if (formData.isMedicalInjuryEnabled) {
        const indemnityRequiredFields = ['controverted'];
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
        // Get the first error field
        const firstErrorField = Object.keys(newErrors)[0];

        // Mapping error fields to their corresponding tabs


        // Determine the tab of the first error
        const targetTab = errorTabMapping[firstErrorField]; // Default to 'tab1' if not mapped

        // If the error's tab is not the current active tab, set it
        if (targetTab !== activeTab) {
          setActiveTab(targetTab);
          console.log("formData.tab3..",formData.tab3);
          formData.tab3 = true;
          console.log("formData.tab3...",formData.tab3);
        }


        // Scroll to the first error field
        if (fieldRefs.current[firstErrorField]) {
          const ref = fieldRefs.current[firstErrorField].current;
          if (ref && ref instanceof HTMLElement) {
            ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
            ref.focus(); // Optionally, focus the field with the error
          }
        }

      }
      // if (!formData.sectionB && !formData.isMedicalInjuryEnabled && !formData.isControvertEnabled) {
      //   if (activeTab !== 'tab5') {
      //     alert("Section B or C or D is required.");
      //     setActiveTab('tab5');
      //     return;
      //   }
      // }


    };

    // If there are errors, set the error state and handle scrolling
    if (Object.keys(newErrors).length > 0) {
      console.log('Errors found:', newErrors);
      setErrors(newErrors);
      const tab5Errors = ['sectionB', 'isControvertEnabled', 'isMedicalInjuryEnabled'].filter(field => newErrors[field]);
      if (tab5Errors.length > 0) {
        // If there are errors in Tab 5, select Tab 5 programmatically
        setActiveTab('tab5'); // Tab 5 is index 4 (0-based index)
      }
      scrollToFirstError(); // Scroll to the first error field

      return;
    }

    // else {

    if (!formData.sectionB && !formData.isMedicalInjuryEnabled && !formData.isControvertEnabled) {
      if (activeTab !== 'tab5') {
        alert("Section B or C or D is required.");
        setActiveTab('tab5');
        return;
      }
    } else {


      // If form is valid, show success toast and submit the form
      toastRef.current.show({
        severity: 'success',
        summary: 'Submission Successful',
        detail: 'Your form has been successfully submitted!',
        life: 3000,
      });
      console.log('Submitting form with data:', formData);
      setIsActive(false); // Reset active state if needed
    }

    // Reset active state after submission
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
      // if (typeof value !== 'string' || value.trim() === '') {
      //   newErrors[field] = `${field.replace('claimant.', '')} is required.`;
      // }

      if (!value || (Array.isArray(value) && value.length === 0)) {
        newErrors[field] = `${field.replace('claimant.', '')} is required.`;
      } else if (typeof value === 'string' && value.trim() === '') {
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
    daysWorkedPerWeek: '', dateOfInjury: '', countyOfInjury: '', receivedFullPay: '', injuredInEmpPermises: '', otherInjuryCause: '', typeOfInjury: '',
    bodyPartAffected: false, averageWeeklyWage: '',
    weeklyBenefit: '', dateOfFirstPayment: '', compensationPaid: '',
    dateBenefitsPayableFrom: '', benefitsPayableFor: ''
    , benefitsPayableFromDate: '', sectionB: '', incomeBenefits: '',
    dateSalaryPaid: '', disabilityTypes: '', convertType: '', controverted: ''
  });



  const totalPages = Math.ceil(parties.length / itemsPerPage);
  const paginatedParties = parties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="tabs container">
      <h1 className="custom-h1 header" style={{ marginTop: '5px' }}>WC-1, Employers First Report of Injury</h1>

      <form onSubmit={handleSubmit} noValidate>

        <Toast ref={toastRef} />

      <Toast ref={toastRef} />

      {/* <NewClaimComponent /> */}
      <div className="tab-titles">

        <button type="button"
          className={activeTab === 'tab1' ? 'active' : ''}
          onClick={(e) => {e.preventDefault(); handleTabClick('tab1');}}
        >
          Claimant Information
        </button>
        <button type="button"
          className={activeTab === 'tab2' ? 'active' : ''}
          onClick={(e) => {e.preventDefault(); handleTabClick('tab2');}}
        >
          Party Information
        </button>
        <button type="button"
          className={activeTab === 'tab3' ? 'active' : ''}
          onClick={(e) => {e.preventDefault(); handleTabClick('tab3');}}
        >
          Employment/Wage
        </button>
        <button type="button"
          className={activeTab === 'tab4' ? 'active' : ''}
          onClick={(e) => {e.preventDefault(); handleTabClick('tab4');}}
        >
          Injury/Illness & Medical
        </button>
        <button type="button"
            className={activeTab === 'tab5' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); handleTabClick('tab5'); }}
          >
            Section B, C, D
         
          </button>
          <button type="button"
            className={activeTab === 'tab8' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); handleTabClick('tab8'); }}
          >
            Attachments
          </button>
        


      </div>
      <div className="tab-content">
        {activeTab === 'tab1' && (
          <div className="card">
            <h1 className="custom-h1 header" style={{ marginTop: '5px' }}>Claimant Information</h1>
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
                  <label htmlFor="stateTypes" className="col-md-4 col-form-label custom-label">State: <span style={{ color: 'red' }}>*</span></label>
                 
                  <div className="col-md-4">
                        <Dropdown
                          value={formData.stateTypes}
                          name="stateTypes"
                          onChange={handleChange}
                          options={stateTypes.map(type => ({
                            label: type.description, // Displayed in the dropdown
                            value: type.value // Value sent on change
                          }))}
                          filter
                          className="dropdown-select" 
                          placeholder="Georgia"/>

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
          </div>
        )}
        {activeTab === 'tab2' && (
          <div className="card">
            <h1 className="custom-h1 header" style={{ marginTop: '5px' }}>Party Information</h1>
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
        )}
        {activeTab === 'tab3' && (
          <div className="card">
            <h1 className="custom-h1 header" style={{ marginTop: '5px' }}>EMPLOYMENT/WAGE</h1>
            <div className="d-flex flex-wrap">
              <div className="form-section  flex-fill">
                {/* <form onSubmit={handleSubmit}> */}
                <div className="form-group row mb-1">
                  <label htmlFor="dateHired" className="col-sm-4 col-form-label custom-label">Date Hired by Employer :</label>
                  <div className="col-md-4">
                    <input autoComplete="off"
                      type="date"
                      className="form-control custom-input"
                      id="dateHired"
                      name="dateHired"
                      value={formData.dateHired}
                      onChange={handleChange}
                      onClick={(e) => e.target.showPicker()}
                    />
                  </div>
                </div>
                <div className="form-group row mb-1">
                  <label htmlFor="jobClassificationCode" className="col-sm-4 col-form-label custom-label">Job Classified Code No :</label>
                  <div className="col-md-4">
                    <input autoComplete="off"
                      type="text"
                      className="form-control custom-input"
                      id="jobClassificationCode"
                      name="jobClassificationCode"
                      value={formData.jobClassificationCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group row mb-1">
                  <label htmlFor="insurerFileNo" className="col-sm-4 col-form-label custom-label">Insurer/Self Insurer File# :</label>
                  <div className="col-md-4">
                    <input autoComplete="off"
                      type="text"
                      className="form-control custom-input"
                      id="insurerFileNo"
                      name="insurerFileNo"
                      value={formData.insurerFileNo}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {/* </form> */}
              </div>
              <div className="form-section flex-fill pl-3">
                {/* <form onSubmit={handleSubmit}> */}
                <div className="form-group row mb-1">
                  <label htmlFor="daysWorkedPerWeek" className="col-sm-5 col-form-label custom-label">Number of Days Worked Per Week:<span style={{ color: 'red' }}>*</span></label>
                  <div className="col-md-4">
                    <input autoComplete="off"
                      type="text"
                      ref={getFieldRef('daysWorkedPerWeek')}
                      className={`form-control custom-input ${errors.daysWorkedPerWeek ? 'p-invalid' : ''}`}
                      id="daysWorkedPerWeek"
                      name="daysWorkedPerWeek"
                      value={formData.daysWorkedPerWeek}
                      onChange={handleChange}
                      required
                    />
                    {errors.daysWorkedPerWeek && (
                      <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                        {errors.daysWorkedPerWeek}
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
                  <div className="col-md-6">
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
        )}
        {activeTab === 'tab4' && (
          <div className="card">
            {/* <h1 className="custom-h1 header" style={{ marginTop: '5px' }}>INJURY/ILLNESS AND MEDICAL</h1> */}
            <Accordion activeIndex={0}>
                <AccordionTab header="Injury/Illness" onClick={() => handleToggle(0)}>
                  <div className={`accordion-content ${activeIndex === 0 ? 'active' : ''}`}>
                <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
                  <label htmlFor="naicsTypes" className="col-sm-4 col-form-label custom-label">NAICS Code:</label>
                  <div className="col-sm-7">
                    <Dropdown
                      value={formData.naicsTypes}
                      name="naicsTypes"
                      onChange={handleChange}
                      // options={naicsTypes}
                      options={naicsTypes.map(type => ({
                        label: type.description, // Displayed in the dropdown
                        value: type.code // Value sent on change
                      }))}
                      placeholder="---Select One---"
                      filter
                      className="dropdown-select" />
                  </div>
                </div>

                <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
                  <label htmlFor="dateOfInjury" className="col-sm-4 col-form-label custom-label">Date Of Injury: <span style={{ color: 'red' }}>*</span></label>
                  <div className="col-sm-2">
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
                  <div className="col-sm-2">
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
                  <div className="col-sm-2">
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
                  <label htmlFor="dateEmployerNotified" className="col-sm-4 col-form-label custom-label">Date Employer had knowledge of Injury:</label>
                  <div className="col-sm-2">
                    <input autoComplete="off"
                      type="date"
                      className="form-control custom-input"
                      id="dateEmployerNotified"
                      name="dateEmployerNotified"
                      value={formData.dateEmployerNotified}
                      onChange={handleChange}
                      onClick={(e) => e.target.showPicker()}
                    />
                  </div>
                </div>

                <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
                  <label htmlFor="dateFailedToWorkFullDay" className="col-sm-4 col-form-label custom-label">Enter First Date Employee Failed to Work a Full Day:</label>
                  <div className="col-sm-2">
                    <input autoComplete="off"
                      type="date"
                      className="form-control custom-input"
                      id="dateFailedToWorkFullDay"
                      name="dateFailedToWorkFullDay"
                      value={formData.dateFailedToWorkFullDay}
                      onClick={(e) => e.target.showPicker()}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
                  <label className="col-sm-4 col-form-label custom-label">Did Employee Receive Full Pay on Date of Injury: <span style={{ color: 'red' }}>*</span></label>
                  <div className="col-sm-6 custom-radio">
                    <div>
                      <div className="form-check form-check-inline">
                        <input autoComplete="off"
                          ref={getFieldRef('receivedFullPay')}
                          className={`form-check-input ${errors.receivedFullPay ? 'p-invalid' : ''}`}
                          type="radio"
                          name="receivedFullPay"
                          value="Yes"
                          style={{ marginTop: "14px" }}
                          checked={formData.receivedFullPay === 'Yes'}
                          onChange={handleChange}
                          required
                        />
                        <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="Yes">Yes</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input autoComplete="off"
                          ref={getFieldRef('receivedFullPay')}
                          className={`form-check-input ${errors.receivedFullPay ? 'p-invalid' : ''}`}
                          type="radio"
                          name="receivedFullPay"
                          value="No"
                          style={{ marginTop: "14px" }}
                          checked={formData.receivedFullPay === 'No'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="No">No</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input autoComplete="off"
                          ref={getFieldRef('receivedFullPay')}
                          className={`form-check-input ${errors.receivedFullPay ? 'p-invalid' : ''}`}
                          type="radio"
                          name="receivedFullPay"
                          value="None"
                          style={{ marginTop: "14px" }}
                          checked={formData.receivedFullPay === 'None'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="None">None</label>
                      </div>
                      {errors.receivedFullPay && (
                        <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                          {errors.receivedFullPay}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
                  <label className="col-sm-4 col-form-label custom-label">Did Injury/Illness Occur on Employer's premises?: <span style={{ color: 'red' }}>*</span></label>
                  <div className="col-sm-6 custom-radio">
                    <div>
                      <div className="form-check form-check-inline">
                        <input autoComplete="off"
                          ref={getFieldRef('injuredInEmpPermises')}
                          className={`form-check-input ${errors.injuredInEmpPermises ? 'p-invalid' : ''}`}
                          type="radio"
                          name="injuredInEmpPermises"
                          value="Yes"
                          style={{ marginTop: "14px" }}
                          checked={formData.injuredInEmpPermises === 'Yes'}
                          onChange={handleChange}
                          required
                        />
                        <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="Yes">Yes</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input autoComplete="off"
                          ref={getFieldRef('injuredInEmpPermises')}
                          className={`form-check-input ${errors.injuredInEmpPermises ? 'p-invalid' : ''}`}
                          type="radio"
                          name="injuredInEmpPermises"
                          value="No"
                          style={{ marginTop: "14px" }}
                          checked={formData.injuredInEmpPermises === 'No'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="No">No</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input autoComplete="off"
                          ref={getFieldRef('injuredInEmpPermises')}
                          className={`form-check-input ${errors.injuredInEmpPermises ? 'p-invalid' : ''}`}
                          type="radio"
                          name="injuredInEmpPermises"
                          value="None"
                          style={{ marginTop: "14px" }}
                          checked={formData.injuredInEmpPermises === 'None'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label custom-label" style={{ marginTop: "12px" }} htmlFor="None">None</label>
                      </div>
                      {errors.injuredInEmpPermises && (
                        <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                          {errors.injuredInEmpPermises}
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                <div className="form-group row mb-2" style={{ marginLeft: '5px' }}>
                  <label htmlFor="typeOfInjury" className="col-sm-4 col-form-label custom-label">Type of Injury/Illness: <span style={{ color: 'red' }}>*</span></label>
                  <div className="col-sm-7">
                    <Dropdown
                      value={formData.typeOfInjury}
                      name="typeOfInjury"
                      onChange={handleChange}
                      // options={naicsTypes}
                      options={typeOfInjury.map(type => ({
                        label: type.description, // Displayed in the dropdown
                        value: type.value // Value sent on change
                      }))}
                      placeholder="---Select One---"
                      filter
                      inputRef={getFieldRef('typeOfInjury')}
                      dropdownClassName="custom-dropdown-panel"
                      className={`dropdown-select ${errors.typeOfInjury ? 'p-invalid' : ''}`}
                    />
                    {errors.typeOfInjury && (
                      <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                        {errors.typeOfInjury}
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
                  <label htmlFor="otherInjuryCause" className="col-sm-4 col-form-label custom-label">How Injury or Illness Occurred: <span style={{ color: 'red' }}>*</span></label>
                  <div className="col-sm-7">
                    <div className="col-md-6">
                  <textarea
                  name="otherInjuryCause"
                  className="form-control-nr"
                  value={formData.otherInjuryCause}
                  onChange={handleChange}
                  rows="3"
                  cols="100"
                  style={{ marginTop: '0px', resize: 'none' }}
                />
                    </div>
                    {errors.otherInjuryCause && (
                      <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                        {errors.otherInjuryCause}
                      </div>
                    )}
                    <hr style={{ height: '0px', backgroundColor: 'none', border: 'none', margin: '4px 0' }} />
                    <Dropdown
                      value={formData.injuryCauseTypes}
                      name="injuryCauseTypes"
                      onChange={handleChange}
                      options={injuryCauseTypes.map(type => ({
                        label: type.description, // Displayed in the dropdown
                        value: type.value // Value sent on change
                      }))}
                      placeholder="---Select One---"
                      filter
                      inputRef={getFieldRef('injuryCauseTypes')}
                      className={`dropdown-select ${errors.injuryCauseTypes ? 'p-invalid' : ''}`}
                    />

                  </div>
                </div>
                </div>
                {/* </form> */}
                {/* <hr style={{ color:'#4baaf5' }} /> */}
                </AccordionTab>
                <AccordionTab header="Medical" onClick={() => handleToggle(0)}>
                  <div className={`accordion-content ${activeIndex === 0 ? 'active' : ''}`}>
                <div className="d-flex flex-wrap">
                  <div className=" flex-fill">
                    {/* <form onSubmit={handleSubmit}> */}
                    <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                      <label htmlFor="physicianName" className="col-md-4 col-form-label custom-label ">Treating Physician Name: </label>
                      <div className="col-md-6">
                        <input autoComplete="off"
                          type="text"
                          className="form-control custom-input"
                          id="physicianName"
                          name="physicianName"
                          value={formData.physicianName}
                          onChange={handleChange}

                        />
                      </div>
                    </div>
                    <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                      <label htmlFor="physicianAddress1" className="col-md-4 col-form-label custom-label">Treating Physician Address 1:</label>
                      <div className="col-md-6">
                        <input autoComplete="off"
                          type="text"
                          className="form-control custom-input"
                          id="physicianAddress1"
                          name="physicianAddress1"
                          value={formData.physicianAddress1}
                          onChange={handleChange}

                        />
                      </div>
                    </div>
                    <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                      <label htmlFor="physicianAddress2" className="col-md-4 col-form-label custom-label">Treating Physician Address 2:</label>
                      <div className="col-md-6">
                        <input autoComplete="off"
                          type="text"
                          className="form-control custom-input"
                          id="physicianAddress2"
                          name="physicianAddress2"
                          value={formData.physicianAddress2}
                          onChange={handleChange}

                        />
                      </div>
                    </div>
                    <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                      <label htmlFor="physicianCity" className="col-md-4 col-form-label custom-label">Treating Physician City:</label>
                      <div className="col-md-6">
                        <input autoComplete="off"
                          type="text"
                          className="form-control custom-input"
                          id="physicianCity"
                          name="physicianCity"
                          value={formData.physicianCity}
                          onChange={handleChange}

                        />
                      </div>
                    </div>
                    <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                      <label htmlFor="tPhysicianState" className="col-md-4 col-form-label custom-label">Treating Physician State:</label>
                      <div className="col-md-6">
                        <Dropdown
                          value={formData.physicianStateTypes}
                          name="physicianStateTypes"
                          onChange={handleChange}
                          options={physicianStateTypes.map(type => ({
                            label: type.description, // Displayed in the dropdown
                            value: type.value // Value sent on change
                          }))}
                          filter
                          className="dropdown-select" 
                          placeholder="Georgia"/>

                      </div>
                    </div>
                    <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                      <label htmlFor="physicianZip" className="col-md-4 col-form-label custom-label">Treating Physician ZIP:</label>
                      <div className="col-md-3">
                        <input autoComplete="off"
                          type="text"
                          className="form-control custom-input"
                          id="physicianZip"
                          name="physicianZip"
                          value={formData.physicianZip}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-2 d-flex align-items-center">
                        <label htmlFor="physicianZipExt" className="col-sm col-form-label custom-label">Ext:</label>
                        {/* <div className="col-md-2" style={{ paddingLeft: '0', marginLeft: '0' }}> */}
                        <input autoComplete="off"
                          type="text"
                          className="form-control custom-input"
                          id="physicianZipExt"
                          name="physicianZipExt"
                          value={formData.physicianZipExt}
                          onChange={handleChange}
                          style={{ marginLeft: '9px' }}
                        />
                      </div>
                    </div>
                    <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                      <label htmlFor="physicianPhone" className="col-md-4 col-form-label custom-label">Treating Physician Phone:</label>
                      <div className="col-md-3">
                        <input autoComplete="off"
                          type="text"
                          className="form-control custom-input"
                          id="physicianPhone"
                          name="physicianPhone"
                          value={formData.physicianPhone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-2 d-flex align-items-center">
                        <label htmlFor="physicianPhoneExt" className="col-sm col-form-label custom-label">Ext:</label>
                        {/* <div className="col-md-2" style={{ paddingLeft: '0', marginLeft: '0' }}> */}
                        <input autoComplete="off"
                          type="text"
                          className="form-control custom-input"
                          id="physicianPhoneExt"
                          name="physicianPhoneExt"
                          value={formData.physicianPhoneExt}
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
                      <label htmlFor="treatmentTypes" className="col-md-5 col-form-label custom-label">Initial Treatment:</label>
                      <div className="col-md-6">
                        <Dropdown
                          value={formData.treatmentTypes}
                          name="treatmentTypes"
                          onChange={handleChange}
                          options={treatmentTypes.map(type => ({
                            label: type.description, // Displayed in the dropdown
                            value: type.value // Value sent on change
                          }))}
                          filter
                          className="dropdown-select" />

                      </div>
                    </div>
                    <div className="form-group row mb-1">
                      <label htmlFor="hospitalName" className="col-md-5 col-form-label custom-label">Hospital/Treating Facility:</label>
                      <div className="col-md-6">
                        <input autoComplete="off"
                          type="text"
                          className="form-control custom-input"
                          id="hospitalName"
                          name="hospitalName"
                          value={formData.hospitalName}
                          onChange={handleChange}

                        />
                      </div>
                    </div>
                    <div className="form-group row mb-1">
                      <label htmlFor="hospitalAddress1" className="col-md-5 col-form-label custom-label">Hospital/Treating Facility Address 1:</label>
                      <div className="col-md-6">
                        <input autoComplete="off"
                          type="text"
                          className="form-control custom-input"
                          id="hospitalAddress1"
                          name="hospitalAddress1"
                          value={formData.hospitalAddress1}
                          onChange={handleChange}

                        />
                      </div>
                    </div>
                    <div className="form-group row mb-1">
                      <label htmlFor="hospitalAddress2" className="col-md-5 col-form-label custom-label">Hospital/Treating Facility Address 2:</label>
                      <div className="col-md-6">
                        <input autoComplete="off"
                          type="text"
                          className="form-control custom-input"
                          id="hospitalAddress2"
                          name="hospitalAddress2"
                          value={formData.hospitalAddress2}
                          onChange={handleChange}

                        />
                      </div>
                    </div>
                    <div className="form-group row mb-1">
                      <label htmlFor="hospitalCity" className="col-md-5 col-form-label custom-label">Hospital/Treating Facility City:</label>
                      <div className="col-md-6">
                        <input autoComplete="off"
                          type="text"
                          className="form-control custom-input"
                          id="hospitalCity"
                          name="hospitalCity"
                          value={formData.hospitalCity}
                          onChange={handleChange}

                        />
                      </div>
                    </div>
                    <div className="form-group row mb-1">
                      <label htmlFor="hospitalState" className="col-md-5 col-form-label custom-label">Hospital/Treating Facility State:</label>
                      <div className="col-md-6">
                        <Dropdown
                          value={formData.hospitalStateTypes}
                          name="hospitalStateTypes"
                          onChange={handleChange}
                          options={hospitalStateTypes.map(type => ({
                            label: type.description, // Displayed in the dropdown
                            value: type.value // Value sent on change
                          }))}
                          filter
                          className="dropdown-select"
                          placeholder="Georgia" />

                      </div>
                    </div>
                    <div className="form-group row mb-1" >
                      <label htmlFor="hospitalZip" className="col-md-5 col-form-label custom-label">Hospital/Treating Facility Zip:</label>
                      <div className="col-md-3">
                        <input autoComplete="off"
                          type="text"
                          className="form-control custom-input"
                          id="hospitalZip"
                          name="hospitalZip"
                          value={formData.hospitalZip}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-2 d-flex align-items-center">
                        <label htmlFor="hospitalZipExt" className="col-sm col-form-label custom-label">Ext:</label>
                        {/* <div className="col-md-2" style={{ paddingLeft: '0', marginLeft: '0' }}> */}
                        <input autoComplete="off"
                          type="text"
                          className="form-control custom-input"
                          id="hospitalZipExt"
                          name="hospitalZipExt"
                          value={formData.hospitalZipExt}
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
                </div>
                </AccordionTab>
                <AccordionTab header="Report" onClick={() => handleToggle(0)}>
                  <div className={`accordion-content ${activeIndex === 0 ? 'active' : ''}`}>
                <div className="d-flex flex-wrap">
                  <div className="form-section  flex-fill">
                    <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                      <label htmlFor="dateReturnedToWork" className="col-md-3 col-form-label custom-label mt-0">If Returned to Work, Give Date: </label>
                      <div className="col-md-2">
                        <input autoComplete="off"
                          type="date"
                          className="form-control custom-input"
                          id="dateReturnedToWork"
                          name="dateReturnedToWork"
                          value={formData.dateReturnedToWork}
                          onChange={handleChange}
                          onClick={(e) => e.target.showPicker()}
                        />
                      </div>
                    </div>
                    <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                      <label htmlFor="wagePerWeekAfterReturn" className="col-md-3 col-form-label custom-label">Returned at what wage per week:</label>
                      <div className="col-md-2 osition-relative">
                        <input autoComplete="off"
                          type="text"
                          className="form-control custom-input"
                          id="wagePerWeekAfterReturn"
                          name="wagePerWeekAfterReturn"
                          value={formData.wagePerWeekAfterReturn ? formData.wagePerWeekAfterReturn : ''}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          //onFocus={handleFocus}
                          style={{ marginRight: '5px' }}
                        />
                      </div>
                    </div>
                    <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                      <label htmlFor="dateOfDeath" className="col-md-3 col-form-label custom-label ">If Fatal, Enter Complete Date of Death:</label>
                      <div className="col-md-2">
                        <input autoComplete="off"
                          type="date"
                          className="form-control custom-input"
                          id="dateOfDeath"
                          name="dateOfDeath"
                          value={formData.dateOfDeath}
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
                      <div className="col-md-3">
                        <input autoComplete="off"
                          type="text"
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
                      <label htmlFor="reportPreparedPhone" className="col-md-3 col-form-label custom-label">Telephone Number:</label>
                      <div className="col-md-2">
                        <input autoComplete="off"
                          type="text"
                          className="form-control custom-input"
                          id="reportPreparedPhone"
                          name="reportPreparedPhone"
                          value={formData.reportPreparedPhone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-sm-1 d-flex align-items-center">
                        <label htmlFor="reportPreparedPhoneExt" className="col-sm col-form-label custom-label">Ext:</label>
                        <input autoComplete="off"
                          type="text"
                          className="form-control custom-input"
                          id="reportPreparedPhoneExt"
                          name="reportPreparedPhoneExt"
                          value={formData.reportPreparedPhoneExt}
                          onChange={handleChange}
                          style={{ marginLeft: '9px' }}
                        />
                      </div>
                      <div className="form-group row mb-1" >
                        <label htmlFor="dateOfReport" className="col-md-3 col-form-label custom-label ">Date of Report:</label>
                        <div className="col-md-2" style={{ marginLeft: '5px' }}>
                          <input autoComplete="off"
                            type="date"
                            className="form-control custom-input"
                            id="dateOfReport"
                            name="dateOfReport"
                            value={formData.dateOfReport}
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
              
            </AccordionTab>
            </Accordion>
            </div>
        )}
        {activeTab === 'tab5' && (
          <div className="card">
            <h1 className="custom-h1 header">
              <input
                autoComplete="off"
                type="checkbox"
                disabled={formData.isControvertEnabled || formData.isMedicalInjuryEnabled}
                checked={formData.sectionB}
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
                        type="radio"
                        ref={getFieldRef('incomeBenefits')}
                        className={`form-check-input ${errors.incomeBenefits ? 'p-invalid' : ''}`}
                        name="incomeBenefits"
                        id="incomeBenefitsPaid"
                        value="incomeBenefitsPaid"
                        disabled={!formData.sectionB}
                        style={{ marginTop: '12px' }}
                        checked={formData.incomeBenefits === 'incomeBenefitsPaid'}
                        onChange={handleChange}
                        required
                      />
                      <label className="form-check-label custom-label" style={{ marginTop: '10px' }} htmlFor="incomeBenefitsPaid">
                        Income benefits
                      </label>
                    </div>
                    
                    <div className="form-check form-check-inline mb-0">
                      <input
                        autoComplete="off"
                        ref={getFieldRef('incomeBenefits')}
                        className={`form-check-input ${errors.incomeBenefits ? 'p-invalid' : ''}`}
                        type="radio"
                        name="incomeBenefits"
                        id="salaryInLieu"
                        value="salaryInLieu"
                        disabled={!formData.sectionB}
                        style={{ marginTop: '12px' }}
                        checked={formData.incomeBenefits === 'salaryInLieu'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label custom-label" style={{ marginTop: '10px' }} htmlFor="salaryInLieu">
                        Salary in Lieu
                      </label>
                    </div>
                    {errors.incomeBenefits && (
                              <div className="error-message" style={{ color: 'red', fontSize: '12px', marginLeft: '70px' }}>
                                {errors.incomeBenefits}
                              </div>
                            )}
                  </div>
                </div>
              </div>
              {formData.incomeBenefits === 'incomeBenefitsPaid' && (
                <div className="form-group Income-Benifits-Form">
                  <div className="d-flex flex-wrap">
                    <div className="form-section  flex-fill">
                    <div className="form-group row mb-1 ">
                      <label className="col-md-4 col-form-label  custom-label">Previously Medical Only:</label>
                      <div className="col-md-6 d-flex  flex-wrap ">
                        <div className="form-check custom-radio form-check-inline">
                          <input
                            type="radio"
                            className="form-check-input"
                            name="previousMedicalOnly"
                            id="previouslyMedicalYes"
                            value="Yes"
                            onChange={handleChange}
                            style={{ fontSize: '12px', color: 'black', marginTop: '10px' }}
                          />
                          <label className="form-check-label custom-label" htmlFor="previouslyMedicalYes">Yes</label>
                        </div>
                        <div className="form-check custom-radio form-check-inline">
                          <input
                            type="radio"
                            className="form-check-input "
                            name="previousMedicalOnly"
                            id="previouslyMedicalNo"
                            onChange={handleChange}
                            value="No"
                            style={{ fontSize: '12px', color: 'black', marginTop: '10px' }}
                          />
                          <label className="form-check-label custom-label" htmlFor="previouslyMedicalNo">No</label>
                        </div>                        
                      </div>
                    </div>
                      <div className="form-group row mb-1">
                        <label htmlFor="averageWeeklyWage" className="col-md-4 col-form-label custom-label">
                          Average Weekly Wage: $<span style={{ color: 'red' }}>*</span>
                        </label>
                        <div className="col-md-4">
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
                        <label htmlFor="weeklyBenefit" className="col-md-4 col-form-label custom-label">
                          Weekly benefit: $ <span style={{ color: 'red' }}>*</span>
                        </label>
                        <div className="col-md-4">
                          <input
                            autoComplete="off"
                            type="text"
                            ref={getFieldRef('weeklyBenefit')}
                            className={`form-control custom-input ${errors.weeklyBenefit ? 'p-invalid' : ''}`}
                            id="weeklyBenefit"
                            name="weeklyBenefit"
                            value={formData.weeklyBenefit}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            required
                          />
                          {errors.weeklyBenefit && (
                            <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                              {errors.weeklyBenefit}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="form-group row mb-1">
                        <label htmlFor="dateOfDisability" className="col-md-4 col-form-label custom-label">
                          Date of disability:
                        </label>
                        <div className="col-md-4">
                          <input
                            autoComplete="off"
                            type="date"
                            className="form-control custom-input"
                            id="dateOfDisability"
                            name="dateOfDisability"
                            value={formData.dateOfDisability}
                            onChange={handleChange}
                            onClick={(e) => e.target.showPicker()}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group row mb-1">
                        <label htmlFor="dateOfFirstPayment" className="col-md-4 col-form-label custom-label">
                          Date Of first Payment: <span style={{ color: 'red' }}>*</span>
                        </label>
                        <div className="col-md-4">
                          <input
                            autoComplete="off"
                            type="date"
                            ref={getFieldRef('dateOfFirstPayment')}
                            className={`form-control custom-input ${errors.dateOfFirstPayment ? 'p-invalid' : ''}`}
                            id="dateOfFirstPayment"
                            name="dateOfFirstPayment"
                            value={formData.dateOfFirstPayment}
                            onChange={handleChange}
                            onClick={(e) => e.target.showPicker()}
                            required
                          />
                          {errors.dateOfFirstPayment && (
                            <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                              {errors.dateOfFirstPayment}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="form-group row mb-1">
                        <label htmlFor="compensationPaid" className="col-md-4 col-form-label custom-label">
                          Compensation paid: $ <span style={{ color: 'red' }}>*</span>
                        </label>
                        <div className="col-md-4">
                          <input
                            autoComplete="off"
                            type="text"
                            ref={getFieldRef('compensationPaid')}
                            className={`form-control custom-input ${errors.compensationPaid ? 'p-invalid' : ''}`}
                            id="compensationPaid"
                            name="compensationPaid"
                            value={formData.compensationPaid}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            required
                          />
                          {errors.compensationPaid && (
                            <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                              {errors.compensationPaid}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="form-group row mb-1">
                        <label htmlFor="penalityPaid" className="col-md-4 col-form-label custom-label">
                          Penalty paid: $
                        </label>
                        <div className="col-md-4">
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
                        <label htmlFor="dateBenefitsPayableFrom" className="col-md-4 col-form-label custom-label">
                          Benefits Payable From Date:<span style={{ color: 'red' }}>*</span>
                        </label>
                        <div className="col-md-4">
                          <input
                            autoComplete="off"
                            type="date"
                            ref={getFieldRef('dateBenefitsPayableFrom')}
                            className={`form-control custom-input ${errors.dateBenefitsPayableFrom ? 'p-invalid' : ''}`}
                            id="dateBenefitsPayableFrom"
                            name="dateBenefitsPayableFrom"
                            value={formData.dateBenefitsPayableFrom}
                            onChange={handleChange}
                            onClick={(e) => e.target.showPicker()}
                            required
                          />
                          {errors.dateBenefitsPayableFrom && (
                            <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                              {errors.dateBenefitsPayableFrom}
                            </div>
                          )}
                        </div>
                      </div>
                     <div className="form-section flex-fill pl-3">
                      <div className="form-group row mb-1">
                        <label htmlFor="dateBenefitsPayableFrom" className="col-md-4 col-form-label custom-label">
                        Benefits Payable For:<span style={{ color: 'red' }}>*</span>
                        </label>
                        <div className="col-md-5">
                            <Dropdown
                              value={formData.disabilityTypes}
                              name="disabilityTypes"
                              onChange={handleChange}
                              options={disabilityTypes.map(type => ({
                                label: type.description,
                                value: type.value
                              }))}
                              placeholder="---Select One---"
                              filter
                              // className="select-dropdown custom-input col-md-12"
                              className={`select-dropdown  custom-input col-md-10 ${errors.disabilityTypes ? 'p-invalid' : ''}`}
                              ref={getFieldRef('disabilityTypes')}

                              label="Benefits Payable For"
                              dropdownClassName="custom-dropdown-panel"
                            />
                            

                          {errors.disabilityTypes && (
                            <div className="error-message" style={{ color: 'red', fontSize: '12px' }}>
                              {errors.disabilityTypes}
                            </div>
                          )}
                        </div>
                      </div>
                      </div>
                      {/* <div className="form-group row mb-1">
                        <label htmlFor="benefitsPayableFor" className="col-md-4 col-form-label custom-label">
                          Benefits Payable For: <span style={{ color: 'red' }}>*</span>
                        </label>
                        <div className="col-md-4">
                          <input
                            autoComplete="off"
                            type="text"
                            ref={getFieldRef('benefitsPayableFor')}
                            className={`form-control custom-input ${errors.benefitsPayableFor ? 'p-invalid' : ''}`}
                            id="benefitsPayableFor"
                            name="benefitsPayableFor"
                            value={formData.benefitsPayableFor}
                            onChange={handleChange}
                            onClick={(e) => e.target.showPicker()}
                            required
                          />
                          {errors.benefitsPayableFor && (
                            <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                              {errors.benefitsPayableFor}
                            </div>
                          )}
                        </div>
                      </div> */}
                      <div className="form-group row mb-1">
                        <label htmlFor="dateUntilBenefitsPaid" className="col-md-4 col-form-label custom-label">
                          Pay Benefit Until:
                        </label>
                        <div className="col-md-4">
                          <input
                            autoComplete="off"
                            type="date"
                            className="form-control custom-input"
                            id="dateUntilBenefitsPaid"
                            name="dateUntilBenefitsPaid"
                            value={formData.dateUntilBenefitsPaid}
                            onChange={handleChange}
                            onClick={(e) => e.target.showPicker()}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {formData.incomeBenefits === 'salaryInLieu' && (
                <div className="d-flex flex-wrap">
                  <div className="form-section  flex-fill">
                    <div className="form-group row mb-1 ">
                      <label className="col-md-4 col-form-label  custom-label">Previously Medical Only:</label>
                      <div className="col-md-6 d-flex  flex-wrap ">
                        <div className="form-check custom-radio form-check-inline">
                          <input
                            type="radio"
                            className="form-check-input"
                            name="previousMedicalOnly"
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
                            name="previousMedicalOnly"
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
                            name="previousMedicalOnly"
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
                          
                          <option value="Total Disability">TOTAL DISABILITY</option>
                        </select>
                        
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
          {/* </div>
        )}

        {activeTab === 'tab6' && (
          <div className="card"> */}
            <h1 className="custom-h1  header" style={{ margingBottom: '10px' }}>
              <input autoComplete="off"
                type="checkbox"
                disabled={formData.sectionB || formData.isMedicalInjuryEnabled}
                checked={formData.isControvertEnabled}
                onChange={() => setFormData((prev) => ({ ...prev, isControvertEnabled: !prev.isControvertEnabled }))}
                className="large-checkbox"
                style={{ marginLeft: '10px', marginRight: '5px', marginBottom: '0px' }}
              />
              C. Notice To Convert Payment Of Compensation</h1>
            <div className="form-group row mb-1">
              <label htmlFor="convertTypes" className="col-md-2 col-form-label custom-label">Controvert Type:<span style={{ color: 'red' }}>*</span></label>
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
                  value={formData.convertTypes}
                  id="convertTypes"
                  name="convertTypes"
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
          {/* </div>
        )}
        {activeTab === 'tab7' && (
          <div className="card"> */}
            <h1 className="custom-h1 header" ref={headerRef}>
              <input autoComplete="off"
                type="checkbox"
                disabled={formData.sectionB || formData.isControvertEnabled}
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
        )}
        {activeTab === 'tab8' && (
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
        )}

      </div>


      <div className="card-content">
      <h1 className="custom-h1 header" style={{ marginTop: '5px' }}>Submitter Information</h1>
                    <div className="d-flex flex-wrap">
                        <div className="form-section flex-fill">
                            <div className="form-group mb-1 d-flex align-items-center">
                                <label className="custom-label" style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>
                                    Insurer/Self-Insurer: Type or Print Name of Person Filing Form:
                                </label>
                                <span style={{ fontSize: '15px' }} className="value">DAVID IMAHARA</span>
                            </div>
                            <div className="form-group mb-1 d-flex align-items-center">
                                <label htmlFor="submittedDate" className="custom-label" style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>
                                    Date:
                                </label>
                                <span style={{ fontSize: '15px' }} className="value">11/09/2024</span>
                            </div>
                        </div>
                        <div className="form-section flex-fill pl-3">
                            <div className="form-group mb-1 d-flex align-items-center">
                                <label className="custom-label" style={{ marginRight: '10px', whiteSpace: 'nowrap', lineHeight: '1.5' }}>
                                    Phone Number:
                                </label>
                                <span style={{ fontSize: '15px', lineHeight: '1.5' }}>(404) 463-1999</span>
                                <label className="custom-label" style={{ marginRight: '10px', marginLeft: '20px', whiteSpace: 'nowrap', lineHeight: '1.5' }}>
                                    Ext:
                                </label>
                                <span style={{ fontSize: '15px', lineHeight: '1.0' }}>ext</span>
                            </div>
                            <div className="form-group mb-1 d-flex align-items-center">
                                <label className="custom-label" style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>
                                    E-mail:
                                </label>
                                <span style={{ fontSize: '15px' }}>CAMPBELLN@SBWC.GA.GOV</span>
                            </div>
                        </div>
                    </div>
                </div>





      <div className="d-flex justify-content-center mt-3">
        <ButtonGroup>
          <Button label="Reset" icon="pi pi-refresh" size="large" />
          <Button label="Save" icon="pi pi-save" size="large" />
          <Button label="Submit" icon="pi pi-check" size="large" />
          {/* <Button label="Delete" icon="pi pi-trash" /> */}
          <Button label="Cancel" icon="pi pi-times" size="large" />
        </ButtonGroup>
        {/* <button type="reset" className="btn btn-secondary mx-2 mb-10 custom-label">Reset</button>
          <button type="button" className="btn btn-primary mx-2 mb-10  custom-label"
            style={{
              backgroundColor: clicked ? '#4babf55e' : '#4babf55e', border: 'none', color: 'black'
            }}
            onClick={() => setClicked(!clicked)}>Save</button>
          <button type="submit" className="btn btn-primary mx-2 mb-10  custom-label" 
            style={{
              backgroundColor: clicked ? '#4babf55e' : '#4babf55e', border: 'none', color: 'black'
            }}
            onClick={() => setClicked(!clicked)}>Submit</button> */}

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
