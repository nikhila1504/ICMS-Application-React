import axios from "axios";

const authHeader = () => {
  const user = localStorage.getItem("token");
  if (user) {
    console.log(user);
    return { Authorization: `Bearer ${user}` };
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
      saveClaim(claim){
        return axios.get(CLAIM_URL + "/saveWc1Form" , claim ,{
          headers: authHeader(),
        });
      }
}
export default new ClaimService();