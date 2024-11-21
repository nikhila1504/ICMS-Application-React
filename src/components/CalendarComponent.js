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
  const today = new Date();
  const currentDate = `${
    today.getMonth() + 1
  }/${today.getDate()}/${today.getFullYear()}`;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("01:00");
  const [title, setTitle] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [modalMode, setModalMode] = useState('');  // 'edit' or 'create'
  const [selectedEvent, setSelectedEvent] = useState(null);  

  const handleDateClick = (info) => {
    console.log("Date clicked:", info.dateStr);
    setSelectedDate(info.date);
    setStartTime("00:00");
    setEndTime("01:00");
    setTitle("");
    setModalShow(true);
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (token) {
      const user = getUsernameFromToken(token);
      setUsername(user);
      console.log(user);
    } else {
      console.log("No JWT token found in localStorage.");
    }

    const fetchEvents = async () => {
      try {
        const response = await CalendarService.getEventById(id);
        console.log(response.data);

        const fetchedEvents = response.data.slot.map((slot) => ({
          id: slot.slotId,
          title: slot.title || "Title is not Available",
          start: slot.startTime,
          end: slot.endTime,
        }));
        setEvents(fetchedEvents);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEvents();
  }, [id, title]);

  // Event click handler to fetch the event details for editing
  const handleEventClick = async (info) => {
    console.log(info);
    const eventId = info.event.id;
    console.log(eventId);
    CalendarService.getSlotById(eventId)
    .then((response) => {
      console.log(response);
      setSelectedEvent(response.data); // Set the clicked event as the selected event
      const startDateTime = `${
        selectedDate.toISOString().split("T")[0]
      }T${selectedEvent.startTime}`;
      const endDateTime = `${
        selectedDate.toISOString().split("T")[0]
      }T${selectedEvent.endTime}`;
      console.log("selectedevent..",startDateTime);
      setModalMode('edit'); // Set modal mode to "edit"
      setModalShow(true); // Show the modal for editing
      
    })
    .catch((error) => {
      console.log(error);
    });
  };


  const handleSaveSlot = async () => {
    if (!startTime || !endTime || !title) {
      alert("Please fill in all fields.");
      return;
    }

    const startDateTime = `${
      selectedDate.toISOString().split("T")[0]
    }T${startTime}`;
    const endDateTime = `${
      selectedDate.toISOString().split("T")[0]
    }T${endTime}`;

    const slotData = {
      title: title,
      startTime: startDateTime,
      endTime: endDateTime,
      deactiveDate: endDateTime,
      createdDate: new Date().toISOString(),
      createdBy: username,
      lastUpdatedDate: new Date().toISOString(),
      lastUpdatedBy: username,
      calendar: {
        calendarId: id,
      },
    };

    try {
      if (events.length > 0) {
        await CalendarService.saveSlot(slotData);
      } else {
        const calendarData = {
          party: {
            id: id,
          },
          calenderDate: startDateTime,
          deactiveDate: endDateTime,
          createdDate: new Date().toISOString(),
          createdBy: username,
          lastUpdatedDate: new Date().toISOString(),
          lastUpdatedBy: username,
          slot: [
            {
              calendarId: id,
              startTime: startDateTime,
              endTime: endDateTime,
              deactiveDate: endDateTime,
              createdDate: new Date().toISOString(),
              createdBy: username,
              lastUpdatedDate: new Date().toISOString(),
              lastUpdatedBy: username,
              title: title,
              calendar: {
                calendarId: id,
              },
            },
          ],
        };

        await CalendarService.saveCalendar(calendarData);
      }

      setModalShow(false);

      // Refresh events after saving
      const response = await CalendarService.getEventById(id);
      if (response && response.data && response.data.slot) {
        const updatedEvents = response.data.slot.map((slot) => ({
          id: slot.slotId,
          title: slot.title || "Title is not Available",
          start: slot.startTime,
          end: slot.endTime,
        }));
        setEvents(updatedEvents);
      } else {
        console.warn("No valid event data found after saving.");
        setEvents([]);
      }
    } catch (error) {
      console.error("Failed to save slot:", error);
    }
  };

  return (
    <div style={{display: "flex",gap: "20px", padding: "20px", width:'100%' }}>
      <div style={{ flex: 3 }}>
      <h1>
        <Link to="/wc1" className="heading btn  btn-dark mb-2">
          Back
        </Link>
        Calendar :{currentDate}
      </h1>
      <FullCalendar 
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
        contentHeight={500}
      />
      <Modal className="calendar" show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title><h3>{modalMode === 'edit' ? 'Edit Event' : 'Create New Event'}</h3></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter slot title"
                value={selectedEvent?.title || ''}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formStartTime">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                value={selectedEvent?.startTime ? selectedEvent.startTime.slice(11, 16) : ''}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formEndTime">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                value={selectedEvent?.endTime ? selectedEvent.endTime.slice(11, 16) : ''}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Cancel
          </Button>
          {/* <Button variant="primary" onClick={handleSaveSlot}>
            Save Slot
          </Button> */}
          <Button variant="primary" onClick={handleSaveSlot}>{modalMode === 'edit' ? 'Save Changes' : 'Save Slot'}</Button>
        </Modal.Footer>
      </Modal>
      </div>
      {/* Legend Section */}
      <div style={{ flex: 1,marginTop:"200px"  }}>
        {/* <h3>Legend</h3> */}
        <ul style={{ listStyle: "none", padding: 10}}>
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
  );
};

export default CalendarComponent;
