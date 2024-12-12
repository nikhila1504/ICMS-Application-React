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

const CLAIM_URL = "http://localhost:9092/wc1";

class ClaimPartyService {
    getClaimPartyByClaimId() {
        return axios.get(CLAIM_URL + "/claimParty/1705266", {
          headers: authHeader(),
        });
      }
}
export default new ClaimPartyService();