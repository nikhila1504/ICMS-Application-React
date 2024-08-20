import axios from "axios";

const PARTY_API_URL = "http://localhost:9092/party";
const authHeader = () => {
  const user = localStorage.getItem("token");
  if (user) {
    return { Authorization: `Bearer ${user}` };
  } else {
    return {};
  }
};

class PartyService {
  getAllParties() {
    return axios.get(PARTY_API_URL + "/getAllParties", {
      headers: authHeader(),
    });
  }
  createParty(party) {
    return axios.post(PARTY_API_URL + "/saveParty", party, {
      headers: authHeader(),
    });
  }

  getPartyById(id) {
    return axios.get(PARTY_API_URL + "/" + id, {
      headers: authHeader(),
    });
  }

  updateParty(id, party) {
    return axios.put(PARTY_API_URL + "/updateParty/" + id, party, {
      headers: authHeader(),
    });
  }

  deleteParty(id) {
    return axios.delete(PARTY_API_URL + "/deleteParty/" + id, {
      headers: authHeader(),
    });
  }
}

/* eslint import/no-anonymous-default-export: [2, {"allowNew": true}] */
export default new PartyService();
