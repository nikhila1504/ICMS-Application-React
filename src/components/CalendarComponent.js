import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import CalendarService from "../services/calendar.service";
import getUsernameFromToken from "../utils/jwtUtils";


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
          const title = (item.startTime ? item.startTime.slice(11, 16) + " " + item.claimNo : "No Title");
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
      if (event.startTime && event.endTime) {
        const startDateTime = `${selectedDate.toISOString().split("T")[0]}T${startTime}`;
        const endDateTime = `${selectedDate.toISOString().split("T")[0]}T${endTime}`;
        setStartTime(event.startTime.slice(11, 16));
        setEndTime(event.endTime.slice(11, 16));
      } else {
        console.error("Missing startTime or endTime in event:", event);
        setStartTime("00:00");
        setEndTime("01:00");
      }
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
    <div>
      <div style={{ display: "flex", padding: "20px" }}>
        <div style={{ flex: 3 }}>
          <h1>
            <Link to="/wc1" className="heading btn btn-dark mb-2">Back</Link>
            Calendar
          </h1>
          {loading ? <p>Loading...</p> : (
            // <FullCalendar
            //   key={events.length}
            //   events={events}
            //   plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            //   initialView="dayGridMonth"
            //   dateClick={handleDateClick}
            //   eventClick={handleEventClick}
            // />
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
     <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3>{modalMode === 'edit' ? 'Event Details' : 'Create Event'}</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {modalMode === 'edit' && selectedEvent && (
              <>
                <Form.Group controlId="formClaimNo">
                  <Form.Label>Claim Number</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={claimNo}
                  />
                </Form.Group>

                {/* <Form.Group controlId="formTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={title}
                  />
                </Form.Group> */}

                <Form.Group controlId="formStartTime">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={startTime}
                  />
                </Form.Group>

                <Form.Group controlId="formEndTime">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={endTime}
                  />
                </Form.Group>

                {/* Adding the additional event details */}
                <Form.Group controlId="formClaimantName">
                  <Form.Label>Claimant Name</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={selectedEvent.claimantFirstName + ' ' + selectedEvent.claimantLastName}
                  />
                </Form.Group>

                <Form.Group controlId="formCountyOfInjury">
                  <Form.Label>County of Injury</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={selectedEvent.countyOfInjury}
                  />
                </Form.Group>

                <Form.Group controlId="formDateOfInjury">
                  <Form.Label>Date of Injury</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={new Date(selectedEvent.dateOfInjury).toLocaleDateString()}
                  />
                </Form.Group>

                <Form.Group controlId="formLocationType">
                  <Form.Label>Location Type</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={selectedEvent.locationTypeId}
                  />
                </Form.Group>

                <Form.Group controlId="formScheduledDate">
                  <Form.Label>Scheduled Date</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={new Date(selectedEvent.scheduledDate).toLocaleDateString()}
                  />
                </Form.Group>

                <Form.Group controlId="formScheduledStatus">
                  <Form.Label>Scheduled Status</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={selectedEvent.scheduledStatus}
                  />
                </Form.Group>

                <Form.Group controlId="formSiteDescription">
                  <Form.Label>Site Description</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={selectedEvent.siteDesc}
                  />
                </Form.Group>

                <Form.Group controlId="formStaffAttorney">
                  <Form.Label>Staff Attorney</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={selectedEvent.staffAttorneyFirstName + ' ' + selectedEvent.staffAttorneyLastName}
                  />
                </Form.Group>
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
    </div>
  );
};

export default CalendarComponent;