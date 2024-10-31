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

class ClaimService {
    getClaimById() {
        return axios.get(CLAIM_URL + "/claim/2024000100", {
          headers: authHeader(),
        });
      }
}
export default new ClaimService();