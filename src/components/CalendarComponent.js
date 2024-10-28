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
    <div>
      <h1>
        <Link to="/parties" className="heading btn  btn-dark mb-2">
          Back
        </Link>
        Calendar :{currentDate}
      </h1>
      <FullCalendar
        headerToolbar={{
          start: "today prev next",
          end: "dayGridMonth dayGridWeek dayGridDay",
        }}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={false}
        events={events}
        dateClick={handleDateClick}
        contentHeight={580}
      />
      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Slot</Modal.Title>
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
            Save Slot
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CalendarComponent;
