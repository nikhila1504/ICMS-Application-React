import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import CalendarService from "../services/calendar.service";
import getUsernameFromToken from "../utils/jwtUtils";

const CalendarComponent = () => {
  const { id } = useParams();
  const [username, setUsername] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("01:00");
  const [title, setTitle] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [modalMode, setModalMode] = useState('');  // 'edit' or 'create'
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    // Get username from token
    const token = localStorage.getItem("token");
    if (token) {
      const user = getUsernameFromToken(token);
      setUsername(user);
    }

    // Fetch events on mount
    const fetchEvents = async () => {
      try {
        const response = await CalendarService.getSlotList(id);
        const fetchedEvents = response.data.map((slot) => ({
          id: slot.slotId,
          title: slot.title || "Title is not Available",
          start: slot.startTime,
          end: slot.endTime,
        }));
        console.log("fetchedEvents..", fetchedEvents);
        setEvents(fetchedEvents);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEvents();
  }, [id]);

  // Date click handler to open modal for creating a new event
  const handleDateClick = (info) => {
    setSelectedDate(info.date);
    setStartTime("00:00");
    setEndTime("01:00");
    setTitle("");
    setModalMode('create');  // Set modal mode to "create"
    setModalShow(true);
  };

  // Event click handler to open modal for editing an existing event
  const handleEventClick = async (info) => {
    const eventId = info.event.id;
    try {
      const response = await CalendarService.getSlotById(eventId);
      const event = response.data;

      setSelectedEvent(event);  // Set the clicked event for editing
      setTitle(event.title || "");  // Pre-populate title
      setStartTime(event.startTime.slice(11, 16));  // Pre-populate start time (HH:MM)
      setEndTime(event.endTime.slice(11, 16));  // Pre-populate end time (HH:MM)

      setSelectedDate(new Date(event.startTime));  // Set the date to the event's start date
      setModalMode('edit');  // Set modal mode to "edit"
      setModalShow(true);  // Show the modal for editing
    } catch (error) {
      console.log("Error fetching event for editing:", error);
    }
  };

  const handleSaveSlot = async () => {
    if (!startTime || !endTime || !title) {
      alert("Please fill in all fields.");
      return;
    }

    const startDateTime = `${selectedDate.toISOString().split("T")[0]}T${startTime}`;
    const endDateTime = `${selectedDate.toISOString().split("T")[0]}T${endTime}`;

    const slotData = {
      title: title,
      startTime: startDateTime,
      endTime: endDateTime,
      // deactiveDate: endDateTime,
      createdDate: new Date().toISOString(),
      createdBy: username,
      lastUpdatedDate: new Date().toISOString(),
      lastUpdatedBy: username,
      calendar: {
        calendarId: 41,
      },
    };

    // Only add slotId if it's an edit operation
    if (modalMode === 'edit' && selectedEvent) {
      slotData.slotId = selectedEvent.slotId;  // Make sure to include the existing slotId for updating
    }

    try {
      if (modalMode === 'edit') {
        // Update existing event
        await CalendarService.updateSlot(slotData);  // Ensure updateSlot is handling the slotId properly
      } else {
        // Create new event
        const calendarData = {
          // party: { id: id },
          // calenderDate: startDateTime,
          // deactiveDate: endDateTime,
          // createdDate: new Date().toISOString(),
          // createdBy: username,
          // lastUpdatedDate: new Date().toISOString(),
          // lastUpdatedBy: username,
          slot: [slotData],
        };
        await CalendarService.saveSlot(slotData);
      }

      // Close the modal
      setModalShow(false);

      // Refresh events after saving
      const response = await CalendarService.getSlotList(id);
      if (response && response.data) {
        const updatedEvents = response.data.map((slot) => ({
          id: slot.slotId,
          title: slot.title || "Title is not Available",
          start: slot.startTime,
          end: slot.endTime,
        }));
        setEvents(updatedEvents);
      }
    } catch (error) {
      console.error("Failed to save slot:", error);
    }
  };

  return (
    <div style={{ border: '1px' }}>
      <div style={{ display: "flex", padding: "20px", width: '100%' }}>
        <div style={{ flex: 3 }}>
          <h1>
            <Link to="/wc1" className="heading btn  btn-dark mb-2">
              Back
            </Link>
            Calendar
          </h1>
          <FullCalendar className="calendar"
            headerToolbar={{
              start: "today prev next",
              center: "title",
              end: "dayGridMonth dayGridWeek dayGridDay",
            }}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            weekends={false}
            events={events} // Pass events array
            editable={true} // Allow drag-and-drop
            selectable={true} // Allow selection
            nowIndicator={true} // Highlight the current time
            initialDate={new Date()} // Start with today's date
            dayCellClassNames={(date) =>
              date.date.toDateString() === new Date().toDateString()
                ? "highlight-today"
                : ""}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            contentHeight={460}
          />

          {/* Modal for editing or creating an event */}
          <Modal className="calendar" show={modalShow} onHide={() => setModalShow(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title><h3>{modalMode === 'edit' ? 'Edit Event' : 'Create Event'}</h3></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter slot title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formStartTime">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formEndTime">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setModalShow(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveSlot}>
                {modalMode === 'edit' ? 'Save Slot' : 'Save Slot'}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <div style={{ flex: 1, marginTop: "200px" }}>
          {/* <h3>Legend</h3> */}
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
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;