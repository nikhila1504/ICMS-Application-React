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
import NaicsTypeService from "../services/naics.type.service";
import InjuryTypeService from "../services/injury.type.service";
import InjuryCauseTypeService from "../services/injury.cause.type.service";
import { MDBInput, MDBDropdown, MDBDropdownMenu, MDBDropdownItem, MDBDropdownToggle, MDBRadio } from 'mdb-react-ui-kit';
import { FloatLabel } from 'primereact/floatlabel';
const Wc1Component = () => {
    const [naicsTypes, setNaicsTypes] = useState([]);
    const [injuryTypes, setInjuryTypes] = useState([]);
    const [injuryCauseTypes, setInjuryCauseTypes] = useState([]);
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
                    className=" btn btn-outline-info  btn-sm mx-1"
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
                    className="btn btn-primary mx-2"
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
                console.log("injuryTypes", injuryTypes);
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
        naicsTypes: [],
        injuryTypes: [],
        injuryCauseTypes: [],
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
        averageWeeklyWage: '', weeklyBenefitAmount: '', averageWeeklyWageAmount: ''
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
    // const injuryTypes = [
    //   { label: 'AIDS', value: 'AIDS' },
    //   { label: 'Adverse reaction to a vaccination or inoculation', value: 'Adverse reaction to a vaccination or inoculation' },
    //   { label: 'Cancer', value: 'Cancer' },
    // ]
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
        } else {
            const numericFields = ['ReturnedWagePerWeek', 'averageWeeklyWage', 'weeklyBenefitAmount', 'averageWeeklyWageAmount', 'CompensationPaid', 'penalityPaid', 'weeklyBenifit'];

            if (numericFields.includes(name)) {
                if (/^\d*\.?\d*$/.test(value) || value === '') {
                    setFormData((prevData) => ({
                        ...prevData,
                        [name]: value,
                    }));
                }
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
                    <div className="form-section flex-fill mb-0">
                        <div className="form-group row mb-0">
                            <div className="col-md-4 mb-2">
                                <MDBInput
                                    //label="First Name"
                                    label={<>First Name<span style={{ color: 'red' }}>*</span> </>}
                                    type="text"
                                    ref={getFieldRef('claimant.firstName')}
                                    className={`custom-border border-0 ${errors.firstName ? 'p-invalid' : ''}`}
                                    id="firstName"
                                    name="firstName"
                                    value={formData.claimant.firstName || ''}
                                    onChange={handleChange}
                                    required
                                    disabled
                                />
                                {errors.firstName && (
                                    <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                                        {errors.firstName}
                                    </div>
                                )}
                            </div>
                            <div className="col-md-4 mb-2">
                                <MDBInput
                                    //label="Last Name"
                                    label={<>Last Name<span style={{ color: 'red' }}>*</span> </>}
                                    type="text"
                                    ref={getFieldRef('claimant.lastName')}
                                    className={`custom-border ${errors.lastName ? 'p-invalid' : ''}`}
                                    id="lastName"
                                    name="lastName"
                                    value={formData.claimant.lastName || ''}
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
                            <div className="col-md-4 mb-2">
                                <MDBInput
                                    label="M.I."
                                    type="text"
                                    className="custom-border"
                                    id="middleIntial"
                                    name="claimant.middleIntial"
                                    value={formData.claimant.middleIntial || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-section flex-fill">
                        <div className="form-group row ">
                            <div className="col-md-4 mb-2">
                                <MDBInput
                                    label="Birthdate"
                                    type="date"
                                    className="custom-border"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    value={formatDateForInput(formData.claimant.dateOfBirth) || ''}
                                    onChange={handleChange}
                                    onClick={(e) => e.target.showPicker()}
                                    disabled
                                />
                            </div>
                            <div className="col-md-5 mb-2">
                                <label className="custom-label">Gender: <span style={{ color: 'red' }}>*</span></label>
                                <div className="custom-radio">
                                    <div className="form-check form-check-inline">
                                        <input
                                            className={`form-check-input ${errors.gender ? 'p-invalid' : ''}`}
                                            type="radio"
                                            name="gender"
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
                                            name="gender"
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
                                            name="gender"
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
                            <div className="col-md-3 mb-2">
                                <label className="custom-label mb-0">Out of Country Address:</label>
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
                    </div>
                    <div className="form-section flex-fill ">
                        <div className="form-group row">
                            <div className="col-md-4 mb-2">
                                <MDBInput
                                    //label="Mailing Address 1"
                                    label={<>Mailing Address 1<span style={{ color: 'red' }}>*</span> </>}
                                    type="text"
                                    ref={getFieldRef('claimant.address1')}
                                    className={`custom-border ${errors['claimant.address1'] ? 'p-invalid' : ''}`}
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
                            <div className="col-md-4 mb-2">
                                <MDBInput
                                    label="Mailing Address 2"
                                    type="text"
                                    className="custom-border"
                                    id="address2"
                                    name="claimant.address2"
                                    value={formData.claimant.address2 || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-4 mb-2">
                                <MDBInput
                                    //label="City"
                                    label={<>City<span style={{ color: 'red' }}>*</span> </>}
                                    type="text"
                                    ref={getFieldRef('claimant.city')}
                                    className={`custom-border ${errors['claimant.city'] ? 'p-invalid' : ''}`}
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

                        <div className="form-group row">
                            <div className="col-md-4 mb-2">
                                <MDBInput
                                    //label="State"
                                    label={<>State<span style={{ color: 'red' }}>*</span> </>}
                                    type="text"
                                    ref={getFieldRef('claimant.state')}
                                    className={`custom-border ${errors['claimant.state'] ? 'p-invalid' : ''}`}
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
                            <div className="col-md-4 mb-2">
                                <MDBInput
                                    //label="Zip"
                                    label={<>Zip<span style={{ color: 'red' }}>*</span> </>}
                                    type="text"
                                    ref={getFieldRef('claimant.zip')}
                                    className={`custom-border ${errors['claimant.zip'] ? 'p-invalid' : ''}`}
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
                            <div className="col-md-4 mb-2">
                                <MDBInput
                                    label="Employee E-mail"
                                    type="text"
                                    className="custom-border"
                                    id="primaryEmail"
                                    name="claimant.primaryEmail"
                                    value={formData.claimant.primaryEmail || ''}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="form-group row">
                            <div className="col-md-4 mb-2">
                                <MDBInput
                                    label="Phone Number"
                                    type="text"
                                    className="custom-border"
                                    id="primaryPhone"
                                    name="claimant.primaryPhone"
                                    value={formData.claimant.primaryPhone || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
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
                    <h1 className="custom-h1 header">Employment/Wage</h1>
                    <div className="d-flex flex-wrap">
                        {/* First Row */}
                        <div className="form-section flex-fill">
                            <div className="form-group row mb-3">
                                <div className="col-md-12">
                                    <MDBInput
                                        label="Hired Date"
                                        autoComplete="off"
                                        type="date"
                                        id="hiredDate"
                                        name="hiredDate"
                                        value={formData.hiredDate}
                                        onChange={handleChange}
                                        floating
                                        className="custom-input"
                                        style={{ borderColor: 'blue', width: '100%' }}
                                    />
                                </div>
                            </div>
                            <div className="form-group row mb-3">
                                <div className="col-md-12">
                                    <MDBInput
                                        autoComplete="off"
                                        type="text"
                                        id="jobClssifiedCodeNo"
                                        name="jobClssifiedCodeNo"
                                        label="Job Classified Code No"
                                        value={formData.jobClssifiedCodeNo}
                                        onChange={handleChange}
                                        floating
                                        className="custom-input"
                                        style={{ borderColor: 'blue', width: '100%' }}
                                    />
                                </div>
                            </div>
                            <div className="form-group row mb-3">
                                <div className="col-md-12">
                                    <MDBInput
                                        autoComplete="off"
                                        type="text"
                                        id="insurerFile"
                                        name="insurerFile"
                                        label="Insurer/Self Insurer File#"
                                        value={formData.insurerFile}
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
                            <div className="form-group row mb-2">
                                <div className="col-md-12">
                                    <MDBInput
                                        autoComplete="off"
                                        type="text"
                                        ref={getFieldRef('NoOfDays')}
                                        label={<>Number of Days Worked Per Week<span style={{ color: 'red' }}>*</span></>}
                                        id="NoOfDays"
                                        name="NoOfDays"
                                        value={formData.NoOfDays}
                                        onChange={handleChange}
                                        floating
                                        required
                                        className={`custom-input ${errors.NoOfDays ? 'p-invalid' : ''}`}
                                        style={{ borderColor: 'blue', width: '100%' }}
                                    />
                                    {errors.NoOfDays && (
                                        <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                                            {errors.NoOfDays}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="form-group row mb-2">
                                <div className="col-md-12">
                                    <MDBInput
                                        autoComplete="off"
                                        type="text"
                                        id="wageRate"
                                        name="wageRate"
                                        label="Wage rate at time of Injury or Disease:"
                                        value={formData.wageRate}
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
                                            value="Yes"
                                            checked={formData.daysOff === 'Yes'}
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
                                            value="No"
                                            checked={formData.daysOff === 'No'}
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

                        {/* Fourth Row */}
                        <div className="form-section">
                            <div className="form-group row mb-2 custom-radio"> {/* Reduced mb-3 to mb-2 */}
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
                <div ref={headerRef} className="collapsible-container" onMouseEnter={() => setIsActive(true)} onMouseLeave={() => setIsActive(false)}>
                    <h1 className="custom-h1 header" style={{ cursor: 'pointer' }} onClick={() => setIsActive(prev => !prev)} tabIndex={0}>
                        Injury/Illness and Medical
                    </h1>
                    <div className={`collapsible-content ${isActive ? 'active' : ''}`}>

                        {/* First Row: NAICS Code, Date of Injury, Time of Injury, County of Injury */}
                        <div className="row">
                            <div className="col-md-3 mb-3 mt-4">
                                <div className="p-fluid">
                                    <FloatLabel className="w-full md:w-14rem">
                                        <Dropdown
                                            value={formData.naicsTypes}
                                            name="naicsTypes"
                                            onChange={handleChange}
                                            options={naicsTypes.map(type => ({
                                                label: type.description,
                                                value: type.value
                                            }))}
                                            placeholder="---Select One---"
                                            filter
                                            className="select-dropdown custom-input"
                                            label="NAICS Type"
                                        />
                                        <label htmlFor="naicsTypes">NAICS Code:</label>
                                    </FloatLabel>
                                </div>
                            </div>

                            <div className="col-md-3 mb-3 mt-4">
                                <MDBInput
                                    type="date"
                                    label="Date of Injury"
                                    id="dateOfInjury"
                                    name="dateOfInjury"
                                    value={formatDateForInput(formData.dateOfInjury)}
                                    onChange={handleChange}
                                    className="custom-input"
                                    required
                                    disabled
                                    invalid={errors.dateOfInjury}
                                    floating
                                />
                                {errors.dateOfInjury && (
                                    <div className="invalid-feedback">{errors.dateOfInjury}</div>
                                )}
                            </div>

                            <div className="col-md-3 mb-3 mt-4">
                                <MDBInput
                                    type="time"
                                    label="Time of Injury"
                                    className="custom-input"
                                    name="timeOfInjury"
                                    value={formData.timeOfInjury}
                                    onChange={handleChange}
                                    floating
                                />
                            </div>

                            <div className="col-md-3 mb-3 mt-4">
                                <MDBInput
                                    type="text"
                                    label="County Of Injury"
                                    id="countyOfInjury"
                                    className="custom-input"
                                    name="countyOfInjury.description"
                                    value={formData.countyOfInjury.description}
                                    onChange={handleChange}
                                    disabled
                                    invalid={errors['countyOfInjury.description']}
                                    floating
                                />
                                {errors['countyOfInjury.description'] && (
                                    <div className="invalid-feedback">{errors['countyOfInjury.description']}</div>
                                )}
                            </div>
                        </div>

                        {/* Second Row: Date Employer Knowledge, First Date Employee Failed to Work, Full Pay on Date of Injury, Occurred on Premises */}
                        <div className="row">
                            <div className="col-md-3 mb-3 mt-4">
                                <MDBInput
                                    type="date"
                                    label="Date Employer had Knowledge of Injury"
                                    className="custom-input"
                                    name="dateEmployerKnowledge"
                                    value={formData.dateEmployerKnowledge}
                                    onChange={handleChange}
                                    floating
                                />
                            </div>

                            <div className="col-md-3 mb-3 mt-4">
                                <MDBInput
                                    type="date"
                                    label="First Date Employee Failed to Work"
                                    className="custom-input"
                                    name="firstDateFailed"
                                    value={formData.firstDateFailed}
                                    onChange={handleChange}
                                    floating
                                />
                            </div>

                            <div className="col-md-3 mb-3 ">
                                <label className="col-sm-12 col-form-label custom-label">
                                    Did Employee Receive Full Pay on Date of Injury: <span style={{ color: 'red' }}>*</span>
                                </label>
                                <div className="col-sm-8 custom-radio">
                                    <div className="form-check form-check-inline">
                                        <input
                                            autoComplete="off"
                                            ref={getFieldRef('fullPayOnDate')}
                                            className={`form-check-input ${errors.fullPayOnDate ? 'p-invalid' : ''}`}
                                            type="radio"
                                            name="fullPayOnDate"
                                            value="Yes"
                                            checked={formData.fullPayOnDate === 'Yes'}
                                            onChange={handleChange}
                                            required
                                        />
                                        <label className="form-check-label custom-label" htmlFor="Yes">Yes</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            autoComplete="off"
                                            ref={getFieldRef('fullPayOnDate')}
                                            className={`form-check-input ${errors.fullPayOnDate ? 'p-invalid' : ''}`}
                                            type="radio"
                                            name="fullPayOnDate"
                                            value="No"
                                            checked={formData.fullPayOnDate === 'No'}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label custom-label" htmlFor="No">No</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            autoComplete="off"
                                            ref={getFieldRef('fullPayOnDate')}
                                            className={`form-check-input ${errors.fullPayOnDate ? 'p-invalid' : ''}`}
                                            type="radio"
                                            name="fullPayOnDate"
                                            value="None"
                                            checked={formData.fullPayOnDate === 'None'}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label custom-label" htmlFor="None">None</label>
                                    </div>
                                    {errors.fullPayOnDate && (
                                        <div className="error-message" style={{ color: 'red', fontSize: '12px' }}>
                                            {errors.fullPayOnDate}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-3 mb-3  ">
                                <label className="col-sm-12 col-form-label custom-label mt-0">
                                    Did Injury/Illness Occur on Employer's premises?: <span style={{ color: 'red' }}>*</span>
                                </label>
                                <div className="col-sm-8 custom-radio">
                                    <div className="form-check form-check-inline">
                                        <input
                                            autoComplete="off"
                                            ref={getFieldRef('occurredOnPremises')}
                                            className={`form-check-input ${errors.occurredOnPremises ? 'p-invalid' : ''}`}
                                            type="radio"
                                            name="occurredOnPremises"
                                            value="Yes"
                                            checked={formData.occurredOnPremises === 'Yes'}
                                            onChange={handleChange}
                                            required
                                        />
                                        <label className="form-check-label custom-label" htmlFor="Yes">Yes</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            autoComplete="off"
                                            ref={getFieldRef('occurredOnPremises')}
                                            className={`form-check-input ${errors.occurredOnPremises ? 'p-invalid' : ''}`}
                                            type="radio"
                                            name="occurredOnPremises"
                                            value="No"
                                            checked={formData.occurredOnPremises === 'No'}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label custom-label" htmlFor="No">No</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            autoComplete="off"
                                            ref={getFieldRef('occurredOnPremises')}
                                            className={`form-check-input ${errors.occurredOnPremises ? 'p-invalid' : ''}`}
                                            type="radio"
                                            name="occurredOnPremises"
                                            value="None"
                                            checked={formData.occurredOnPremises === 'None'}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label custom-label" htmlFor="None">None</label>
                                    </div>
                                    {errors.occurredOnPremises && (
                                        <div className="error-message" style={{ color: 'red', fontSize: '12px' }}>
                                            {errors.occurredOnPremises}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <div className="form-group">
                                    <label htmlFor="injuryTypes" className="col-form-label custom-label">
                                        Type of Injury/Illness: <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <FloatLabel>
                                        <Dropdown
                                            value={formData.injuryTypes}
                                            name="injuryTypes"
                                            onChange={handleChange}
                                            options={injuryTypes.map(type => ({
                                                label: type.description,
                                                value: type.value
                                            }))}
                                            placeholder="---Select One---"
                                            filter
                                            className="select-dropdown custom-input"
                                            label="Type of Injury/Illness: "
                                        />
                                    </FloatLabel>
                                </div>
                            </div>

                            {/* How Injury or Illness Occurred */}
                            <div className="col-md-4 mb-3">
                                <div className="form-group">
                                    <label htmlFor="injuryType" className="col-md-9 col-form-label custom-label">
                                        How Injury or Illness Occurred: <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <div className='col-md-8'>
                                        <textarea
                                            name="injuryType"
                                            value={formData.injuryType}
                                            onChange={handleChange}
                                            rows="3"
                                            cols='60'
                                            style={{ marginTop: '10px', resize: 'none' }}
                                            className={`form-control-nr ${errors.occurredOnPremises ? 'p-invalid' : ''}`}
                                        />
                                        {errors.injuryTypes && (
                                            <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                                                {errors.injuryTypes}
                                            </div>
                                        )}
                                        <Dropdown
                                            value={formData.injuryTypes}
                                            name="injuryTypes"
                                            className='col-md-12'
                                            onChange={handleChange}
                                            options={injuryTypes.map(type => ({
                                                label: type.description,
                                                value: type.value
                                            }))}
                                            placeholder="---Select One---"
                                            filter
                                            inputRef={getFieldRef('injuryTypes')}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* </div> */}
                            {/* Body Part Affected */}
                            {/* <div className='row'> */}
                            <div className="col-md-5">
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label custom-label" style={{ marginLeft: '20px' }}>
                                        Body Part Affected: <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <div className="col-sm-8 picklist-container" style={{ width: '100%' }}>
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
                                    </div>
                                    {errors.bodyPartAffected && (
                                        <div className="error-message" style={{ color: 'red', fontSize: '12px' }}>
                                            {errors.bodyPartAffected}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <hr style={{ height: '1px', backgroundColor: 'black', border: 'none' }} />
                        <div className="d-flex flex-wrap">
                            <div className="form-section flex-fill">
                                <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
                                    <div className="col-md-3">
                                        <div className="form-outline">
                                            {/* <MDBFloatingLabel label="If Returned to Work, Give Date:" className="custom-label"> */}
                                            <MDBInput
                                                autoComplete="off"
                                                label="If Returned to Work, Give Date:"
                                                type="date"
                                                className="form-control custom-input"
                                                id="RtwDate"
                                                name="RtwDate"
                                                value={formData.RtwDate}
                                                onChange={handleChange}
                                                onClick={(e) => e.target.showPicker()}
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
                                                className="form-control custom-input"
                                                id="ReturnedWagePerWeek"
                                                name="ReturnedWagePerWeek"
                                                value={formData.ReturnedWagePerWeek || ''}
                                                onBlur={handleBlur}
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
                                                className="form-control custom-input"
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
                            </div>
                        </div>
                        <hr style={{ height: '1px', backgroundColor: 'black', border: 'none', margin: '20px 0' }} />
                        <div className="d-flex flex-wrap">
                            <div className="form-section flex-fill">
                                <div className="form-group row mb-1" style={{ marginLeft: '5px' }}>
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
                                                value={formData.reportPreparedBy}
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
                                                value={formData.telePhoneNumber}
                                                onChange={handleChange}
                                            />
                                            {/* </MDBFloatingLabel> */}
                                        </div>
                                    </div>

                                    <div className="col-md-2 d-flex align-items-center">
                                        <div className="form-outline">
                                            {/* <MDBFloatingLabel label="Ext:" className="custom-label"> */}
                                            <MDBInput
                                                autoComplete="off"
                                                label="Ext:"
                                                type="text"
                                                className="form-control custom-input mb-2"
                                                id="telePhoneExt"
                                                name="telePhoneExt"
                                                value={formData.telePhoneExt}
                                                onChange={handleChange}
                                            />
                                            {/* </MDBFloatingLabel> */}
                                        </div>
                                    </div>

                                    <div className="col-md-3">
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
                                                onClick={(e) => e.target.showPicker()}
                                            />
                                            {/* </MDBFloatingLabel> */}
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
                            <label className="col-3 col-form-label custom-label mr-0" style={{ marginTop: '10px' }}>
                                Check which benefits are being paid:<span style={{ color: 'red' }}>*</span>
                            </label>
                            <div className="col-sm-3 custom-radio d-flex  mt-0 ml-0">
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
                                        <label className="form-check-label custom-label" style={{ marginTop: '12px' }} htmlFor="incomeBenifits">
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
                                        <label className="form-check-label custom-label" style={{ marginTop: '12px' }} htmlFor="salaryInLieu">
                                            Salary in Lieu
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {formData.benifitsBeingPaid === 'incomeBenifits' && (
                            <div className="form-group Income-Benifits-Form mt-4">
                                <div className="d-flex flex-wrap">
                                    <div className="form-section" style={{ marginLeft: '10px' }}>
                                        <div className="col-md-12 form-group row mb-1">
                                            <MDBInput
                                                label="Average Weekly Wage: $"
                                                type="text"
                                                ref={getFieldRef('averageWeeklyWage')}
                                                className={`form-control custom-input ${errors.averageWeeklyWage ? 'p-invalid' : ''}`}
                                                id="averageWeeklyWage"
                                                name="averageWeeklyWage"
                                                value={formData.averageWeeklyWage}
                                                onBlur={handleBlur}
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

                                    <div className="form-section" >
                                        <div className="col-md-12 form-group row">
                                            <MDBInput
                                                label="Weekly Benefit: $"
                                                type="text"
                                                ref={getFieldRef('weeklyBenifit')}
                                                className={`form-control custom-input ${errors.weeklyBenifit ? 'p-invalid' : ''}`}
                                                id="weeklyBenifit"
                                                name="weeklyBenifit"
                                                value={formData.weeklyBenifit}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                floatingLabel
                                                required

                                            />
                                            {errors.weeklyBenifit && (
                                                <div className="error-message" style={{ color: 'red', fontSize: '12px' }}>
                                                    {errors.weeklyBenifit}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="form-section ">
                                        <div className="col-md-12 form-group row ">
                                            <MDBInput
                                                label="Date of Disability"
                                                type="date"
                                                className="form-control custom-input"
                                                id="DateOfDisablity"
                                                name="DateOfDisablity"
                                                value={formData.DateOfDisablity}
                                                onChange={handleChange}
                                                onClick={(e) => e.target.showPicker()}
                                                floatingLabel
                                                required

                                            />
                                        </div>
                                    </div>
                                    <div className="form-section mb-2" >
                                        <div className="col-md-12 form-group row mb-1">
                                            <MDBInput
                                                label="Date Of First Payment: *"
                                                type="date"
                                                ref={getFieldRef('DateOFFirstPayment')}
                                                className={`form-control custom-input ${errors.DateOFFirstPayment ? 'p-invalid' : ''}`}
                                                id="DateOFFirstPayment"
                                                name="DateOFFirstPayment"
                                                value={formData.DateOFFirstPayment}
                                                onChange={handleChange}
                                                onClick={(e) => e.target.showPicker()}
                                                floatingLabel
                                                required

                                            />
                                            {errors.DateOFFirstPayment && (
                                                <div className="error-message" style={{ color: 'red', fontSize: '12px' }}>
                                                    {errors.DateOFFirstPayment}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Second Row: 3 Fields */}
                                <div className="d-flex flex-wrap">
                                    <div className="form-section" style={{ marginLeft: '10px' }}>
                                        <div className="col-md-12 form-group row mb-2">
                                            <MDBInput
                                                label="Compensation Paid: $"
                                                type="text"
                                                ref={getFieldRef('CompensationPaid')}
                                                className={`form-control custom-input ${errors.CompensationPaid ? 'p-invalid' : ''}`}
                                                id="CompensationPaid"
                                                name="CompensationPaid"
                                                value={formData.CompensationPaid}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                floatingLabel
                                                required

                                            />
                                            {errors.CompensationPaid && (
                                                <div className="error-message" style={{ color: 'red', fontSize: '12px' }}>
                                                    {errors.CompensationPaid}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="form-section" >
                                        <div className="col-md-12 form-group row mb-1">
                                            <MDBInput
                                                label="Penalty Paid: $"
                                                type="text"
                                                className="form-control custom-input"
                                                id="penalityPaid"
                                                name="penalityPaid"
                                                value={formData.penalityPaid}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                floatingLabel

                                            />
                                        </div>
                                    </div>
                                    <div className="form-section" style={{ marginRight: '10px' }}>
                                        <div className="col-md-12 form-group row mb-1">
                                            <MDBInput
                                                label="Benefits Payable From Date: *"
                                                type="date"
                                                ref={getFieldRef('BenifitsPayableByDate')}
                                                className={`form-control custom-input ${errors.BenifitsPayableByDate ? 'p-invalid' : ''}`}
                                                id="BenifitsPayableByDate"
                                                name="BenifitsPayableByDate"
                                                value={formData.BenifitsPayableByDate}
                                                onChange={handleChange}
                                                onClick={(e) => e.target.showPicker()}
                                                floatingLabel
                                                required

                                            />
                                            {errors.BenifitsPayableByDate && (
                                                <div className="error-message" style={{ color: 'red', fontSize: '12px' }}>
                                                    {errors.BenifitsPayableByDate}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-section" >
                                        <div className="col-md-12 form-group row mb-1">
                                            <MDBInput
                                                label="Benefits Payable For: *"
                                                type="text"
                                                ref={getFieldRef('BenifitsPAyableFor')}
                                                className={`form-control custom-input ${errors.BenifitsPAyableFor ? 'p-invalid' : ''}`}
                                                id="BenifitsPAyableFor"
                                                name="BenifitsPAyableFor"
                                                value={formData.BenifitsPAyableFor}
                                                onChange={handleChange}
                                                floatingLabel
                                                required

                                            />
                                            {errors.BenifitsPAyableFor && (
                                                <div className="error-message" style={{ color: 'red', fontSize: '12px' }}>
                                                    {errors.BenifitsPAyableFor}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex flex-wrap">
                                    <div className="form-section" style={{ marginLeft: '10px' }}>
                                        <div className="col-sm-3 form-group row mb-1">
                                            <MDBInput
                                                label="Pay Benefit Until:"
                                                type="date"
                                                className="form-control custom-input"
                                                id="payBenifitUntil"
                                                name="payBenifitUntil"
                                                value={formData.payBenifitUntil}
                                                onChange={handleChange}
                                                floatingLabel
                                                onClick={(e) => e.target.showPicker()}
                                            />
                                        </div>
                                        <div className="col-md-3 form-group row mb-1"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {formData.benifitsBeingPaid === 'salaryInLieu' && (
                            <div className="d-flex flex-wrap">
                                <div className="form-section">
                                    <div className="form-group row  mt-2">
                                        <label className="col-md-5 col-form-label custom-label" style={{ marginLeft: '10px' }}>Previously Medical Only:</label>
                                        <div className="col-md-7 d-flex flex-wrap">
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
                                                <label className="form-check-label custom-label" htmlFor="previouslyMedicalYes" style={{ marginTop: '10px' }}>Yes</label>
                                            </div>
                                            <div className="form-check custom-radio form-check-inline">
                                                <input
                                                    type="radio"
                                                    className="form-check-input"
                                                    name="previouslyMedicalOnly"
                                                    id="previouslyMedicalNo"
                                                    value="No"
                                                    onChange={handleChange}
                                                    style={{ fontSize: '10px', color: 'black', marginTop: '10px' }}
                                                />
                                                <label className="form-check-label custom-label" htmlFor="previouslyMedicalNo" style={{ marginTop: '10px' }}>No</label>
                                            </div>
                                            <div className="form-check custom-radio form-check-inline">
                                                <input
                                                    type="radio"
                                                    className="form-check-input"
                                                    name="previouslyMedicalOnly"
                                                    id="previouslyMedicalNone"
                                                    value="None"
                                                    onChange={handleChange}
                                                    style={{ fontSize: '10px', color: 'black', marginTop: '10px' }}
                                                />
                                                <label className="form-check-label custom-label" htmlFor="previouslyMedicalNone" style={{ marginTop: '10px' }}>None</label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Average Weekly Wage Amount */}
                                    <div className="form-group row ">
                                        {/* <label htmlFor="averageWeeklyWageAmount" className="col-md-3 col-form-label custom-label">Average Weekly Wage Amount: $</label> */}
                                        <div className="col-md-10  mt-1 mb-2">
                                            <MDBInput
                                                type="text"
                                                className="form-control custom-input"
                                                label="Average Weekly Wage Amount: $"
                                                id="averageWeeklyWageAmount"
                                                name="averageWeeklyWageAmount"
                                                value={formData.averageWeeklyWageAmount}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                            />
                                        </div>

                                    </div>
                                    <div className="col-md-10 ">
                                        <MDBInput
                                            type="date"
                                            ref={getFieldRef('benefitsPayableFromDate')}
                                            className={`form-control custom-input ${errors.benefitsPayableFromDate ? 'p-invalid' : ''}`}
                                            id="benefitsPayableFromDate"
                                            label="Benefits Payable From Date:"
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

                                <div className="form-section">
                                    <div className="form-group row  mt-4">
                                        <div className="col-md-10 ">
                                            <MDBInput
                                                type="date"
                                                label="Date of Disability:"
                                                className="form-control custom-input"
                                                id="dateOfDisability"
                                                name="dateOfDisability"
                                                onChange={handleChange}
                                                onClick={(e) => e.target.showPicker()}
                                            />
                                        </div>

                                        {/* Date Salary Paid */}
                                        <div className="col-md-10 mt-3">
                                            <MDBInput
                                                type="date"
                                                ref={getFieldRef('dateSalaryPaid')}
                                                className={`form-control custom-input ${errors.dateSalaryPaid ? 'p-invalid' : ''}`}
                                                id="dateSalaryPaid"
                                                label="Date Salary Paid:"
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

                                    {/* Benefits Payable From Date */}
                                    <div className="form-group row  col-md-14">
                                        {/* <label htmlFor="benefitsPayableFor" className="col-md-5 col-form-label custom-label">Benefits Payable For:<span style={{ color: 'red' }}>*</span></label> */}
                                        <div className="col-md-10">
                                            {/* <select
                                                ref={getFieldRef('benefitsPayableFor')}
                                                className={`form-control custom-input ${errors.benefitsPayableFor ? 'p-invalid' : ''}`}
                                                id="benefitsPayableFor"
                                                name="benefitsPayableFor"
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select</option>
                                                <option value="Total Disability">TOTAL DISABILITY</option>
                                            </select> */}
                                            <FloatLabel className="w-full md:w-14rem">
                                                <Dropdown
                                                    ref={getFieldRef('benefitsPayableFor')}
                                                    value={formData.naicsTypes}
                                                    name="naicsTypes"
                                                    onChange={handleChange}
                                                    options={naicsTypes.map(type => ({
                                                        label: type.description,
                                                        value: type.value
                                                    }))}
                                                    placeholder="---Select One---"
                                                    filter
                                                    className="select-dropdown mt-3"
                                                    label="Benefits Payable For"
                                                />
                                                <label htmlFor="naicsTypes">Benefits Payable For</label>
                                            </FloatLabel>
                                            {errors.benefitsPayableFor && (
                                                <div className="error-message" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                                                    {errors.benefitsPayableFor}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="form-section">
                                    {/* Pay Benefit Until */}
                                    <div className="form-group row mb-1 mt-4">
                                        {/* <label htmlFor="payBenefitUntil" className="col-md-3 col-form-label custom-label">Pay Benefit Until:</label> */}
                                        <div className="col-md-12">
                                            <MDBInput
                                                type="date"
                                                className="form-control custom-input"
                                                id="payBenefitUntil"
                                                label="Pay Benefit Until:"
                                                name="payBenefitUntil"
                                                onClick={(e) => e.target.showPicker()}
                                            />
                                        </div>
                                        {/* Weekly Benefit Amount */}
                                        {/* <label htmlFor="weeklyBenefitAmount" className="col-md-3 col-form-label custom-label">Weekly Benefit Amount: $</label> */}
                                        <div className="col-md-12 mt-3">
                                            <MDBInput
                                                type="text"
                                                className="form-control custom-input"
                                                id="weeklyBenefitAmount"
                                                label="Weekly Benefit Amount: $"
                                                name="weeklyBenefitAmount"
                                                value={formData.weeklyBenefitAmount}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        {/* Add a placeholder or another field */}
                                        {/* <label htmlFor="placeholder" className="col-md-3 col-form-label custom-label">Placeholder:</label>
                                        <div className="col-md-3">
                                            <MDBInput
                                                type="text"
                                                className="form-control custom-input"
                                                label=""
                                                id="placeholder"
                                                name="placeholder"
                                                onChange={handleChange}
                                            />
                                        </div> */}
                                    </div>

                                    {/* You can add more fields to complete the 4 fields per row */}
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
                    {/* <button type="reset" className="btn btn-secondary mx-2  custom-label">Reset</button>
                    <button type="button" className="btn btn-primary mx-2   custom-label"
                        style={{
                            backgroundColor: clicked ? '#b6dde5' : '#b6dde5', border: 'none', color: 'black'
                        }}
                        onClick={() => setClicked(!clicked)}>Save</button> */}
                    <button type="submit" className="btn btn-primary mx-2 mb-10  custom-label"
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

export default Wc1Component;
