import axios from "axios";

const authHeader = () => {
  const user = localStorage.getItem("token");
  if (user) {
    return {
      Authorization: `Bearer ${user}`,
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    };
  } else {
    return {};
  }
};

const CALENDAR_URL = "http://localhost:9092/calendar";
const SLOT_URL = "http://localhost:9092/slot";

class CalendarService {
  getCalendarList() {
    return axios.get(SLOT_URL + "/calendarList", {
      headers: authHeader(),
    });
  }
  getEventById(id) {
    return axios.get(CALENDAR_URL + "/" + id, {
      headers: authHeader(),
    });
  }

  getSlotList(id) {
    return axios.get(SLOT_URL + "/listAllSlots/" + id, {
      headers: authHeader(),
    });
  }

  getSlotById(id) {
    return axios.get(SLOT_URL + "/calendarSlots/" + id, {
      headers: authHeader(),
    });
  }
  saveSlot(slot) {
    return axios.post(SLOT_URL + "/saveSlot", slot, {
      headers: authHeader(),
    });
  }
  saveCalendar(slot) {
    return axios.post(CALENDAR_URL + "/saveCalendar", slot, {
      headers: authHeader(),
    });
  }
  updateSlot(slot) {
    return axios.put(SLOT_URL + "/updateSlot/" + slot.slotId, slot, {
      headers: authHeader(),
    });
  }
}

/* eslint import/no-anonymous-default-export: [2, {"allowNew": true}] */
export default new CalendarService();
