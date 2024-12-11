import React, { useState, useEffect, useRef } from 'react';
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
import { MDBInput, MDBDropdown, MDBDropdownMenu, MDBDropdownItem, MDBDropdownToggle, MDBRadio } from 'mdb-react-ui-kit';
import { FloatLabel } from 'primereact/floatlabel';
import { Accordion, AccordionTab } from 'primereact/accordion';
import TreatmentTypeService from "../services/treatment.type.service";
import DisabilityTypeService from "../services/disability.type.service";
// import ReactFileViewer from 'react-file-viewer';
import DataTableComponent from "./DataTableComponent.js";

const Wc1FormComponent = () => {
  const [stateTypes, setStateTypes] = useState([]);
  const [selectedState, setSelectedState] = useState(['GA']);
  const [selectedPhysicianState, setPhysicianState] = useState(['GA']);
  const [selectedHospitalState, setHospitalState] = useState(['GA']);
  const [naicsTypes, setNaicsTypes] = useState([]);
  const [typeOfInjury, setInjuryTypes] = useState([]);
  const [injuryCauseTypes, setInjuryCauseTypes] = useState([]);
  const [activeTab, setActiveTab] = useState('tab1');
  const [controvertTypes, setControvertTypes] = useState([]);
  const [physicianStateTypes, setPhysicianStateTypes] = useState();
  const [hospitalStateTypes, setHospitalStateTypes] = useState();
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
  const [submitted, setSubmitted] = useState(false);
  const [generatedPdf, setGeneratedPdf] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // Modal open state
  const [claimParties, setClaimParties] = useState([]);

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
    const inputs = document.querySelectorAll('input[type="text"], input[type="date"], input[type="number"], input[type="email"],input[type="tel"], input[type="password"], textarea');
    inputs.forEach(input => {
      input.style.fontWeight = 'bold';
      input.style.fontSize = '18px';
    });
  }, [activeTab]);

  useEffect(() => {
    const inputs = document.querySelectorAll('input[type="text"], input[type="date"], input[type="number"], input[type="email"], input[type="time"], input[type="tel"], input[type="password"], textarea');
    inputs.forEach(input => {
      input.style.fontWeight = 'bold';
      input.style.fontSize = '18px';
    });
  }, [activeIndex]);

  useEffect(() => {
    ClaimService.getClaimById()
      .then((response) => {
        console.log(response);
        setFormData(response.data);
        console.log("claimNo", formData.claimNo);
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
        console.log('claimparties');
        console.log(response.data);
        setClaimParties(response.data);

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
    TreatmentTypeService.getAllTreatmentTypes()
      .then((response) => {
        console.log("treatmentTypes ....:", response);
        setTreatmentTypes(response.data);
        console.log("treatmentTypes", treatmentTypes);
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


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newDocument = { id: documents.length + 1, name: file.name, fileUrl: url };
      setDocuments([...documents, newDocument]);
      toast.current.show({ severity: 'success', summary: 'File Uploaded', detail: file.name, life: 3000, style: { backgroundColor: '#4baaf5', color: '#FFFFFF' }, });
      event.target.value = null;
    }
  };
  const hideViewModal = () => {
    setViewVisible(false);
    setFileUrl(null);
    // alert("Your form has been successfully submitted!\n Your claim number is: 2024-000100");
  };
  const confirmDelete = () => {
    setDocuments(documents.filter(doc => doc.id !== docToDelete));
    toast.current.show({ severity: 'warn', summary: 'Document Deleted', detail: `Deleted ID ${docToDelete}`, life: 3000, style: { backgroundColor: '#dd4f4f', color: '#FFFFFF' }, });
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
    tab3: false,

    claimant: {
      firstName: '',
      lastName: '',
      middleIntial: '',
      dateOfBirth: '',
      gender: 'Male',
      address1: '',
      address2: '',
      city: '',
      state: 'GA',
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
    selectedState: 'GA',
    selectedHospitalState: 'GA', selectedPhysicianState: 'GA',
    physicianStateTypes: [],
    hospitalStateTypes: [],
    naicsType: '',
    naicsTypes: [],
    typeOfInjury: [],
    injuryCauseTypes: [],
    controvertType: [],
    dateOfInjury: '',
    timeOfInjury: '',
    dateEmployerNotified: '',
    dateFailedToWorkFullDay: '',
    receivedFullPay: 'Y',
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
    claimNo: '',
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

  // const controvertType = [
  //   { label: 'ALL THE ENTIRE CASE IS CONTROVERTED', value: 'ALL THE ENTIRE CASE IS CONTROVERTED' },
  //   { label: 'LOST TIME IS CONTROVERTED, HOWEVER MEDICAL OR OTHER BENEFITS HAVE BEEN ACCEPTED', value: 'LOST TIME IS CONTROVERTED, HOWEVER MEDICAL OR OTHER BENEFITS HAVE BEEN ACCEPTED' },
  //   { label: 'MEDICAL IS DENIED', value: 'MEDICAL IS DENIED' },
  //   { label: 'PARTIAL DENIAL OF MEDICAL', value: 'PARTIAL DENIAL OF MEDICAL' }
  // ]

  const [benefitsPayableFor, setBenefitsPayableFor] = useState([
    { label: 'Total Disability', value: { id: 2, code: 'TOTALDIS', description: 'Total Disability' } },
  ]);



  const handleCheckboxChange = () => {
    setFormData((prev) => {
      if (prev.sectionB) {
        return {
          ...prev,
          sectionB: false,
          incomeBenefits: '',
          averageWeeklyWage: '',
          weeklyBenefit: '',
          DateOfDisablity: '',
          dateOfFirstPayment: '',
          compensationPaid: '',
          penalityPaid: '',
          dateBenefitsPayableFrom: '',
          benefitsPayableFor: '',
          payBenifitUntil: '',
        };
      } else {
        return { ...prev, sectionB: true };
      }
    });
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedState(e.target.value);
    setPhysicianState(e.target.value);
    setHospitalState(e.target.value);
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
    const stateMappings = {
      stateTypes: 'selectedState',
      hospitalStateTypes: 'selectedHospitalState',
      physicianStateTypes: 'selectedPhysicianState',
    };
    Object.keys(stateMappings).forEach((key) => {
      if (name.includes(key)) {
        setFormData((prevData) => ({
          ...prevData,
          [stateMappings[key]]: value,
        }));
      }
    });
    if (!Object.keys(stateMappings).some(key => name.includes(key))) {
      if (name === 'incomeBenefits') {
        const mappedValue = value === 'incomeBenefitsPaid' ? 'Y' : 'N';
        setFormData((prevData) => ({
          ...prevData,
          // name:value,
          incomeBenefits: mappedValue,
        }));
      } else if (numericFields.includes(name)) {
        let numericValue = value.replace(/[^0-9.]/g, '');
        const parts = numericValue.split('.');
        if (parts.length > 2) {
          numericValue = parts[0] + '.' + parts[1].slice(0, 2);
        }
        setFormData((prevData) => ({
          ...prevData,
          [name]: numericValue,
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    if (numericFields.includes(name)) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: prevData[name] ? prevData[name].replace('$', '') : '',
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (numericFields.includes(name)) {
      setFormData((prev) => {
        let newValue = prev[name];
        if (!newValue) return prev;
        // newValue = newValue ? newValue.replace('$', '') : '';
        newValue = newValue.replace('$', '').trim();
        if (newValue && !newValue.includes('.')) {
          newValue = `${newValue}.00`;
        }
        newValue = newValue ? `$${parseFloat(newValue).toFixed(2)}` : '';
        return {
          ...prev,
          [name]: newValue,
        };
      });
    }
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

  useEffect(() => {
    if (stateTypes && stateTypes.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        stateTypes: stateTypes,
        hospitalStateTypes: hospitalStateTypes,
        physicianStateTypes: physicianStateTypes,
        selectedState: 'GA',
        setPhysicianState: 'GA',
        setHospitalState: 'GA'
      }));
    }
  }, [stateTypes]);

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
    'disabilityTypes': 'tab5',
    'controvertType': 'tab5',
    'weeklyBenefit': 'tab5',
    'dateSalaryPaid': 'tab5',
    'benefitsPayableFromDate': 'tab5',
    'benefitsPayableFor': 'tab5',
    'convertType': 'tab5',
    'controverted': 'tab5',
    'isControvertEnabled': 'tab5',
    'isMedicalInjuryEnabled': 'tab5',
    // Add more mappings as needed
  };
  const numericFields = [
    'wagePerWeekAfterReturn',
    'averageWeeklyWage',
    'weeklyBenefitAmount',
    'averageWeeklyWageAmount',
    'compensationPaid',
    'penalityPaid',
    'weeklyBenefit'
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    console.log('Form to be Submitted:', formData);
    const requiredFields = [
      'claimant.firstName', 'claimant.lastName', 'claimant.address1', 'claimant.city',
      'claimant.state', 'claimant.zip', 'claimant.gender', 'daysWorkedPerWeek',
      'daysOff', 'dateOfInjury', 'countyOfInjury.description', 'receivedFullPay',
      'injuredInEmpPermises', 'otherInjuryCause', 'typeOfInjury'
    ];
    const incomeBenefitsRequiredFields = [
      'averageWeeklyWage', 'dateOfFirstPayment',
      'compensationPaid', 'dateBenefitsPayableFrom', 'disabilityTypes', 'weeklyBenefit'
    ];
    const salaryInLieuRequiredFields = [
      'dateSalaryPaid', 'benefitsPayableFromDate', 'benefitsPayableFor'
    ];
    const newErrors = validateRequiredFields(formData, requiredFields);
    const validateConditionalFields = () => {
      if (formData.sectionB) {
        const sectionBRequired = ['incomeBenefits'];
        Object.assign(newErrors, validateRequiredFields(formData, sectionBRequired));
        if (formData.incomeBenefits === 'Y') {
          salaryInLieuRequiredFields.forEach(field => {
            delete formData[field];
          });
          Object.assign(newErrors, validateRequiredFields(formData, incomeBenefitsRequiredFields));
        }
        if (formData.incomeBenefits === 'N') {
          incomeBenefitsRequiredFields.forEach(field => {
            delete formData[field];
          });
          Object.assign(newErrors, validateRequiredFields(formData, salaryInLieuRequiredFields));
        }
      }
      if (formData.isControvertEnabled) {
        const controvertRequiredFields = ['controvertType'];
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
        const targetTab = errorTabMapping[firstErrorField];
        if (targetTab !== activeTab) {
          setActiveTab(targetTab);
        }
        if (fieldRefs.current[firstErrorField]) {
          const ref = fieldRefs.current[firstErrorField].current;
          if (ref && ref instanceof HTMLElement) {
            ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
            ref.focus(); // Optionally, focus the field with the error
          }
        }

      }
    };
    if (Object.keys(newErrors).length > 0) {
      console.log('Errors found:', newErrors);
      setErrors(newErrors);
      // const tab5Errors = ['sectionB', 'isControvertEnabled', 'isMedicalInjuryEnabled'].filter(field => newErrors[field]);
      // if (tab5Errors.length > 0) {
      //   setActiveTab('tab5'); 
      // }
      scrollToFirstError();
      return;
    }
    if (!formData.sectionB && !formData.isMedicalInjuryEnabled && !formData.isControvertEnabled) {
      setSubmitted(true);
      if (activeTab !== 'tab5') {
        alert("Selection one of Section B/C/D is required.");
        newErrors['tab5'] = 'Please select at least one option in Section B, C, or D.';
        setActiveTab('tab5');
        //setErrors(newErrors);
        return;
      }
    } else {
      const sanitizedFormData = { ...formData };
      numericFields.forEach(field => {
        if (sanitizedFormData[field]) {
          sanitizedFormData[field] = sanitizedFormData[field].replace(/[^0-9.]/g, '');
          console.log(field, sanitizedFormData[field].replace(/[^0-9.]/g, ''));
        }
      });
      console.log("formData", sanitizedFormData);
      try {
        const response = await ClaimService.saveClaim(sanitizedFormData);
        console.log(response);
        console.log(response.data);
        // const blob = new Blob([response.data], { type: 'application/pdf' });
        // console.log('Blob:', blob);
        // console.log('Blob size:', blob.size);
        // const pdfUrl = window.URL.createObjectURL(blob);
        // window.open(pdfUrl, '_blank');
        // console.log('PDF URL created:', pdfUrl); 
        // setGeneratedPdf(pdfUrl); 
        // setModalOpen(true);  
        // setIsActive(false);

        const arrayBuffer = response.data;  // This is the ArrayBuffer you received from the API// Check if the first 4 bytes correspond to the PDF signature (%PDF-)
        console.log(arrayBuffer);
        const pdfHeader = new Uint8Array(arrayBuffer, 0, 4);
        console.log('PDF Header:', pdfHeader);

        const isValidPdf = pdfHeader[0] === 0x25 && pdfHeader[1] === 0x50 && pdfHeader[2] === 0x44 && pdfHeader[3] === 0x46;
        console.log('Is valid PDF:', isValidPdf);

        if (isValidPdf) {
          const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
          const pdfUrl = window.URL.createObjectURL(blob);
          setGeneratedPdf(pdfUrl);
          setViewVisible(true);
          // window.open(pdfUrl, '_blank'); // Open PDF in a new tab

        } else {
          console.error('Invalid PDF data.');
        }
      } catch (error) {
        console.error('Error downloading the file:', error);
      }
      console.log('Submitting form with data:', formData);
      setIsActive(false);
    }
    setIsActive(false);
    console.log("Form is valid. Proceeding with submission...");
    setFormData(prev => ({
      ...prev,
    }));

  };
  const renderGeneratedContent = () => {
    if (generatedPdf) {
      return (
        <div>
          <h3>Form Submitted Successfully!</h3>
          <iframe
            src={generatedPdf}
            width="100%"
            height="600px"
            title="Generated PDF"
            style={{ border: 'none' }}
          />
        </div>
      );
    }
    return null;
  };

  const getRequiredFieldsForTab = (tab) => {
    const tabFields = {
      tab1: ['claimant.firstName', 'claimant.lastName', 'claimant.address1', 'claimant.city', 'claimant.state', 'claimant.zip', 'claimant.gender'],
      tab3: ['daysWorkedPerWeek', 'daysOff'],
      tab4: ['dateOfInjury', 'countyOfInjury.description', 'receivedFullPay', 'injuredInEmpPermises', 'typeOfInjury', 'otherInjuryCause'],
      tab5: ['sectionB', 'isControvertEnabled', 'isMedicalInjuryEnabled'],
    };
    return tabFields[tab] || [];
  };

  const hasErrorsInTab = (tab) => {
    const requiredFields = getRequiredFieldsForTab(tab);
    if (tab === 'tab5') {
      const isTab5ConditionMet = formData.sectionB || formData.isControvertEnabled || formData.isMedicalInjuryEnabled;
      return submitted && (!isTab5ConditionMet || requiredFields.some((field) => errors[field]));
    }
    return submitted && requiredFields.some((field) => errors[field]);
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
    if (isNaN(d.getTime())) {
      return '';
    }
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate() + 1).padStart(2, '0');
    return `${month}-${day}-${year}`;
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
    dateSalaryPaid: '', benefitsPayableFor: '', convertType: '', controverted: ''
  });



  const totalPages = Math.ceil(claimParties.length / itemsPerPage);
  const paginatedParties = claimParties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handleClick = (e) => {
    // Ensuring that the date picker is triggered upon click
    // `showPicker()` may not be available in all browsers, but it works in most modern browsers.
    const inputElement = e.target;
    if (inputElement && inputElement.showPicker) {
      inputElement.showPicker();
    }
  };
  return (
    <div className="tabs container">
      <DataTableComponent />
      <h1 className="custom-h1 header" style={{ marginTop: '5px' }}>WC-1, Employers First Report of Injury</h1>
      {/* {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
          <button className="close-button" onClick={onClose} style={{ padding: '15px', backgroundColor: 'transparent' }}>&times;</button> */}
      {/* {renderGeneratedContent()} */}
      <Dialog
        // header="Your form has been successfully submitted! Your claim number is:{formData.claimNo}"
        header={`Your form has been successfully submitted! Your claim number is: ${formData.claimNo}`}
        visible={viewVisible}
        onHide={() => {
          hideViewModal();

        }}
        style={{ width: '80%', height: '90%' }}
        modal
      >
        <iframe
          src={generatedPdf}
          width="100%"
          height="600px"
          title="Generated PDF"
          style={{ border: 'none' }}
        />

      </Dialog>


      {/* </div> */}
      {/* </div>
      )} */}
      <form onSubmit={handleSubmit} noValidate>

        <Toast ref={toastRef} />

        {/* <NewClaimComponent /> */}
        <div className="tab-titles">

          <button type="button"
            className={activeTab === 'tab1' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); handleTabClick('tab1'); }}
          >
            Claimant Information
            {hasErrorsInTab('tab1') && <span className="pi pi-exclamation-circle ml-5"></span>}
          </button>
          <button type="button"
            className={activeTab === 'tab2' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); handleTabClick('tab2'); }}
          >
            Party Information
            {hasErrorsInTab('tab2') && <span className="pi pi-exclamation-circle ml-5"></span>}
          </button>

          <button type="button"
            className={activeTab === 'tab3' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); handleTabClick('tab3'); }}
          >
            Employment/Wage
            {hasErrorsInTab('tab3') && <span className="pi pi-exclamation-circle ml-5"></span>}
          </button>
          <button type="button"
            className={activeTab === 'tab4' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); handleTabClick('tab4'); }}
          >
            Injury/Illness & Medical
            {hasErrorsInTab('tab4') && <span className="pi pi-exclamation-circle "></span>}
          </button>
          <button type="button"
            className={activeTab === 'tab5' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); handleTabClick('tab5'); }}
          >
            Section B, C, D
            {hasErrorsInTab('tab5') && <span className="pi pi-exclamation-circle"></span>}
          </button>
          <button type="button"
            className={activeTab === 'tab8' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); handleTabClick('tab8'); }}
          >
            Attachments
          </button>
          <button type="button"
            className={activeTab === 'tab9' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); handleTabClick('tab9'); }}
          >
            Review
          </button>
        </div>
        <div className="tab-content">
          {activeTab === 'tab1' && (
            <div className=" card-content">
              {/* <h1 className="custom-h1 header" style={{ marginTop: '5px' }}>Claimant Information</h1> */}
              <div className="form-section  flex-fill mb-0">
                <div className="form-group row mb-0 mt-3">
                  <div className="col-md-2 mb-2">
                    <MDBInput
                      label={<>First Name<span style={{ color: 'red' }}>*</span> </>}
                      type="text"
                      ref={getFieldRef('claimant.firstName')}
                      className={`custom-border border-0 ${errors.firstName ? 'p-invalid' : ''}`}
                      id="firstName"
                      name="firstName"
                      value={formData.claimant.firstName || ' '}
                      onChange={handleChange}
                      required
                      disabled
                      inputClass="custom-input-value"
                    />
                    {errors.firstName && (
                      <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                        {errors.firstName}
                      </div>
                    )}
                  </div>
                  <div className="col-md-2 mb-2">
                    <MDBInput
                      label={<>Last Name<span style={{ color: 'red' }}>*</span> </>}
                      type="text"
                      ref={getFieldRef('claimant.lastName')}
                      className={`custom-border ${errors.lastName ? 'p-invalid' : ''}`}
                      id="lastName"
                      name="lastName"
                      value={formData.claimant.lastName || ' '}
                      onChange={handleChange}
                      required
                      disabled
                    />
                    {errors.lastName && (
                      <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                        {errors.lastName}
                      </div>
                    )}
                  </div>
                  <div className="col-md-1 mb-2">
                    <MDBInput
                      label="M.I."
                      type="text"
                      className="custom-border"
                      id="middleIntial"
                      name="claimant.middleIntial"
                      value={formData.claimant.middleIntial || ' '}
                      onChange={handleChange}

                    />
                  </div>
                  <div className="col-md-2 mb-2">
                    <MDBInput
                      label="Birthdate"
                      type="date"
                      className="custom-border"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.claimant.dateOfBirth ? new Date(formData.claimant.dateOfBirth).toISOString().split('T')[0] : ''}
                      onChange={handleChange}
                      onClick={(e) => e.target.showPicker()}
                      disabled
                    />
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="custom-label">Gender: <span style={{ color: 'red' }}>*</span></label>
                    <div className="custom-radio">
                      <div className="form-check form-check-inline">
                        <input
                          className={`form-check-input ${errors.gender ? 'p-invalid' : ''}`}
                          type="radio"
                          name="claimant.gender"
                          id="genderMale"
                          value="M"
                          checked={formData.claimant.gender === 'M' || ''}
                          onChange={handleChange}
                          required
                        />
                        <label className="form-check-label" htmlFor="genderMale">Male</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className={`form-check-input ${errors.gender ? 'p-invalid' : ''}`}
                          type="radio"
                          name="claimant.gender"
                          id="genderFemale"
                          value="F"
                          checked={formData.claimant.gender === 'F' || ''}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="genderFemale">Female</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className={`form-check-input ${errors.gender ? 'p-invalid' : ''}`}
                          type="radio"
                          name="claimant.gender"
                          id="genderUnknown"
                          value="Unknown"
                          checked={formData.claimant.gender === 'Unknown' || ''}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="genderUnknown">Unknown</label>
                      </div>
                    </div>
                    {errors.gender && (
                      <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                        {errors.gender}
                      </div>
                    )}
                  </div>
                  <div className="col-md-2 mb-2 d-flex align-items-center">
                    <label className="custom-label mb-0 me-2">Out of Country Address:</label>
                    <div
                      className={`custom-checkbox ${formData.outOfCountryAddress ? 'checked' : ''}`}
                      onClick={() => handleChange({ target: { name: 'outOfCountryAddress', value: !formData.outOfCountryAddress } })}
                      style={{ cursor: 'pointer' }}
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

              </div>
              <div className="form-section flex-fill">
                <div className="form-group row mt-3">
                  <div className="col-md-4 mb-2">
                    <MDBInput
                      label={<>Mailing Address 1<span style={{ color: 'red' }}>*</span> </>}
                      type="text"
                      ref={getFieldRef('claimant.address1')}
                      className={`custom-border ${errors['claimant.address1'] ? 'p-invalid' : ''}`}
                      id="address1"
                      name="claimant.address1"
                      value={formData.claimant.address1 || ' '}
                      onChange={handleChange}
                      required
                    />
                    {errors['claimant.address1'] && (
                      <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                        {errors['claimant.address1']}
                      </div>
                    )}
                  </div>
                  <div className="col-md-4 mb-2">
                    <MDBInput
                      label="Mailing Address 2"
                      type="text"
                      className="custom-border"
                      id="address2"
                      name="claimant.address2"
                      value={formData.claimant.address2 || ' '}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-2 mb-2">
                    <MDBInput
                      label={<>City<span style={{ color: 'red' }}>*</span> </>}
                      type="text"
                      ref={getFieldRef('claimant.city')}
                      className={`custom-border ${errors['claimant.city'] ? 'p-invalid' : ''}`}
                      id="city"
                      name="claimant.city"
                      value={formData.claimant.city || ' '}
                      onChange={handleChange}
                      required
                    />
                    {errors['claimant.city'] && (
                      <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                        {errors['claimant.city']}
                      </div>
                    )}
                  </div>
                  <div className="col-md-2  mb-2 ">
                    <Dropdown
                      value={formData.selectedState || 'GA'}
                      name="stateTypes"
                      required
                      onChange={handleChange}
                      options={stateTypes.map(type => ({
                        label: type.description,
                        value: type.code
                      }))}
                      filter
                      ref={getFieldRef('claimant.state')}
                      className={`col-md-12 ${errors['claimant.state'] ? 'p-invalid' : ''}`}
                      dropdownClassName="custom-dropdown-panel"
                      placeholder="State"
                    />
                    {/* <MDBInput
                      label={<>State<span style={{ color: 'red' }}>*</span> </>}
                      type="text"
                      ref={getFieldRef('claimant.state')}
                      className={`custom-border ${errors['claimant.state'] ? 'p-invalid' : ''}`}
                      id="state"
                      name="claimant.state"
                      value={formData.claimant.state || ' '}
                      onChange={handleChange}
                      required
                    /> */}
                    {errors['claimant.state'] && (
                      <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                        {errors['claimant.state']}
                      </div>
                    )}
                  </div>


                </div>
              </div>
              <div className="form-section flex-fill">
                <div className="form-group row">
                  <div className="col-md-2 mb-2 mt-3">
                    <MDBInput
                      label={<>Zip<span style={{ color: 'red' }}>*</span> </>}
                      type="text"
                      ref={getFieldRef('claimant.zip')}
                      className={`custom-border ${errors['claimant.zip'] ? 'p-invalid' : ''}`}
                      id="zip"
                      name="claimant.zip"
                      value={formData.claimant.zip || ' '}
                      onChange={handleChange}
                      required
                    />
                    {errors['claimant.zip'] && (
                      <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                        {errors['claimant.zip']}
                      </div>
                    )}
                  </div>

                  <div className="col-md-4 mb-2 mt-3">
                    <MDBInput
                      label="Employee E-mail"
                      type="text"
                      className="custom-border"
                      id="primaryEmail"
                      name="claimant.primaryEmail"
                      value={formData.claimant.primaryEmail || ' '}
                      onChange={handleChange}
                      disabled
                    />
                  </div>
                  <div className="col-md-3 mb-2 mt-3">
                    <MDBInput
                      label="Phone Number"
                      type="text"
                      className="custom-border"
                      id="primaryPhone"
                      name="claimant.primaryPhone"
                      value={formData.claimant.primaryPhone || ' '}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'tab2' && (
            <div className="card">
              {/* <h1 className="custom-h1 header" style={{ marginTop: '5px' }}>Party Information</h1> */}
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
                  {paginatedParties.map((claimParty, index) => (
                    <tr key={index}>
                      <td>{claimParty.party.partyType?.code}</td>
                      <td><a href="#" onClick={(e) => { e.preventDefault(); openModal(claimParty.party); }}>{claimParty.party.partyName}</a></td>
                      <td>{claimParty.parentParty?.partyName}</td>
                      <td>{claimParty.party.selfInsured != null || claimParty.party.selfInsured !== '' ? claimParty.party.selfInsured ? 'Yes' : 'No' : ''}</td>
                      <td>{claimParty.party.selfAdministered != null ? claimParty.party.selfAdministered ? 'Yes' : 'No' : ''}</td>
                      <td>{claimParty.party.groupFundMember != null ? claimParty.party.groupFundMember ? 'Yes' : 'No' : ''}</td>
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
            <div>
              {/* <h1 className="custom-h1 header" style={{ marginTop: '5px' }}>EMPLOYMENT/WAGE</h1> */}
              <div className="d-flex flex-wrap">
                {/* First Row */}
                <div className="form-section flex-fill">
                  <div className="form-group row mb-3 mt-3">
                    <div className="col-md-5">
                      <MDBInput
                        label="Hired Date"
                        autoComplete="off"
                        type="date"
                        id="hiredDate"
                        name="hiredDate"
                        value={formData.hiredDate}
                        onChange={handleChange}
                        // onClick={(e) => e.target.showPicker()}
                        floating
                        className="custom-border"
                        style={{ borderColor: 'blue', width: '100%' }}
                      />
                    </div>
                  </div>
                  <div className="form-group row mb-3">
                    <div className="col-md-11">
                      <MDBInput
                        autoComplete="off"
                        type="text"
                        id="jobClssifiedCodeNo"
                        name="jobClssifiedCodeNo"
                        label="Job Classified Code No"
                        value={formData.jobClssifiedCodeNo || ' '}
                        onChange={handleChange}
                        floating
                        className="custom-input"
                        style={{ borderColor: 'blue', width: '100%' }}
                      />
                    </div>
                  </div>
                  <div className="form-group row mb-3">
                    <div className="col-md-11">
                      <MDBInput
                        autoComplete="off"
                        type="text"
                        id="insurerFile"
                        name="insurerFile"
                        label="Insurer/Self Insurer File#"
                        value={formData.insurerFile || ' '}
                        onChange={handleChange}
                        floating
                        className="custom-input"
                        style={{ borderColor: 'blue', width: '100%' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Second Row */}
                <div className="form-section">
                  <div className="form-group row mb-2 mt-3">
                    <div className="col-md-12">
                      <MDBInput
                        autoComplete="off"
                        type="text"
                        ref={getFieldRef('daysWorkedPerWeek')}
                        label={<>Number of Days Worked Per Week<span style={{ color: 'red' }}>*</span></>}
                        id="daysWorkedPerWeek"
                        name="daysWorkedPerWeek"
                        value={formData.daysWorkedPerWeek || ' '}
                        onChange={handleChange}
                        floating
                        required
                        className={`custom-input ${errors.daysWorkedPerWeek ? 'p-invalid' : ''}`}
                        style={{ borderColor: 'blue', width: '100%' }}
                      />
                      {errors.daysWorkedPerWeek && (
                        <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                          {errors.daysWorkedPerWeek}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group row mb-2 mt-3">
                    <div className="col-md-12">
                      <MDBInput
                        autoComplete="off"
                        type="text"
                        id="wageRate"
                        name="wageRate"
                        label="Wage rate at time of Injury or Disease:"
                        value={formData.wageRate || ' '}
                        onChange={handleChange}
                        floating
                        className="custom-input"
                        style={{ borderColor: 'blue', width: '100%' }}
                      />
                    </div>
                  </div>
                  <div className="form-group row mb-2 custom-radio">
                    <label className="col-md-8 col-form-label custom-label">
                      Do you have any days Off?<span style={{ color: 'red' }}>*</span>
                    </label>
                    <div ref={fieldRefs.current.daysOff} className="col-md-8">
                      <div className="form-check form-check-inline">
                        <input
                          autoComplete="off"
                          className={`form-check-input ${errors.daysOff ? 'p-invalid' : ''}`}
                          type="radio"
                          name="daysOff"
                          id="daysOffYes"
                          value="Y"
                          checked={formData.daysOff === 'Y'}
                          onChange={handleChange}
                          required
                          style={{ marginTop: '14px' }}
                        />
                        <label className="form-check-label custom-label" style={{ marginTop: '14px' }} htmlFor="daysOffYes">
                          Yes
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          autoComplete="off"
                          className={`form-check-input ${errors.daysOff ? 'p-invalid' : ''}`}
                          type="radio"
                          name="daysOff"
                          id="daysOffNo"
                          value="N"
                          checked={formData.daysOff === 'N'}
                          onChange={handleChange}
                          required
                          style={{ marginTop: '14px' }}
                        />
                        <label className="form-check-label custom-label" style={{ marginTop: '14px' }} htmlFor="daysOffNo">
                          No
                        </label>
                      </div>
                      {errors.daysOff && (
                        <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                          {errors.daysOff}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-section mt-2">
                  <div className="form-group row mb-2 custom-radio">
                    <label className="col-md-8 col-form-label custom-label">Wage Rate Frequency:</label>
                    <div className="col-md-12">
                      <div className="form-check form-check-inline">
                        <input
                          autoComplete="off"
                          className="form-check-input"
                          type="radio"
                          name="wageRateFrequency"
                          id="perHour"
                          value="perHour"
                          checked={formData.wageRateFrequency === 'perHour'}
                          onChange={handleChange}
                          style={{ marginTop: '14px' }}
                        />
                        <label className="form-check-label custom-label" style={{ marginTop: '12px' }} htmlFor="perHour">
                          Per Hour
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          autoComplete="off"
                          className="form-check-input"
                          type="radio"
                          name="wageRateFrequency"
                          id="perDay"
                          value="perDay"
                          checked={formData.wageRateFrequency === 'perDay'}
                          onChange={handleChange}
                          style={{ marginTop: '14px' }}
                        />
                        <label className="form-check-label custom-label" style={{ marginTop: '12px' }} htmlFor="perDay">
                          Per Day
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          autoComplete="off"
                          className="form-check-input"
                          type="radio"
                          name="wageRateFrequency"
                          id="perWeek"
                          value="perWeek"
                          checked={formData.wageRateFrequency === 'perWeek'}
                          onChange={handleChange}
                          style={{ marginTop: '14px' }}
                        />
                        <label className="form-check-label custom-label" style={{ marginTop: '12px' }} htmlFor="perWeek">
                          Per Week
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          autoComplete="off"
                          className="form-check-input"
                          type="radio"
                          name="wageRateFrequency"
                          id="perMonth"
                          value="perMonth"
                          checked={formData.wageRateFrequency === 'perMonth'}
                          onChange={handleChange}
                          style={{ marginTop: '14px' }}
                        />
                        <label className="form-check-label custom-label" style={{ marginTop: '12px' }} htmlFor="perMonth">
                          Per Month
                        </label>
                      </div>
                    </div>
                  </div>
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
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <div className="p-fluid">
                          <FloatLabel className="w-full md:w-14rem">
                            <Dropdown
                              value={formData.naicsTypes}
                              name="naicsTypes"
                              onChange={handleChange}
                              // options={naicsTypes.map(type => ({
                              //   label: type.description,
                              //   value: type.value
                              // }))}
                              options={naicsTypes.map(type => ({
                                label: type.description,
                                value: { id: type.id, code: type.code, description: type.description }
                              }))}
                              placeholder="---Select One---"
                              filter
                              className="select-dropdown  custom-input col-md-12"
                              label="NAICS Type"
                            />
                            <label htmlFor="naicsTypes">NAICS Code:</label>
                          </FloatLabel>
                        </div>
                      </div>

                      <div className="col-md-4 mb-3">
                        <MDBInput
                          type="date"
                          label={<>Date of Injury<span style={{ color: 'red' }}>*</span> </>}
                          // onClick={(e) => e.target.showPicker()}
                          id="dateOfInjury"
                          name="dateOfInjury"
                          //value={formatDateForInput(formData.dateOfInjury)}
                          value={formData.dateOfInjury ? new Date(formData.dateOfInjury).toISOString().split('T')[0] : ''}
                          onChange={handleChange}
                          className="custom-border"
                          required
                          disabled
                          invalid={errors.dateOfInjury}
                          floating
                        />
                        {errors.dateOfInjury && (
                          <div className="invalid-feedback">{errors.dateOfInjury}</div>
                        )}
                      </div>

                      <div className="col-md-3 mb-3">
                        <MDBInput
                          type="time"
                          // onClick={(e) => e.target.showPicker()}
                          label="Time of Injury"
                          className="custom-input"
                          name="timeOfInjury"
                          value={formData.timeOfInjury}
                          onChange={handleChange}
                          floating
                        />
                      </div>
                    </div>

                    {/* Second Row: County of Injury, Date Employer Knowledge, First Date Employee Failed to Work */}
                    <div className="row  mt-1">
                      <div className="col-md-4 mb-3">
                        <MDBInput
                          type="text"
                          label={<>County Of Injury<span style={{ color: 'red' }}>*</span> </>}
                          id="countyOfInjury"
                          className="custom-input"
                          name="countyOfInjury.description"
                          value={formData.countyOfInjury.description || ' '}
                          onChange={handleChange}
                          disabled
                          invalid={errors['countyOfInjury.description']}
                          floating
                        />
                        {errors['countyOfInjury.description'] && (
                          <div className="invalid-feedback">{errors['countyOfInjury.description']}</div>
                        )}
                      </div>

                      <div className="col-md-4 mb-3">
                        <MDBInput
                          type="date"
                          // onClick={(e) => e.target.showPicker()}
                          label="Date Employer had Knowledge of Injury"
                          className="custom-input"
                          name="dateEmployerKnowledge"
                          value={formData.dateEmployerKnowledge}
                          onChange={handleChange}
                          floating
                        />
                      </div>

                      <div className="col-md-3 mb-3">
                        <MDBInput
                          type="date"
                          // onClick={(e) => e.target.showPicker()}
                          label="First Date Employee Failed to Work"
                          className="custom-input"
                          name="firstDateFailed"
                          value={formData.firstDateFailed}
                          onChange={handleChange}
                          floating
                        />
                      </div>
                    </div>

                    <div className='row  mt-1'>
                      <div className="col-md-4 mb-3">
                        <label className="col-sm-8 col-form-label custom-label">
                          Did Employee Receive Full Pay on Date of Injury: <span style={{ color: 'red' }}>*</span>
                        </label>
                        <div className="col-sm-8 custom-radio">
                          <div className="form-check form-check-inline">
                            <input
                              autoComplete="off"
                              ref={getFieldRef('receivedFullPay')}
                              className={`form-check-input ${errors.receivedFullPay ? 'p-invalid' : ''}`}
                              type="radio"
                              name="receivedFullPay"
                              value="Y"
                              checked={formData.receivedFullPay === 'Y'}
                              onChange={handleChange}
                              required
                            />
                            <label className="form-check-label custom-label" htmlFor="Yes">Yes</label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              autoComplete="off"
                              ref={getFieldRef('receivedFullPay')}
                              className={`form-check-input ${errors.receivedFullPay ? 'p-invalid' : ''}`}
                              type="radio"
                              name="receivedFullPay"
                              value="N"
                              checked={formData.receivedFullPay === 'N'}
                              onChange={handleChange}
                            />
                            <label className="form-check-label custom-label" htmlFor="No">No</label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              autoComplete="off"
                              ref={getFieldRef('receivedFullPay')}
                              className={`form-check-input ${errors.receivedFullPay ? 'p-invalid' : ''}`}
                              type="radio"
                              name="receivedFullPay"
                              value="NA"
                              checked={formData.receivedFullPay === 'NA'}
                              onChange={handleChange}
                            />
                            <label className="form-check-label custom-label" htmlFor="None">None</label>
                          </div>
                          {errors.receivedFullPay && (
                            <div className="error-message" style={{ color: 'red', fontSize: '12px' }}>
                              {errors.receivedFullPay}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="col-sm-12 col-form-label custom-label mt-0">
                          Did Injury/Illness Occur on Employer's premises?: <span style={{ color: 'red' }}>*</span>
                        </label>
                        <div className="col-sm-8 custom-radio">
                          <div className="form-check form-check-inline">
                            <input
                              autoComplete="off"
                              ref={getFieldRef('injuredInEmpPermises')}
                              className={`form-check-input ${errors.injuredInEmpPermises ? 'p-invalid' : ''}`}
                              type="radio"
                              name="injuredInEmpPermises"
                              value="Y"
                              checked={formData.injuredInEmpPermises === 'Y'}
                              onChange={handleChange}
                              required
                            />
                            <label className="form-check-label custom-label" htmlFor="Yes">Yes</label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              autoComplete="off"
                              ref={getFieldRef('injuredInEmpPermises')}
                              className={`form-check-input ${errors.injuredInEmpPermises ? 'p-invalid' : ''}`}
                              type="radio"
                              name="injuredInEmpPermises"
                              value="N"
                              checked={formData.injuredInEmpPermises === 'N'}
                              onChange={handleChange}
                            />
                            <label className="form-check-label custom-label" htmlFor="No">No</label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              autoComplete="off"
                              ref={getFieldRef('injuredInEmpPermises')}
                              className={`form-check-input ${errors.injuredInEmpPermises ? 'p-invalid' : ''}`}
                              type="radio"
                              name="injuredInEmpPermises"
                              value="NA"
                              checked={formData.injuredInEmpPermises === 'NA'}
                              onChange={handleChange}
                            />
                            <label className="form-check-label custom-label" htmlFor="None">None</label>
                          </div>
                          {errors.injuredInEmpPermises && (
                            <div className="error-message" style={{ color: 'red', fontSize: '12px' }}>
                              {errors.injuredInEmpPermises}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Third Row: Full Pay on Date of Injury, Occurred on Premises */}
                    <div className="row  mt-1">
                      <div className="col-md-4 mb-3 mt-4">
                        <div className="form-group">
                          <FloatLabel>
                            <Dropdown
                              value={formData.typeOfInjury}
                              name="typeOfInjury"
                              onChange={handleChange}
                              options={typeOfInjury.map(type => ({
                                label: type.description,
                                value: { id: type.id, code: type.code, description: type.description }
                              }))}
                              placeholder="---Select One---"
                              filter
                              // className="select-dropdown custom-input col-md-12"
                              className={`select-dropdown custom-input col-md-12 ${errors.typeOfInjury ? 'p-invalid' : ''}`}
                              ref={getFieldRef('typeOfInjury')}

                              label="Type of Injury/Illness"
                            // dropdownClassName="custom-dropdown-panel"
                            />
                            <label htmlFor="typeOfInjury">Type of Injury/Illness<span style={{ color: 'red' }}>*</span></label>

                          </FloatLabel>
                          {errors.typeOfInjury && (
                            <div className="error-message" style={{ color: 'red', fontSize: '12px' }}>
                              {errors.typeOfInjury}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="form-group">
                          <label htmlFor="otherInjuryCause" className="col-md-12 col-form-label custom-label">
                            How Injury or Illness / Abnormal Health Condition Occurred: <span style={{ color: 'red' }}>*</span>
                          </label>
                          <textarea
                            name="otherInjuryCause"
                            value={formData.otherInjuryCause}
                            onChange={handleChange}
                            rows="3"
                            className={`form-control-nr col-md-12 ${errors.otherInjuryCause ? 'p-invalid' : ''}`}
                          />
                          {errors.otherInjuryCause && (
                            <div className="error-message" style={{ color: 'red', fontSize: '12px' }}>
                              {errors.otherInjuryCause}
                            </div>
                          )}
                          <Dropdown
                            value={formData.injuryCauseTypes}
                            name="injuryCauseTypes"
                            className='select-dropdown custom-input col-md-12'
                            onChange={handleChange}
                            options={injuryCauseTypes.map(type => ({
                              label: type.description,
                              value: { id: type.id, code: type.code, description: type.description }
                            }))}
                            placeholder="---Select One---"
                            filter
                            // dropdownClassName="custom-dropdown-panel"
                            inputRef={getFieldRef('injuryCauseTypes')}
                          />
                        </div>

                      </div>
                      {/* </div> */}

                      {/* Body Part Affected */}
                      {/* <div className="row"> */}
                      <div className="col-md-7">
                        <div className="form-group row">
                          <label className="col-sm-4 col-form-label custom-label" style={{ marginLeft: '0px' }}>
                            Body Part Affected: <span style={{ color: 'red' }}>*</span>
                          </label>
                          <div className="col-sm-2 picklist-container" style={{ width: '100%' }}>
                            <PickList
                              dataKey="id"
                              inputRef={pickListRef}
                              name="bodyPartAffected"
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
                            {errors.bodyPartAffected && (
                              <div className="error-message" style={{ color: 'red', fontSize: '12px', marginLeft: '70px' }}>
                                {errors.bodyPartAffected}
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionTab>
                <AccordionTab header="Medical" onClick={() => handleToggle(0)}>
                  <div className={`accordion-content ${activeIndex === 0 ? 'active' : ''}`}>
                    <div className="d-flex flex-wrap">
                      {/* First Column - Treating Physician Information */}
                      <div className="flex-fill">
                        <div className="form-group row mb-1 mt-2">
                          <div className="col-md-3">
                            <MDBInput
                              type="text"
                              label="Treating Physician Name"
                              id="tPhysicianName"
                              name="tPhysicianName"
                              value={formData.tPhysicianName || ' '}
                              onChange={handleChange}
                              floating
                              className="custom-input mb-2"
                            />
                          </div>
                          <div className="col-md-3">
                            <MDBInput
                              type="text"
                              label="Treating Physician Address 1"
                              id="tPhysicianAddress1"
                              name="tPhysicianAddress1"
                              value={formData.tPhysicianAddress1 || ' '}
                              onChange={handleChange}
                              floating
                              className="custom-input mb-2"
                            />
                          </div>
                          <div className="col-md-3">
                            <MDBInput
                              type="text"
                              label="Treating Physician Address 2"
                              id="tPhysicianAddress2"
                              name="tPhysicianAddress2"
                              value={formData.tPhysicianAddress2 || ' '}
                              onChange={handleChange}
                              floating
                              className="form-control custom-input mb-2"
                            />
                          </div>
                          <div className="col-md-2">
                            <MDBInput
                              type="text"
                              label="Treating Physician City"
                              id="tPhysicianCity"
                              name="tPhysicianCity"
                              value={formData.tPhysicianCity || ' '}
                              onChange={handleChange}
                              floating
                              className="form-control custom-input mb-2"
                            />
                          </div>
                        </div>

                        <div className="form-group row mb-1 mt-3">
                          <div className="col-md-3">
                            <Dropdown
                              // value={formData.physicianStateTypes} setHospitalState,setHospitalState,setPhysicianState
                              value={formData.selectedPhysicianState || 'GA'}
                              name="physicianStateTypes"
                              onChange={handleChange}
                              options={physicianStateTypes.map(type => ({
                                label: type.description,
                                value: type.code
                              }))}
                              filter
                              className="dropdown-select mb-2"
                              dropdownClassName="custom-dropdown-panel"
                              placeholder="State"
                            />
                          </div>
                          <div className="col-md-2">
                            <MDBInput
                              type="text"
                              label="Treating Physician ZIP"
                              id="tPhysicianZIP"
                              name="tPhysicianZIP"
                              value={formData.tPhysicianZIP || ' '}
                              onChange={handleChange}
                              floating
                              className="form-control custom-input mb-2"
                            />
                          </div>
                          <div className="col-md-1 d-flex align-items-center">
                            <MDBInput
                              type="text"
                              label="Ext"
                              id="tPhysicianZIPExt"
                              name="tPhysicianZIPExt"
                              value={formData.tPhysicianZIPExt || ' '}
                              onChange={handleChange}
                              floating
                              style={{ marginLeft: '9px' }}
                              className="form-control custom-input mb-2"
                            />
                          </div>
                          <div className="col-md-2">
                            <MDBInput
                              type="text"
                              label="Treating Physician Phone"
                              id="tPhysicianPhone"
                              name="tPhysicianPhone"
                              value={formData.tPhysicianPhone || ' '}
                              onChange={handleChange}
                              floating
                              className="form-control custom-input mb-2"
                            />
                          </div>
                          <div className="col-md-1 d-flex align-items-center">
                            <MDBInput
                              type="text"
                              label="Ext"
                              id="tPhysicianPhoneExt"
                              name="tPhysicianPhoneExt"
                              value={formData.tPhysicianPhoneExt || ' '}
                              onChange={handleChange}
                              floating
                              style={{ marginLeft: '9px' }}
                              className="form-control custom-input mb-2"
                            />
                          </div>
                          <div className="col-md-2">
                            <Dropdown
                              value={formData.treatmentTypes}
                              name="treatmentTypes"
                              onChange={handleChange}
                              // options={treatmentTypes.map(type => ({
                              //   label: type.description, // Displayed in the dropdown
                              //   value: type.id // Value sent on change
                              // }))}
                              options={treatmentTypes.map(type => ({
                                label: type.description,
                                value: { id: type.id, description: type.description }
                              }))}
                              filter
                              className="dropdown-select mb-2"
                              dropdownClassName="custom-dropdown-panel"
                              placeholder="Initial Treatment">

                            </Dropdown>
                          </div>
                        </div>
                      </div>
                      <div className="flex-fill">
                        <div className="form-group row mb-1 mt-2">

                          <div className="col-md-3">
                            <MDBInput
                              type="text"
                              label="Hospital/Treating Facility"
                              id="treatingFacility"
                              name="treatingFacility"
                              value={formData.treatingFacility || ' '}
                              onChange={handleChange}
                              floating
                              className="form-control custom-input mb-2"
                            />
                          </div>
                          <div className="col-md-3">
                            <MDBInput
                              type="text"
                              label="Hospital/Treating Facility Address 1"
                              id="treatingFacilityAddress1"
                              name="treatingFacilityAddress1"
                              value={formData.treatingFacilityAddress1 || ' '}
                              onChange={handleChange}
                              floating
                              className="form-control custom-input mb-2"
                            />
                          </div>
                          <div className="col-md-3">
                            <MDBInput
                              type="text"
                              label="Hospital/Treating Facility Address 2"
                              id="treatingFacilityAddress2"
                              name="treatingFacilityAddress2"
                              value={formData.treatingFacilityAddress2 || ' '}
                              onChange={handleChange}
                              floating
                              className="form-control custom-input mb-2"
                            />
                          </div>
                          <div className="col-md-2">
                            <MDBInput
                              type="text"
                              label="Hospital/Treating Facility City"
                              id="treatingFacilityCity"
                              name="treatingFacilityCity"
                              value={formData.treatingFacilityCity || ' '}
                              onChange={handleChange}
                              floating
                              className="form-control custom-input mb-2"
                            />
                          </div>
                        </div>

                        <div className="form-group row mb-1 mt-2">

                          <div className="col-md-3">
                            <Dropdown
                              // value={formData.hospitalStateTypes} selectedPhysicianState,selectedHospitalState
                              value={formData.selectedHospitalState || 'GA'}
                              name="hospitalStateTypes"
                              onChange={handleChange}
                              options={hospitalStateTypes.map(type => ({
                                label: type.description,
                                //value: type.code
                                value: { value: type.code, description: type.description }
                              }))}
                              filter
                              className="dropdown-select mb-2"
                              dropdownClassName="custom-dropdown-panel"
                              placeholder="State"
                            />
                          </div>
                          <div className="col-md-2">
                            <MDBInput
                              type="text"
                              label="Hospital/Treating Facility Zip"
                              id="treatingFacilityZIP"
                              name="treatingFacilityZIP"
                              value={formData.treatingFacilityZIP || ' '}
                              onChange={handleChange}
                              floating
                              className="form-control custom-input mb-2"
                            />
                          </div>
                          <div className="col-md-1 d-flex align-items-center">
                            <MDBInput
                              type="text"
                              label="Ext"
                              id="treatingFacilityZIPExt"
                              name="treatingFacilityZIPExt"
                              value={formData.treatingFacilityZIPExt || ' '}
                              onChange={handleChange}
                              floating
                              style={{ marginLeft: '9px' }}
                              className="form-control custom-input mb-2"
                            />
                          </div>
                          {/* </div> */}

                          {/* <div className="form-group row mb-1"> */}
                          <div className="col-md-2">
                            <MDBInput
                              type="text"
                              label="Hospital Phone"
                              id="hospitalPhone"
                              name="hospitalPhone"
                              value={formData.hospitalPhone || ' '}
                              onChange={handleChange}
                              floating
                              className="form-control custom-input mb-2"
                            />
                          </div>
                          <div className="col-md-1 d-flex align-items-center">
                            <MDBInput
                              type="text"
                              label="Ext"
                              id="hospitalPhoneExt"
                              name="hospitalPhoneExt"
                              value={formData.hospitalPhoneExt || ' '}
                              onChange={handleChange}
                              floating
                              style={{ marginLeft: '9px' }}
                              className="form-control custom-input mb-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* </AccordionTab>
                <AccordionTab header="Report" onClick={() => handleToggle(0)}> */}
                  {/* <div className={`accordion-content ${activeIndex === 0 ? 'active' : ''}`}>
                    <div> */}
                  {/* First Row: NAICS Code, Date of Injury, Time of Injury */}

                  <hr style={{ height: '1px', backgroundColor: 'black', border: 'none', margin: '20px 0' }} />



                  {/* <hr style={{ height: '1px', backgroundColor: 'black', border: 'none' }} /> */}
                  {/* <div className="d-flex flex-wrap">*/}
                  {/* <div className="form-section flex-fill">  */}
                  <div className="form-group row mb-1 mt-3">
                    <div className="col-md-3">
                      <div className="form-outline">
                        {/* <MDBFloatingLabel label="If Returned to Work, Give Date:" className="custom-label"> */}
                        <MDBInput
                          autoComplete="off"
                          label="If Returned to Work, Give Date:"
                          type="date"
                          className="form-control custom-input mb-2"
                          id="RtwDate"
                          name="RtwDate"
                          value={formData.RtwDate}
                          onChange={handleChange}
                        // onClick={(e) => e.target.showPicker()}
                        />
                        {/* </MDBFloatingLabel> */}
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-outline">
                        {/* <MDBFloatingLabel label="Returned at what wage per week:" className="custom-label"> */}
                        <MDBInput
                          autoComplete="off"
                          label="Returned at what wage per week:"
                          type="text"
                          className="form-control custom-input mb-2"
                          id="ReturnedWagePerWeek"
                          name="ReturnedWagePerWeek"
                          value={formData.ReturnedWagePerWeek || ' '}
                          onBlur={handleBlur}
                          onFocus={handleFocus}
                          onChange={handleChange}
                          style={{ marginRight: '5px' }}
                        />
                        {/* </MDBFloatingLabel> */}
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-outline">
                        {/* <MDBFloatingLabel label="If Fatal, Enter Complete Date of Death:" className="custom-label"> */}
                        <MDBInput
                          autoComplete="off"
                          label="If Fatal, Enter Complete Date of Death:"
                          type="date"
                          className="form-control custom-input mb-2"
                          id="FatalDeathDate"
                          name="FatalDeathDate"
                          value={formData.FatalDeathDate}
                          onChange={handleChange}
                          onClick={(e) => e.target.showPicker()}
                        />
                        {/* </MDBFloatingLabel> */}
                      </div>
                    </div>
                  </div>
                  {/* </div> */}
                  {/* </div> */}
                  <hr style={{ height: '1px', backgroundColor: 'black', border: 'none', margin: '20px 0' }} />
                  {/* <div className="d-flex flex-wrap">
                        <div className="form-section flex-fill"> */}
                  <div className="form-group row mb-1 mt-2" >
                    <div className="col-md-3">
                      <div className="form-outline">
                        {/* <MDBFloatingLabel label="Report Prepared By (Print or Type):" className="custom-label"> */}
                        <MDBInput
                          autoComplete="off"
                          label="Report Prepared By (Print or Type):"
                          type="text"
                          className="form-control custom-input mb-2"
                          id="reportPreparedBy"
                          name="reportPreparedBy"
                          value={formData.reportPreparedBy || ' '}
                          onChange={handleChange}
                        />
                        {/* </MDBFloatingLabel> */}
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-outline">
                        {/* <MDBFloatingLabel label="Telephone Number:" className="custom-label"> */}
                        <MDBInput
                          autoComplete="off"
                          label="Telephone Number:"
                          type="text"
                          className="form-control custom-input mb-2"
                          id="telePhoneNumber"
                          name="telePhoneNumber"
                          value={formData.telePhoneNumber || ' '}
                          onChange={handleChange}
                        />
                        {/* </MDBFloatingLabel> */}
                      </div>
                    </div>

                    <div className="col-md-1 d-flex align-items-center">
                      <div className="form-outline">
                        {/* <MDBFloatingLabel label="Ext:" className="custom-label"> */}
                        <MDBInput
                          autoComplete="off"
                          label="Ext:"
                          type="text"
                          className="form-control custom-input mb-2"
                          id="telePhoneExt"
                          name="telePhoneExt"
                          value={formData.telePhoneExt || ' '}
                          onChange={handleChange}
                        />
                        {/* </MDBFloatingLabel> */}
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="form-outline">
                        {/* <MDBFloatingLabel label="Date of Report:" className="custom-label"> */}
                        <MDBInput
                          autoComplete="off"
                          label="Date of Report:"
                          type="date"
                          className="form-control custom-input"
                          id="DateOfReport"
                          name="DateOfReport"
                          value={formData.DateOfReport}
                          onChange={handleChange}
                        // onClick={(e) => e.target.showPicker()}
                        />
                        {/* </MDBFloatingLabel> */}
                      </div>
                    </div>
                  </div>
                  {/* </div> */}
                  {/* </div> */}
                  {/* <div> */}

                  {/* </div> */}
                  {/* </div>
                  </div> */}
                </AccordionTab>
              </Accordion>

            </div>
          )}
          {activeTab === 'tab5' && (
            <div className="card">
              {!formData.isControvertEnabled && !formData.sectionB && !formData.isMedicalInjuryEnabled && (
                <div style={{ color: 'red', fontSize: '14px' }}>
                  <i className="pi pi-exclamation-triangle" style={{ fontSize: '1rem', color: 'red', marginRight: '15px' }}></i>
                  Selection one of Section B/C/D is required.
                </div>
              )}
              <h1 className="custom-h1 header">
                <input
                  autoComplete="off"
                  type="checkbox"
                  checked={formData.sectionB}
                  onChange={handleCheckboxChange}
                  className="large-checkbox"
                  disabled={formData.isControvertEnabled || formData.isMedicalInjuryEnabled}
                  style={{ marginLeft: '10px', marginRight: '5px', marginBottom: '0px' }}
                />
                B. INCOME BENEFITS Form WC-6 must be filed if weekly benefit is less than maximum
              </h1>
              {formData.sectionB && !formData.incomeBenefits && (
                <div style={{ color: 'red', fontSize: '14px' }}>
                  <i className="pi pi-exclamation-triangle" style={{ fontSize: '1rem', color: 'red', marginRight: '15px' }}></i>
                  Income Benefits is required.
                </div>
              )}
              <div>
                <div className="form-group row mb-1 col-md-11">
                  <label className="col-3 col-form-label custom-label mr-0" style={{ marginTop: '10px' }}>
                    Check which benefits are being paid:<span style={{ color: 'red' }}>*</span>
                  </label>
                  <div className="col-sm-3 custom-radio d-flex  mt-0 ml-0">
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
                          checked={formData.incomeBenefits === 'Y'}
                          onChange={handleChange}
                          required
                        />
                        <label className="form-check-label custom-label" style={{ marginTop: '12px' }} htmlFor="incomeBenifits">
                          Income benefits
                        </label>
                      </div>



                      <div className="form-check form-check-inline mb-0">
                        <input
                          autoComplete="off"
                          className={`form-check-input ${errors.incomeBenefits ? 'p-invalid' : ''}`}
                          type="radio"
                          name="incomeBenefits"
                          id="salaryInLieu"
                          value="salaryInLieu"
                          disabled={!formData.sectionB}
                          style={{ marginTop: '12px' }}
                          checked={formData.incomeBenefits === 'N'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label custom-label" style={{ marginTop: '12px' }} htmlFor="salaryInLieu">
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
                {formData.incomeBenefits === 'Y' && (
                  <div className="form-group Income-Benifits-Form mt-2">
                    <div className="d-flex flex-wrap">
                      <div className="form-section" style={{ marginLeft: '10px' }}>
                        <div className="col-md-12 form-group row mb-1 align-items-center">
                          <label className="form-check-label custom-label col-md-6">Previously Medical Only:</label>
                          <div className="d-flex col-md-6 align-items-center">
                            <div className="form-check custom-radio form-check-inline  d-flex align-items-center">
                              <input
                                type="radio"
                                className="form-check-input"
                                name="previousMedicalOnly"
                                id="previouslyMedicalYes"
                                value="Y"
                                onChange={handleChange}
                                style={{ fontSize: '10px', color: 'black' }}
                              />
                              <label className="form-check-label custom-label ms-1" htmlFor="previouslyMedicalYes" style={{ lineHeight: '1.5' }}>Yes</label>
                            </div>
                            <div className="form-check custom-radio form-check-inline d-flex align-items-center">
                              <input
                                type="radio"
                                className="form-check-input"
                                name="previousMedicalOnly"
                                id="previouslyMedicalNo"
                                value="N"
                                onChange={handleChange}
                                style={{ fontSize: '10px', color: 'black' }}
                              />
                              <label className="form-check-label custom-label ms-1" htmlFor="previouslyMedicalNo" style={{ lineHeight: '1.5' }}>No</label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-section" >
                        <div className="col-md-12 form-group row mb-1">
                          <MDBInput
                            label={<>Average Weekly Wage: <span style={{ color: 'red' }}>*</span> </>}
                            type="text"
                            ref={getFieldRef('averageWeeklyWage')}
                            className={`form-control custom-input inclass ${errors.averageWeeklyWage ? 'p-invalid' : ''}`}
                            id="averageWeeklyWage"
                            name="averageWeeklyWage"
                            value={formData.averageWeeklyWage || ' '}
                            onBlur={handleBlur} onFocus={handleFocus}
                            onChange={handleChange}
                            floatingLabel
                            required
                          />
                          {errors.averageWeeklyWage && (
                            <div className="error-message" style={{ color: 'red', fontSize: '12px' }}>
                              {errors.averageWeeklyWage}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-section">
                        <div className="col-md-12 form-group row">
                          <MDBInput
                            label={<>Weekly Benefit: $ <span style={{ color: 'red' }}>*</span> </>}
                            type="text"
                            ref={getFieldRef('weeklyBenefit')}
                            className={`form-control custom-input inclass ${errors.weeklyBenefit ? 'p-invalid' : ''}`}
                            id="weeklyBenefit"
                            name="weeklyBenefit"
                            value={formData.weeklyBenefit || ' '}
                            onBlur={handleBlur} onFocus={handleFocus}
                            onChange={handleChange}
                            floatingLabel
                            required
                          />
                          {errors.weeklyBenefit && (
                            <div className="error-message" style={{ color: 'red', fontSize: '12px' }}>
                              {errors.weeklyBenefit}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-section">
                        <div className="col-md-12 form-group row">
                          <MDBInput
                            label="Date of Disability"
                            type="date"
                            className="form-control custom-input inclass"
                            id="dateOfDisability"
                            name="dateOfDisability"
                            value={formData.dateOfDisability || ' '}
                            onChange={handleChange}
                            // onClick={(e) => e.target.showPicker()}
                            floatingLabel
                            required
                          />
                        </div>
                      </div>

                      <div className="form-section mb-2">
                        <div className="col-md-12 form-group row mb-1">
                          <MDBInput
                            label={<>Date Of First Payment: <span style={{ color: 'red' }}>*</span> </>}
                            type="date"
                            ref={getFieldRef('dateOfFirstPayment')}
                            className={`form-control custom-input inclass ${errors.dateOfFirstPayment ? 'p-invalid' : ''}`}
                            id="dateOfFirstPayment"
                            name="dateOfFirstPayment"
                            value={formData.dateOfFirstPayment}
                            onChange={handleChange}
                            // onClick={(e) => e.target.showPicker()}
                            floatingLabel
                            required
                          />
                          {errors.dateOfFirstPayment && (
                            <div className="error-message" style={{ color: 'red', fontSize: '12px' }}>
                              {errors.dateOfFirstPayment}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-wrap mt-3">
                      <div className="form-section" style={{ marginLeft: '10px' }}>
                        <div className="col-md-12 form-group row mb-2">
                          <MDBInput
                            label={<>Compensation Paid: $ <span style={{ color: 'red' }}>*</span> </>}
                            type="text"
                            ref={getFieldRef('compensationPaid')}
                            className={`form-control custom-input inclass ${errors.compensationPaid ? 'p-invalid' : ''}`}
                            id="compensationPaid"
                            name="compensationPaid"
                            value={formData.compensationPaid || ' '}
                            onBlur={handleBlur} onFocus={handleFocus}
                            onChange={handleChange}
                            floatingLabel
                            required
                          />
                          {errors.compensationPaid && (
                            <div className="error-message" style={{ color: 'red', fontSize: '12px' }}>
                              {errors.compensationPaid}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-section">
                        <div className="col-md-12 form-group row mb-1">
                          <MDBInput
                            label="Penalty Paid: $"
                            type="text"
                            className="form-control custom-input inclass"
                            id="penalityPaid"
                            name="penalityPaid"
                            value={formData.penalityPaid || ' '}
                            onBlur={handleBlur} onFocus={handleFocus}
                            onChange={handleChange}
                            floatingLabel
                          />
                        </div>
                      </div>

                      <div className="form-section" style={{ marginRight: '10px' }}>
                        <div className="col-md-12 form-group  mb-1">
                          <MDBInput
                            label={<>Benefits Payable From Date: <span style={{ color: 'red' }}>*</span> </>}
                            type="date"
                            ref={getFieldRef('dateBenefitsPayableFrom')}
                            className={`form-control custom-input inclass ${errors.dateBenefitsPayableFrom ? 'p-invalid' : ''}`}
                            id="dateBenefitsPayableFrom"
                            name="dateBenefitsPayableFrom"
                            value={formData.dateBenefitsPayableFrom}
                            onChange={handleChange}
                            // onClick={(e) => e.target.showPicker()}
                            floatingLabel
                            required
                          />
                          {errors.dateBenefitsPayableFrom && (
                            <div className="error-message" style={{ color: 'red', fontSize: '12px' }}>
                              {errors.dateBenefitsPayableFrom}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-3 mb-1">
                        <div className="form-group row">
                          <FloatLabel>
                            <Dropdown
                              value={formData.disabilityTypes}
                              name="disabilityTypes"
                              onChange={handleChange}
                              options={disabilityTypes.map(type => ({
                                label: type.description,
                                //value: type.code
                                value: type.description
                                //value: { id: type.id, code: type.code, description: type.description }
                              }))}
                              placeholder="---Select One---"
                              filter
                              // className="select-dropdown custom-input col-md-12"
                              className={`dropcss col-md-10 ${errors.disabilityTypes ? 'p-invalid' : ''}`}
                              ref={getFieldRef('disabilityTypes')}
                              label="Benefits Payable For"
                              dropdownClassName="custom-dropdown-panel"
                            />
                            <label htmlFor="disabilityTypes" style={{ marginLeft: '15px' }}>Benefits Payable For<span style={{ color: 'red' }}>*</span></label>
                          </FloatLabel>
                          {errors.disabilityTypes && (
                            <div className="error-message" style={{ color: 'red', fontSize: '12px' }}>
                              {errors.disabilityTypes}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="form-section" style={{ marginLeft: '10px' }}>
                        <div className="col-md-12 form-group row mb-1">
                          <MDBInput
                            label="Pay Benefit Until: "
                            type="date"
                            ref={getFieldRef('PayBenefitUntil')}
                            className={`form-control custom-input inclass ${errors.PayBenefitUntil ? 'p-invalid' : ''}`}
                            id="PayBenefitUntil"
                            name="PayBenefitUntil"
                            value={formData.PayBenefitUntil}
                            onChange={handleChange}
                            // onClick={(e) => e.target.showPicker()}
                            floatingLabel
                            required
                          />
                          {errors.PayBenefitUntil && (
                            <div className="error-message" style={{ color: 'red', fontSize: '12px' }}>
                              {errors.PayBenefitUntil}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="d-flex flex-wrap mt-3">
                      <div className="form-section" >
                        <div className="col-md-12 form-group row mb-1">
                          {formData.disabilityTypes?.trim().toLowerCase() === 'permanen' && (
                            <>
                              <div className="form-group row col-md-3">
                                {/* <label htmlFor="disabilityPercentage">Disability %:<span style={{ color: 'red' }}>*</span></label> */}
                                <MDBInput
                                  label='Disability %:'
                                  type="text"
                                  id="disabilityPercentage"
                                  name="disabilityPercentage"
                                  value={formData.disabilityPercentage || ' '}
                                  onChange={handleChange}
                                  className={`custom-input  inclass ${errors.disabilityPercentage ? 'p-invalid' : ''}`}
                                />
                                {errors.disabilityPercentage && (
                                  <div className="error-message" style={{ color: 'red', fontSize: '12px' }}>
                                    {errors.disabilityPercentage}
                                  </div>
                                )}
                              </div>

                              <div className="form-group row col-md-3">
                                {/* <label htmlFor="disabledBodyPart">Disabled Body Part:<span style={{ color: 'red' }}>*</span></label> */}
                                <FloatLabel>
                                  <Dropdown
                                    value={formData.disabledBodyPart}
                                    name="disabledBodyPart"
                                    onChange={handleChange}
                                    options={disabilityTypes.map(part => ({
                                      label: part.description,
                                      value: part.value
                                    }))}
                                    placeholder="---Select Body Part---"
                                    className={`select-dropdown custom-input inclass col-md-12 ${errors.disabledBodyPart ? 'p-invalid' : ''}`}
                                    ref={getFieldRef('disabledBodyPart')}
                                  />
                                  <label htmlFor="disabilityTypes" style={{ marginLeft: '15px' }}>Disabled Body Part:<span style={{ color: 'red' }}>*</span></label>
                                </FloatLabel>
                                {errors.disabledBodyPart && (
                                  <div className="error-message" style={{ color: 'red', fontSize: '12px' }}>
                                    {errors.disabledBodyPart}
                                  </div>
                                )}
                              </div>

                              <div className="form-group row col-md-3">
                                {/* <label htmlFor="durationOfDisability">Duration of Disability:<span style={{ color: 'red' }}>*</span></label> */}
                                <div className="d-flex align-items-center">
                                  <MDBInput
                                    label='Duration of Disability:'
                                    type="text"
                                    id="durationOfDisability"
                                    name="durationOfDisability"
                                    value={formData.durationOfDisability || ' '}
                                    onChange={handleChange}
                                    className={`custom-input inclass col-md-12 ${errors.durationOfDisability ? 'p-invalid' : ''}`}
                                  />
                                  <span style={{ marginLeft: '5px' }}>(Weeks)</span>
                                </div>
                                {errors.durationOfDisability && (
                                  <div className="error-message" style={{ color: 'red', fontSize: '12px' }}>
                                    {errors.durationOfDisability}
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {formData.incomeBenefits === 'N' && (
                  <div className="d-flex flex-wrap">
                    <div className="form-section flex-fill">
                      <div className="form-group row mb-1">
                        <div className="col-md-3">
                          <label className="form-check-label custom-label">Previously Medical Only:</label>
                          <div className="d-flex">
                            <div className="form-check custom-radio form-check-inline mb-2">
                              <input
                                type="radio"
                                className="form-check-input"
                                name="previouslyMedicalOnly"
                                id="previouslyMedicalYes"
                                value="Y"
                                onChange={handleChange}
                                style={{ fontSize: '10px', color: 'black', marginTop: '8px' }}
                              />
                              <label className="form-check-label custom-label mt-2" htmlFor="previouslyMedicalYes">Yes</label>
                            </div>
                            <div className="form-check custom-radio form-check-inline">
                              <input
                                type="radio"
                                className="form-check-input"
                                name="previouslyMedicalOnly"
                                id="previouslyMedicalNo"
                                value="N"
                                onChange={handleChange}
                                style={{ fontSize: '10px', color: 'black', marginTop: '8px' }}
                              />
                              <label className="form-check-label custom-label mt-2" htmlFor="previouslyMedicalNo">No</label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                type="radio"
                                className="form-check-input mb-2"
                                name="previouslyMedicalOnly"
                                id="previouslyMedicalNone"
                                value="None"
                                onChange={handleChange}
                                style={{ fontSize: '10px', color: 'black', marginTop: '8px' }}
                              />
                              <label className="form-check-label custom-label mt-2" htmlFor="previouslyMedicalNone">None</label>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-3">
                          <MDBInput
                            label="Average Weekly Wage Amount ($)"
                            type="text"
                            id="averageWeeklyWageAmount"
                            name="averageWeeklyWageAmount"
                            value={formData.averageWeeklyWageAmount || ' '}
                            onBlur={handleBlur} onFocus={handleFocus}
                            onChange={handleChange}
                            className="form-control custom-input inclass mb-2"
                          />
                        </div>
                        <div className="col-md-3">
                          <MDBInput
                            label="Weekly Benefit Amount ($)"
                            type="text"
                            id="weeklyBenefitAmount"
                            name="weeklyBenefitAmount"
                            value={formData.weeklyBenefitAmount || ' '}
                            onBlur={handleBlur} onFocus={handleFocus}
                            onChange={handleChange}
                            className="form-control custom-input inclass mb-2"
                          />
                        </div>
                        <div className="col-md-3">
                          <MDBInput
                            label="Date of Disability"
                            type="date"
                            id="dateOfDisability"
                            name="dateOfDisability"
                            onChange={handleChange}
                            // onClick={(e) => e.target.showPicker()}
                            className="form-control custom-input inclass mb-2"
                          />
                        </div>
                      </div>

                      <div className="form-group row mb-2 mt-2">
                        <div className="col-md-3">
                          <MDBInput
                            label={<>Date Salary Paid <span style={{ color: 'red' }}>*</span> </>}
                            type="date"
                            ref={getFieldRef('dateSalaryPaid')}
                            className={`form-control custom-input inclass mb-2 ${errors.dateSalaryPaid ? 'p-invalid' : ''}`}
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

                        <div className="col-md-3">
                          <MDBInput
                            label={<>Benefits Payable From Date <span style={{ color: 'red' }}>*</span> </>}
                            type="date"
                            ref={getFieldRef('benefitsPayableFromDate')}
                            className={`form-control custom-input inclass mb-2 ${errors.benefitsPayableFromDate ? 'p-invalid' : ''}`}
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

                        <div className="col-md-3">
                          <FloatLabel className="w-full md:w-14rem">
                            <Dropdown
                              ref={getFieldRef('benefitsPayableFor')}
                              value={formData.benefitsPayableFor}
                              name="benefitsPayableFor"
                              onChange={handleChange}
                              placeholder="---Select One---"
                              filter
                              options={benefitsPayableFor}
                              dropdownClassName="custom-dropdown-panel"
                              className="select-dropdown custom-input inclass mb-2 col-md-12"
                              label="Benefits Payable For"
                            />
                            <label htmlFor="benefitsPayableFor">Benefits Payable For<span style={{ color: 'red' }}>*</span></label>
                          </FloatLabel>

                          {errors.benefitsPayableFor && (
                            <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                              {errors.benefitsPayableFor}
                            </div>
                          )}
                        </div>

                        <div className="col-md-3">
                          <MDBInput
                            label="Pay Benefit Until"
                            type="date"
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

              <h1 className="custom-h1  header" style={{ margingBottom: '10px' }}>
                <input autoComplete="off"
                  type="checkbox"
                  checked={formData.isControvertEnabled}
                  //onChange={() => setFormData((prev) => ({ ...prev, isControvertEnabled: !prev.isControvertEnabled }))}
                  onChange={() => setFormData((prev) => {
                    const updatedData = { ...prev, isControvertEnabled: !prev.isControvertEnabled };
                    if (!updatedData.isControvertEnabled) {
                      updatedData.controvertType = {};
                      updatedData.BenifitsNPReasons = '';
                    }
                    return updatedData;
                  })}
                  className="large-checkbox"
                  disabled={formData.sectionB || formData.isMedicalInjuryEnabled}
                  style={{ marginLeft: '10px', marginRight: '5px', marginBottom: '0px' }}
                />
                C. Notice To Convert Payment Of Compensation</h1>
              {formData.isControvertEnabled && !formData.controvertType && (
                <div style={{ color: 'red', fontSize: '14px' }}>
                  <i className="pi pi-exclamation-triangle-down" style={{ fontSize: '1rem', color: 'red', marginRight: '15px' }}></i>
                  Controvert Type is required.
                </div>
              )}
              <div className="form-group row mb-1">
                <label htmlFor="controvertTypes" className="col-md-2 col-form-label custom-label">Controvert Type:<span style={{ color: 'red' }}>*</span></label>
                <div className="col-md-3">
                  <Dropdown
                    value={formData.controvertType}
                    id="controvertTypes"
                    name="controvertType"
                    onChange={handleChange}
                    //options={controvertTypes}
                    options={controvertTypes.map(part => ({
                      label: part.description,
                      //value: part.value
                      value: { id: part.id, code: part.code, description: part.description }
                    }))}
                    placeholder="---Select One---"
                    disabled={!formData.isControvertEnabled}
                    filter
                    className={`select-dropdown-ct ${errors.controvertType ? 'p-invalid' : ''}`}
                  />
                  {errors.controvertType && (
                    <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                      {errors.controvertType}
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

              <h1 className="custom-h1 header" ref={headerRef}>
                <input autoComplete="off"
                  type="checkbox"
                  checked={formData.isMedicalInjuryEnabled}
                  disabled={formData.sectionB || formData.isControvertEnabled}
                  onChange={() => {
                    setFormData((prev) => ({
                      ...prev,
                      isMedicalInjuryEnabled: !formData.isMedicalInjuryEnabled,
                      controverted: formData.isMedicalInjuryEnabled ? false : prev.controverted,
                    }));
                  }}
                  // onChange={() => {
                  //   setFormData((prev) => ({
                  //     ...prev,
                  //     isMedicalInjuryEnabled: !prev.isMedicalInjuryEnabled,
                  //     controverted: prev.isMedicalInjuryEnabled ? false : prev.controverted
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
                  name="controverted"
                  checked={formData.controverted}
                  onChange={() => setFormData((prev) => ({ ...prev, controverted: !prev.controverted }))}
                  disabled={!formData.isMedicalInjuryEnabled}
                  ref={getFieldRef('convertType')}
                  className={`large-checkbox ${errors.convertType ? 'p-invalid' : ''} me-1`}
                />

                <label className="custom-label">No indemnity benefits are due and/or have NOT been controverted.</label>
              </div>

              {errors.controverted && (
                <div className="error-message" style={{ fontSize: '12px', marginTop: '5px', marginLeft: '20px' }}>
                  {errors.controverted}
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
                <span className="pi pi-cloud-upload" style={{ fontSize: '1.5rem' }}></span>  Choose File
              </label>
              <div className="card table-responsive mt-2">
                <DataTable value={documents} paginator rows={5} className="datatable custom-label custom-datatable responsive-datatable"
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
                  <iframe src={fileUrl} style={{ width: '1000px', height: '800px' }} title="Document Viewer" />
                )}
                {/* {fileUrl && (
                  <ReactFileViewer fileType={fileUrl.split('.').pop()} filePath={fileUrl} onError={e => console.log(e)} />
                )} */}
              </Dialog>

            </div>
          )}
          {activeTab === 'tab9' && (
            <div className="card">
              <div className="form-section flex-fill mb-0">
                <div className="form-group row mb-0 mt-3">
                  <h1 className="custom-h1 header" style={{ marginTop: '5px' }}>Claimant Information</h1>
                  <div className="row">
                    <div className="col-md-3 mb-2">
                      <label className=" col-form-label custom-label">First Name:</label>
                      <span className='custom-span'>{formData.claimant.firstName || ' '}</span>
                    </div>

                    <div className="col-md-2 mb-2">
                      <label className=" col-form-label custom-label">Last Name:</label>
                      <span className='custom-span'>{formData.claimant.lastName || ' '}</span>
                    </div>

                    <div className="col-md-2 mb-2">
                      <label className=" col-form-label custom-label">M.I.:</label>
                      <span className='custom-span'>{formData.claimant.middleInitial || ' '}</span>
                    </div>

                    <div className="col-md-1 mb-2">
                      <label className=" col-form-label custom-label">Gender:</label>
                      <span className='custom-span'>{formData.claimant.gender || ' '}</span>
                    </div>

                    <div className="col-md-4 mb-2">
                      <label className=" col-form-label custom-label">Birthdate:</label>
                      <span className='custom-span'>{formData.claimant.dateOfBirth
                        ? `${new Date(formData.claimant.dateOfBirth).getMonth() + 1}`.padStart(2, '0') + '-' +
                        `${new Date(formData.claimant.dateOfBirth).getDate()}`.padStart(2, '0') + '-' +
                        new Date(formData.claimant.dateOfBirth).getFullYear()
                        : ' '}</span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3 mb-2">
                      <label className=" col-form-label custom-label">Mailing Address 1:</label>
                      <span className='custom-span'>{formData.claimant.address1 || ' '}</span>
                    </div>
                    <div className="col-md-2 mb-2">
                      <label className=" col-form-label custom-label">Mailing Address 2:</label>
                      <span className='custom-span'>{formData.claimant.address2 || ' '}</span>
                    </div>
                    <div className="col-md-2 mb-2">
                      <label className=" col-form-label custom-label">City:</label>
                      <span className='custom-span'>{formData.claimant.city || ' '}</span>
                    </div>

                    <div className="col-md-1 mb-2">
                      <label className=" col-form-label custom-label">State:</label>
                      <span className='custom-span'>{formData.claimant.state || ' '}</span>
                    </div>
                    <div className="col-md-2 mb-2">
                      <label className=" col-form-label custom-label">Zip:</label>
                      <span className='custom-span'>{formData.claimant.zip || ' '}</span>
                    </div>

                    <div className="col-md-3 mb-2">
                      <label className=" col-form-label custom-label">Email:</label>
                      <span className='custom-span'>{formData.claimant.primaryEmail || ' '}</span>
                    </div>

                    <div className="col-md-3 mb-2">
                      <label className=" col-form-label custom-label">Phone:</label>
                      <span className='custom-span'>{formData.claimant.primaryPhone || ' '}</span>
                    </div>
                  </div>
                </div>
                <div className="form-group row mb-0">
                  <h1 className="custom-h1 header" style={{ marginTop: '5px' }}>Employment/Wage</h1>
                  <div className="d-flex flex-wrap">
                    <div className="col-md-3 mb-2">
                      <label className=" col-form-label custom-label">Hired Date:</label>
                      <span className='custom-span'>{formData.hiredDate ? formatDateForInput(formData.hiredDate) : ' '}</span>
                      {/* {formData.claimant.dateOfBirth ? formatDateForInput(formData.claimant.dateOfBirth) : ' '} */}
                    </div>
                    <div className="col-md-3 mb-2">
                      <label className=" col-form-label custom-label">Job Classified Code No:</label>
                      <span className='custom-span'>{formData.jobClssifiedCodeNo || ' '}</span>
                    </div>
                    <div className="col-md-3 mb-2">
                      <label className=" col-form-label custom-label">Insurer/Self Insurer File#:</label>
                      <span className='custom-span'>{formData.insurerFile || ' '}</span>
                    </div>
                    <div className="col-md-3 mb-2">
                      <label className=" col-form-label custom-label">Days Worked Per Week:</label>
                      <span className='custom-span'>{formData.daysWorkedPerWeek || ' '}</span>
                    </div>
                    <div className="col-md-3 mb-2">
                      <label className=" col-form-label custom-label">Wage Rate at time of Injury or Disease:</label>
                      <span className='custom-span'>{formData.wageRate || ' '}</span>
                    </div>
                    <div className="col-md-3 mb-2">
                      <label className=" col-form-label custom-label">Do you have any days Off?:</label>
                      <span className='custom-span'>{formData.daysOff === 'Y' ? 'Yes' : formData.daysOff === 'N' ? 'No' : ' '}</span>
                    </div>
                    <div className="col-md-4 mb-2">
                      <label className=" col-form-label custom-label">Wage Rate Frequency:</label>
                      <span className='custom-span'>{formData.wageRateFrequency || ' '}</span>
                    </div>
                  </div>
                </div>
                <div className="form-group row mb-0">
                  <h1 className="custom-h1 header" style={{ marginTop: '5px' }}>Injury/Illness</h1>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className=" col-form-label custom-label">NAICS Type:</label>
                      <span className='custom-span'>{formData.naicsTypes ? formData.naicsTypes.description : ' '}</span>
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className=" col-form-label custom-label">Date of Injury:</label>
                      <span className='custom-span'>{formData.dateOfInjury
                        ? `${new Date(formData.dateOfInjury).getMonth() + 1}`.padStart(2, '0') + '-' +
                        `${new Date(formData.dateOfInjury).getDate()}`.padStart(2, '0') + '-' +
                        new Date(formData.dateOfInjury).getFullYear()
                        : ' '}</span>
                      {/* <span className='custom-span'>{formData.dateOfInjury ? formatDateForInput(formData.dateOfInjury) : ' '}</span> */}
                    </div>

                    <div className="col-md-2 mb-3">
                      <label className=" col-form-label custom-label">Time of Injury:</label>
                      <span className='custom-span'>{formData.timeOfInjury || ' '}</span>
                    </div>

                    <div className="col-md-2 mb-3">
                      <label className=" col-form-label custom-label">County of Injury:</label>
                      <span className='custom-span'>{formData.countyOfInjury.description || ' '}</span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className=" col-form-label custom-label">Date Employer had Knowledge of Injury:</label>
                      <span className='custom-span'>{formData.dateEmployerKnowledge ? formatDateForInput(formData.dateEmployerKnowledge) : ' '}</span>
                      {/* <span className='custom-span'>{formData.dateEmployerKnowledge ? formatDateForInput(formData.dateEmployerKnowledge) : ' '}</span> */}
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className=" col-form-label custom-label">First Date Employee Failed to Work:</label>
                      {/* <span className='custom-span'>{formData.firstDateFailed ? formatDateForInput(formData.firstDateFailed) : ' '}</span> */}
                      <span className='custom-span'>{formData.firstDateFailed ? formatDateForInput(formData.firstDateFailed) : ' '}</span>
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className=" col-form-label custom-label">Did Employee Receive Full Pay on Date of Injury:</label>
                      <span className='custom-span'>{formData.receivedFullPay ? formData.receivedFullPay : ' '}</span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className=" col-form-label custom-label">Did Injury/Illness Occur on Employer's Premises:</label>
                      <span className='custom-span'>{formData.injuredInEmpPermises ? formData.injuredInEmpPermises : ' '}</span>
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className=" col-form-label custom-label">Type of Injury/Illness:</label>
                      <span className='custom-span'>{formData.typeOfInjury ? formData.typeOfInjury.description : ' '}</span>
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className=" col-form-label custom-label">How Injury or Illness / Abnormal Health Condition Occurred:</label>
                      {/* <span className='custom-span'>{formData.otherInjuryCause || ' '}</span> */}
                      <span className='custom-span'>
                        {formData.otherInjuryCause && formData.injuryCauseTypes
                          ? `${formData.otherInjuryCause}, ${formData.injuryCauseTypes.description}`
                          : formData.otherInjuryCause || formData.injuryCauseTypes?.description || ' '}
                      </span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label className=" col-form-label custom-label">Body Part Affected:</label>
                      {/* <span className='custom-span'>{formData.bodyPartAffected ? formData.bodyPartAffected : ' '}</span> */}
                      <span className='custom-span'>
                        {Array.isArray(formData.bodyPartAffected)
                          ? formData.bodyPartAffected.join(', ')
                          : formData.bodyPartAffected || ' '}
                      </span>
                    </div>
                  </div>
                  <hr></hr>
                </div>
                <div className="form-group row mb-0">
                  <div className="flex-fill">
                    <div className="form-group row mb-1 mt-2">
                      <div className="col-md-3">
                        <label htmlFor="tPhysicianName" className=" col-form-label custom-label">Treating Physician Name:</label>
                        <span className='custom-span' id="tPhysicianName">{formData.tPhysicianName || ' '}</span>
                      </div>
                      <div className="col-md-3">
                        <label htmlFor="tPhysicianAddress1" className=" col-form-label custom-label">Treating Physician Address 1:</label>
                        <span className='custom-span' id="tPhysicianAddress1">{formData.tPhysicianAddress1 || ' '}</span>
                      </div>
                      <div className="col-md-3">
                        <label htmlFor="tPhysicianAddress2" className=" col-form-label custom-label">Treating Physician Address 2:</label>
                        <span className='custom-span' id="tPhysicianAddress2">{formData.tPhysicianAddress2 || ' '}</span>
                      </div>
                      <div className="col-md-2">
                        <label htmlFor="tPhysicianCity" className=" col-form-label custom-label">Treating Physician City:</label>
                        <span className='custom-span' id="tPhysicianCity">{formData.tPhysicianCity || ' '}</span>
                      </div>

                    </div>

                    <div className="form-group row mb-1 mt-3">
                      <div className="col-md-3">
                        <label htmlFor="selectedPhysicianState" className=" col-form-label custom-label">State:</label>
                        <span className='custom-span' id="selectedPhysicianState">{formData.selectedPhysicianState || 'GA'}</span>
                      </div>
                      <div className="col-md-2">
                        <label htmlFor="tPhysicianZIP" className=" col-form-label custom-label">Treating Physician ZIP:</label>
                        <span className='custom-span' id="tPhysicianZIP">{formData.tPhysicianZIP || ' '}</span>
                      </div>
                      <div className="col-md-1">
                        <label htmlFor="tPhysicianZIPExt" className=" col-form-label custom-label">Ext:</label>
                        <span className='custom-span' id="tPhysicianZIPExt">{formData.tPhysicianZIPExt || ' '}</span>
                      </div>
                      <div className="col-md-2">
                        <label htmlFor="tPhysicianPhone" className=" col-form-label custom-label">Treating Physician Phone:</label>
                        <span className='custom-span' id="tPhysicianPhone">{formData.tPhysicianPhone || ' '}</span>
                      </div>
                      <div className="col-md-1">
                        <label htmlFor="tPhysicianPhoneExt" className=" col-form-label custom-label">Ext:</label>
                        <span className='custom-span' id="tPhysicianPhoneExt">{formData.tPhysicianPhoneExt || ' '}</span>
                      </div>
                      <div className="col-md-2">
                        <label htmlFor="treatmentTypes" className=" col-form-label custom-label">Initial Treatment:</label>
                        <span className='custom-span' id="treatmentTypes">{formData.treatmentTypes?.description || ' '}</span>
                      </div>

                    </div>
                  </div>
                  <div className="flex-fill">
                    <div className="form-group row mb-1 mt-2">
                      <div className="col-md-3">
                        <label htmlFor="treatingFacility" className=" col-form-label custom-label">Hospital/Treating Facility:</label>
                        <span className='custom-span' id="treatingFacility">{formData.treatingFacility || ' '}</span>
                      </div>
                      <div className="col-md-3">
                        <label htmlFor="treatingFacilityAddress1" className=" col-form-label custom-label">Hospital/Treating Facility Address 1:</label>
                        <span className='custom-span' id="treatingFacilityAddress1">{formData.treatingFacilityAddress1 || ' '}</span>
                      </div>
                      <div className="col-md-3">
                        <label htmlFor="treatingFacilityAddress2" className=" col-form-label custom-label">Hospital/Treating Facility Address 2:</label>
                        <span className='custom-span' id="treatingFacilityAddress2">{formData.treatingFacilityAddress2 || ' '}</span>
                      </div>
                      <div className="col-md-2">
                        <label htmlFor="treatingFacilityCity" className=" col-form-label custom-label">Hospital/Treating Facility City:</label>
                        <span className='custom-span' id="treatingFacilityCity">{formData.treatingFacilityCity || ' '}</span>
                      </div>

                    </div>

                    <div className="form-group row mb-1 mt-2">
                      <div className="col-md-3">
                        <label htmlFor="selectedHospitalState" className=" col-form-label custom-label">State:</label>
                        <span className='custom-span' id="selectedHospitalState">{formData.selectedHospitalState || 'GA'}</span>
                      </div>
                      <div className="col-md-2">
                        <label htmlFor="treatingFacilityZIP" className=" col-form-label custom-label">Hospital/Treating Facility ZIP:</label>
                        <span className='custom-span' id="treatingFacilityZIP">{formData.treatingFacilityZIP || ' '}</span>
                      </div>
                      <div className="col-md-1">
                        <label htmlFor="treatingFacilityZIPExt" className=" col-form-label custom-label">Ext:</label>
                        <span className='custom-span' id="treatingFacilityZIPExt">{formData.treatingFacilityZIPExt || ' '}</span>
                      </div>
                      <div className="col-md-2">
                        <label htmlFor="hospitalPhone" className=" col-form-label custom-label">Hospital Phone:</label>
                        <span className='custom-span' id="hospitalPhone">{formData.hospitalPhone || ' '}</span>
                      </div>
                      <div className="col-md-1">
                        <label htmlFor="hospitalPhoneExt" className=" col-form-label custom-label">Ext:</label>
                        <span className='custom-span' id="hospitalPhoneExt">{formData.hospitalPhoneExt || ' '}</span>
                      </div>
                    </div>
                  </div>
                  <hr></hr>
                  <div className="form-group row mb-1">
                    <div className="col-md-3">
                      <label htmlFor="RtwDate" className=" col-form-label custom-label">If Returned to Work, Give Date:</label>
                      {/* <span className='custom-span' id="RtwDate">{formData.RtwDate || ' '}</span> */}
                      <span className='custom-span'>{formData.RtwDate ? formatDateForInput(formData.RtwDate) : ' '}</span>
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="ReturnedWagePerWeek" className=" col-form-label custom-label">Returned at what wage per week:</label>
                      <span className='custom-span' id="ReturnedWagePerWeek">{formData.ReturnedWagePerWeek || ' '}</span>
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="FatalDeathDate" className=" col-form-label custom-label">If Fatal, Enter Complete Date of Death:</label>
                      {/* <span className='custom-span' id="FatalDeathDate">{formData.FatalDeathDate || ' '}</span> */}
                      <span className='custom-span'>{formData.FatalDeathDate ? formatDateForInput(formData.FatalDeathDate) : ' '}</span>

                    </div>
                  </div>
                  <hr style={{ height: '1px', backgroundColor: 'black', border: 'none', margin: '0px 0' }} />
                  <div className="form-group row mb-2 mt-1">
                    <div className="col-md-3">
                      <label htmlFor="reportPreparedBy" className=" col-form-label custom-label">Report Prepared By (Print or Type):</label>
                      <span className='custom-span' id="reportPreparedBy">{formData.reportPreparedBy || ' '}</span>
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="telePhoneNumber" className=" col-form-label custom-label">Telephone Number:</label>
                      <span className='custom-span' id="telePhoneNumber">{formData.telePhoneNumber || ' '}</span>
                    </div>
                    <div className="col-md-2 d-flex align-items-center">
                      <label htmlFor="telePhoneExt" className=" col-form-label custom-label">Ext:</label>
                      <span className='custom-span' id="telePhoneExt">{formData.telePhoneExt || ' '}</span>
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="DateOfReport" className=" col-form-label custom-label">Date of Report:</label>
                      {/* <span className='custom-span' id="DateOfReport">{formData.DateOfReport || ' '}</span> */}
                      <span className='custom-span'>{formData.DateOfReport ? formatDateForInput(formData.DateOfReport) : ' '}</span>
                    </div>
                  </div>
                </div>
                {formData.sectionB && (
                  <div className="form-group row mb-0">
                    <h1 className="custom-h1 header" style={{ marginTop: '5px' }}>B. INCOME BENEFITS Form WC-6 must be filed if weekly benefit is less than maximum</h1>
                    <div className="col-md-5">
                      <label className=" col-form-label custom-label">
                        Check which benefits are being paid:
                      </label>
                      <span className='custom-span ml-3' id="incomeBenefits">
                        {/* {formData?.incomeBenefits?.label || formData?.incomeBenefits?.value || ' '} */}
                        {formData.incomeBenefits === 'Y' ? 'Income benefits ' :
                          formData.incomeBenefits === 'N' ? 'Salary in Lieu ' : ' '}
                        {/* {formData.incomeBenefits?.label || formData.incomeBenefits?.value || ' '} */}
                      </span>
                    </div>
                    {formData.incomeBenefits === 'Y' && (
                      <div className="form-group Income-Benefits-Form mt-2">
                        <div className="d-flex flex-wrap">
                          <div className="col-md-3 ">
                            <label className=" col-form-label custom-label">
                              Previously Medical Only:
                            </label>
                            <span className='custom-span' id="previouslyMedicalOnly">{formData.previouslyMedicalOnly === 'Y' ? 'Yes' : 'No'}</span>
                          </div>
                          <div className="col-md-3 ">
                            <label className=" col-form-label custom-label">
                              Average Weekly Wage:
                            </label>
                            <span className='custom-span' id="averageWeeklyWage">{formData.averageWeeklyWage || ' '}</span>
                          </div>

                          <div className="col-md-3">
                            <label className=" col-form-label custom-label">
                              Weekly Benefit:
                            </label>
                            <span className='custom-span' id="weeklyBenefit">{formData.weeklyBenefit || ' '}</span>
                          </div>

                          <div className="col-md-3 ">
                            <label className=" col-form-label custom-label">
                              Date of Disability:
                            </label>
                            {/* <span className='custom-span' id="dateOfDisability">{formData.dateOfDisability || ' '}</span> */}
                            <span className='custom-span'>{formData.dateOfDisability ? formatDateForInput(formData.dateOfDisability) : ' '}</span>
                          </div>
                        </div>

                        <div className="d-flex flex-wrap mt-3">
                          {/* Row 3 */}
                          <div className="col-md-3 ">
                            <label className=" col-form-label custom-label">
                              Date Of First Payment:
                            </label>
                            <span className='custom-span'>{formData.dateOfFirstPayment ? formatDateForInput(formData.dateOfFirstPayment) : ' '}</span>
                            {/* <span className='custom-span' id="dateOfFirstPayment">{formData.dateOfFirstPayment || ' '}</span> */}
                          </div>

                          <div className="col-md-3 ">
                            <label className=" col-form-label custom-label">
                              Compensation Paid:
                            </label>
                            <span className='custom-span' id="compensationPaid">{formData.compensationPaid || ' '}</span>
                          </div>

                          <div className="col-md-3">
                            <label className=" col-form-label custom-label">
                              Penalty Paid:
                            </label>
                            <span className='custom-span' id="penalityPaid">{formData.penalityPaid || ' '}</span>
                          </div>

                          <div className="col-md-3 ">
                            <label className=" col-form-label custom-label">
                              Benefits Payable From Date:
                            </label>
                            <span className='custom-span'>{formData.dateBenefitsPayableFrom ? formatDateForInput(formData.dateBenefitsPayableFrom) : ' '}</span>
                            {/* <span className='custom-span' id="dateBenefitsPayableFrom">{formData.dateBenefitsPayableFrom || ' '}</span> */}
                          </div>
                        </div>

                        <div className="d-flex flex-wrap mt-3">
                          {/* Row 4 */}
                          <div className="col-md-3 ">
                            <label className=" col-form-label select-dropdown">
                              Benefits Payable For:
                            </label>
                            <span className='custom-span' id="disabilityTypes">{formData.disabilityTypes || ' '}</span>
                          </div>

                          <div className="col-md-3 ">
                            <label className=" col-form-label custom-label">
                              Pay Benefit Until:
                            </label>
                            {/* <span className='custom-span' id="PayBenefitUntil">{formData.PayBenefitUntil || ' '}</span> */}
                            <span className='custom-span'>{formData.PayBenefitUntil ? formatDateForInput(formData.PayBenefitUntil) : ' '}</span>

                          </div>
                        </div>

                        {/* Additional fields for permanent disability (if applicable) */}
                        {formData.disabilityTypes?.trim().toLowerCase() === 'permanen' && (
                          <div className="d-flex flex-wrap mt-3">
                            <div className="col-md-3">
                              <label className=" col-form-label custom-label">
                                Disability %:
                              </label>
                              <span className='custom-span' id="disabilityPercentage">{formData.disabilityPercentage || ' '}</span>
                            </div>

                            <div className="col-md-3">
                              <label className=" col-form-label custom-label">
                                Disabled Body Part:
                              </label>
                              <span className='custom-span' id="disabledBodyPart">{formData.disabledBodyPart || ' '}</span>
                            </div>

                            <div className="col-md-3 ">
                              <label className=" col-form-label custom-label">
                                Duration of Disability:
                              </label>
                              <span className='custom-span' id="durationOfDisability">{formData.durationOfDisability || ' '}</span>
                              <span style={{ marginLeft: '5px' }}>(Weeks)</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {formData.incomeBenefits === 'N' && (
                      <div className="d-flex flex-wrap">
                        <div className="form-section flex-fill">
                          <div className="form-group row mb-1">
                            <div className="col-md-3">
                              <label className=" col-form-label custom-label">Previously Medical Only:</label>
                              <span className='custom-span' id="previouslyMedicalOnly">{formData.previouslyMedicalOnly === 'Y' ? 'Yes' : formData.previouslyMedicalOnly === 'N' ? 'No' : 'None'}</span>
                            </div>

                            <div className="col-md-3">
                              <label className=" col-form-label custom-label">Average Weekly Wage Amount ($):</label>
                              <span className='custom-span' id="averageWeeklyWageAmount">{formData.averageWeeklyWageAmount || ' '}</span>
                            </div>

                            <div className="col-md-3">
                              <label className=" col-form-label custom-label">Weekly Benefit Amount ($):</label>
                              <span className='custom-span' id="weeklyBenefitAmount">{formData.weeklyBenefitAmount || ' '}</span>
                            </div>

                            <div className="col-md-3">
                              <label className=" col-form-label custom-label">Date of Disability:</label>
                              <span className='custom-span'>{formData.dateOfDisability ? formatDateForInput(formData.dateOfDisability) : ' '}</span>

                              {/* <span className='custom-span' id="dateOfDisability">{formData.dateOfDisability || ' '}</span> */}
                            </div>
                          </div>

                          <div className="form-group row mb-2 mt-2">
                            <div className="col-md-3">
                              <label className=" col-form-label custom-label">
                                Date Salary Paid:
                              </label>
                              <span className='custom-span'>{formData.dateSalaryPaid ? formatDateForInput(formData.dateSalaryPaid) : ' '}</span>

                              {/* <span className='custom-span' id="dateSalaryPaid">{formData.dateSalaryPaid || ' '}</span> */}
                            </div>

                            <div className="col-md-3">
                              <label className=" col-form-label custom-label">
                                Benefits Payable From Date:
                              </label>
                              {/* <span className='custom-span' id="benefitsPayableFromDate">{formData.benefitsPayableFromDate || ' '}</span> */}
                              <span className='custom-span'>{formData.benefitsPayableFromDate ? formatDateForInput(formData.benefitsPayableFromDate) : ' '}</span>

                            </div>

                            <div className="col-md-3">
                              <label className=" col-form-label custom-label">
                                Benefits Payable For:
                                <span style={{ color: 'red' }}>*</span>
                              </label>
                              <span className='custom-span' id="benefitsPayableFor">{formData.benefitsPayableFor?.label || ' '}</span>
                            </div>

                            <div className="col-md-3">
                              <label className=" col-form-label custom-label">Pay Benefit Until:</label>
                              <span className='custom-span'>{formData.payBenefitUntil ? formatDateForInput(formData.payBenefitUntil) : ' '}</span>

                              {/* <span className='custom-span' id="payBenefitUntil">{formData.payBenefitUntil || ' '}</span> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {formData.isControvertEnabled && (
                  <div className="form-group row mb-0 mt-3">
                    <h1 className="custom-h1 header" style={{ marginTop: '5px' }}>
                      C. Notice To Convert Payment Of Compensation
                    </h1>

                    <div className="row mb-3"> {/* Wrap first section in a row */}
                      <div className="col-md-12">
                        <label className=" col-form-label custom-label">Controvert Type:</label>
                        <span className='custom-span' id="controvertTypes">
                          {formData.controvertType ? formData.controvertType.description : '' || ' '}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-3"> {/* Wrap second section in a row */}
                      <div className="col-md-12">
                        <label className=" col-form-label custom-label">Reason Benefits will not be paid:</label>
                        <span className='custom-span' id="BenifitsNPReasons">{formData.BenifitsNPReasons || ' '}</span>
                      </div>
                    </div>
                  </div>
                )}
                {formData.isMedicalInjuryEnabled && (
                  <div className="form-group row mb-0 mt-3">
                    <h1 className="custom-h1 header" style={{ marginTop: '5px' }}>D. Medical Only Injury</h1>
                    <div className="col-md-6" style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        autoComplete="off"
                        type="checkbox"
                        name="controverted"
                        checked={formData.controverted}
                        onChange={() => setFormData((prev) => ({ ...prev, controverted: !prev.controverted }))}
                        disabled={!formData.isMedicalInjuryEnabled}
                        ref={getFieldRef('convertType')}
                        className={`large-checkbox ${errors.convertType ? 'p-invalid' : ''} style={{ marginRight: '8px' }}`}
                      />
                      <label style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                        No indemnity benefits are due and/or have NOT been controverted.
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="container card-content">
          <h1 className="custom-h1 header mt-2">Submitter Information</h1>
          <div className="row">
            <div className="col-md-6 col-12 d-flex align-items-center mb-2">
              <label className="custom-label me-2">
                Insurer/Self-Insurer: Type or Print Name of Person Filing Form:
              </label>
              <span className="value">DAVID IMAHARA</span>
            </div>
            <div className="col-md-6 col-12 d-flex align-items-center mb-2">
              <label className="custom-label me-2">Date:</label>
              <span className="value">11/09/2024</span>
            </div>
            <div className="col-md-6 col-12 d-flex align-items-center mb-2">
              <label className="custom-label me-2">Phone Number:</label>
              <span className="value">(404) 463-1999</span>
              <label className="custom-label ms-3 me-2">Ext:</label>
              <span className="value">ext</span>
            </div>
            <div className="col-md-6 col-12 d-flex align-items-center mb-2">
              <label className="custom-label me-2">E-mail:</label>
              <span className="value">CAMPBELLN@SBWC.GA.GOV</span>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12 d-flex justify-content-center flex-wrap flex-md-nowrap">
            <div className="mx-1">
              <button className="btn  btn-lg custom-btn"><i className="pi pi-refresh" ></i> Reset</button>
            </div>
            <div className="mx-1">
              <button className="btn btn-lg custom-btn"><i className="pi pi-save" ></i> Save</button>
            </div>
            <div className="mx-1">
              <button className="btn  btn-lg custom-btn"><i className="pi pi-check" ></i> Submit</button>
            </div>
            <div className="mx-1">
              <button className="btn  btn-lg custom-btn"><i className="pi pi-times" style={{fontSize:'0.9rem'}}></i> Cancel</button>
            </div>
          </div>
        </div>
      </form>
    </div >
  );
};

export default Wc1FormComponent;
