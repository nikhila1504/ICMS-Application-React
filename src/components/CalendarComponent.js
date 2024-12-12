import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import CalendarService from "../services/calendar.service";
import getUsernameFromToken from "../utils/jwtUtils";
import DataTableComponent from "./DataTableComponent.js";

const CalendarComponent = () => {
  const [username, setUsername] = useState(null);
  const [events, setEvents] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalMode, setModalMode] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("01:00");
  const [title, setTitle] = useState("");
  const [claimNo, setClaimNo] = useState("");
  const [calendarList, setCalendarList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get username from token
    const token = localStorage.getItem("token");
    if (token) {
      const user = getUsernameFromToken(token);
      setUsername(user);
    }
  })
  useEffect(() => {
    const fetchCalendarList = async () => {
      try {
        const response = await CalendarService.getCalendarList();
        console.log("API Response:", response.data);
        const fetchedEvents = response.data.map((item) => {
          const title = (item.startTime ? formatTime(item.startTime)  + " " + item.claimNo : "No Title");
          console.log('Event Title:', title); 
          return {
            id: item.id,
            title: title,
            start: item.startTime,
            end: item.endTime,
          };
        });
        console.log("title",fetchedEvents);
        console.log("Fetched Events:", fetchedEvents); 
        setCalendarList(response.data);
        setEvents(fetchedEvents);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching calendar list:", error);
      }
    };
    fetchCalendarList();
  }, []);

  useEffect(() => {
    console.log("Updated Events:", events); 
  }, [events]);

  const handleDateClick = (info) => {
    setSelectedDate(info.date);
    setStartTime("00:00");
    setEndTime("01:00");
    setTitle("");
    setModalMode('create');
    setModalShow(true);
  };
  const formatTime = (timeString) => {

    const date = new Date(timeString);

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  };

  const handleEventClick = async (info) => {
  const eventId = info.event._def?.publicId;
  if (!eventId || isNaN(eventId)) {
    console.error("Invalid event ID:", eventId);
    return;
  }
    try {
      const response = await CalendarService.getSlotById(eventId);
      console.log("Backend Response:", response);
      const event = response.data;
      console.log("Event Data:", event);
      console.log(event);
      

      const startTime = event.startTime ? formatTime(event.startTime) : "00:00 AM";

      const endTime = event.endTime ? formatTime(event.endTime) : "01:00 AM";

     console.log(startTime);

     console.log(endTime)

    if (event.startTime && event.endTime) {

      const formatTime = (timeString) => {

        const date = new Date(timeString); // Convert the time string to a Date object

        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

      };

      const startTime = event.startTime ? formatTime(event.startTime) : "00:00 AM";

      const endTime = event.endTime ? formatTime(event.endTime) : "01:00 AM";

      console.log("Formatted Start Time:", startTime);

      console.log("Formatted End Time:", endTime);

      setStartTime(startTime);

      setEndTime(endTime);

    } else {

      console.error("Missing startTime or endTime in event:", event);

      setStartTime("00:00 AM");

      setEndTime("01:00 AM");

    }


      // if (event.startTime && event.endTime) {
      //   const startDateTime = `${selectedDate.toISOString().split("T")[0]}T${startTime}`;
      //   const endDateTime = `${selectedDate.toISOString().split("T")[0]}T${endTime}`;
      //   setStartTime(event.startTime.slice(11, 16));
      //   setEndTime(event.endTime.slice(11, 16));
      // } else {
      //   console.error("Missing startTime or endTime in event:", event);
      //   setStartTime("00:00");
      //   setEndTime("01:00");
      // }
      setSelectedEvent(event);
      setTitle(event.title || "");
      setSelectedDate(new Date(event.startTime));  
      setClaimNo(event.claimNo || "Not Available"); 
      setModalMode('edit'); 
      setModalShow(true); 
    } catch (error) {
      console.error("Error fetching event for editing:", error);
    }
  };

  return (
    <div style={{ border: '1px' }}>
      <DataTableComponent />
      <div style={{ display: "flex", padding: "20px", width: '80%' }}>
        <div style={{ flex: 3 }}>
          <h1>
            <Link to="/wc1" className="heading btn custom-btn mb-2">Back</Link>
            <h1 className="custom-h1 header" style={{ marginTop: '5px' }}>Scheduled Appeals/Hearings/Mediations/Rehab Conferences
            </h1>
          </h1>
          {loading ? <p>Loading...</p> : (
            <FullCalendar className="calendar"
              headerToolbar={{
                start: "today prev next",
                center: "title",
                end: "dayGridMonth dayGridWeek dayGridDay",
              }}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              weekends={false}
              events={events}
              editable={true}
              selectable={true}
              nowIndicator={true}
              initialDate={new Date()}
              dayCellClassNames={(date) =>
                date.date.toDateString() === new Date().toDateString()
                  ? "highlight-today"
                  : ""}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              contentHeight={460}
             />
          )}
        </div>
      </div>
     {/* Modal for displaying event details */}
     <Modal className="calendar" show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3>{modalMode === 'edit' ? 'Schedule Event Details' : 'No Event'}</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {modalMode === 'edit' && selectedEvent && (
              <>
                <Form.Group controlId="formClaimNo">
                  <label className="custom-label" style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>Claim Number : </label>
                  <span style={{ fontSize: '15px' }}>{claimNo}</span>
                  
                </Form.Group>

                {/* <Form.Group controlId="formTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={title}
                  />
                </Form.Group> */}

                <Form.Group controlId="formClaimantName">
                <label className="custom-label" style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>Claimant Name : </label>
                <span style={{ fontSize: '15px' }}>{selectedEvent.claimantFirstName + ' ' + selectedEvent.claimantLastName}</span>
                  {/* <Form.Label>Claimant Name</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={selectedEvent.claimantFirstName + ' ' + selectedEvent.claimantLastName}
                  /> */}
                </Form.Group>
                <Form.Group controlId="formLocationType">
                <label className="custom-label" style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>Location : </label>
                <span style={{ fontSize: '15px' }}>{selectedEvent.area}</span>
                  {/* <Form.Label>Location Type</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={selectedEvent.locationTypeId}
                  /> */}
                </Form.Group>
                <Form.Group controlId="formLocationType">
                <label className="custom-label" style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>Forum : </label>
                <span style={{ fontSize: '15px' }}>{selectedEvent.divisionDesc}</span>
                  {/* <Form.Label>Location Type</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={selectedEvent.locationTypeId}
                  /> */}
                </Form.Group>
                <Form.Group controlId="formStaffAttorney">
                <label className="custom-label" style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>ALJ : </label>
                <span style={{ fontSize: '15px' }}>{selectedEvent.aljFirstName + ' ' +selectedEvent.aljLastName}</span>
                  {/* <Form.Label>Staff Attorney</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={selectedEvent.staffAttorneyFirstName + ' ' + selectedEvent.staffAttorneyLastName}
                  /> */}
                </Form.Group>
                <Form.Group controlId="formScheduledDate">
                <label className="custom-label" style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>Scheduled Date : </label>
                <span style={{ fontSize: '15px' }}>{new Date(selectedEvent.scheduledDate).toLocaleDateString()}</span>
                  {/* <Form.Label>Scheduled Date</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={new Date(selectedEvent.scheduledDate).toLocaleDateString()}
                  /> */}
                </Form.Group>
                <Form.Group controlId="formStartTime">
                <label className="custom-label" style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>Scheduled Time : </label>
                <span style={{ fontSize: '15px' }}>{startTime}-{endTime}</span>
                  {/* <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={startTime}
                  /> */}
                </Form.Group>

                {/* <Form.Group controlId="formEndTime">
                <label className="custom-label" style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>End Time : </label>
                <span style={{ fontSize: '15px' }}>{endTime}</span> */}
                  {/* <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={endTime}
                  /> */}
                {/* </Form.Group> */}

                {/* Adding the additional event details */}
                

                {/* <Form.Group controlId="formCountyOfInjury">
                <label className="custom-label" style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>County of Injury : </label>
                <span style={{ fontSize: '15px' }}>{selectedEvent.countyOfInjury}</span> */}
                  {/* <Form.Label>County of Injury</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={selectedEvent.countyOfInjury}
                  /> */}
                {/* </Form.Group>

                <Form.Group controlId="formDateOfInjury">
                <label className="custom-label" style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>Date of Injury : </label>
                <span style={{ fontSize: '15px' }}>{new Date(selectedEvent.dateOfInjury).toLocaleDateString()}</span> */}
                  {/* <Form.Label>Date of Injury</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={new Date(selectedEvent.dateOfInjury).toLocaleDateString()}
                  /> */}
                {/* </Form.Group> */}

               

                

                <Form.Group controlId="formScheduledStatus">
                <label className="custom-label" style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>Scheduled Status : </label>
                <span style={{ fontSize: '15px' }}>{selectedEvent.scheduledStatus}</span>
                  {/* <Form.Label>Scheduled Status</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={selectedEvent.scheduledStatus}
                  /> */}
                </Form.Group>

                {/* <Form.Group controlId="formSiteDescription">
                <label className="custom-label" style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>Site Description : </label>
                <span style={{ fontSize: '15px' }}>{selectedEvent.siteDesc}</span> */}
                  {/* <Form.Label>Site Description</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={selectedEvent.siteDesc}
                  /> */}
                {/* </Form.Group> */}

                
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* <div style={{ flex: 1, marginTop: "200px" }}>
          <ul style={{ listStyle: "none", padding: 10 }}>
            <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#007bff",
                  marginRight: "10px",
                }}
              ></span>
              Appointment
            </li>
            <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#28a745",
                  marginRight: "10px",
                }}
              ></span>
              Holiday
            </li>
            <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#dc3545",
                  marginRight: "10px",
                }}
              ></span>
              Doctor's Appointment
            </li>
            <li style={{ display: "flex", alignItems: "center" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#f7f8b4",
                  border: "2px solid #007bff",
                  marginRight: "10px",
                }}
              ></span>
              Today
            </li>
          </ul>
        </div> */}
    </div> 
  );
};

export default CalendarComponent;