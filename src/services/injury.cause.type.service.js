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

class InjuryCauseTypeService {
    getAllInjuryCauseTypes() {
        return axios.get(CLAIM_URL + "/getAllInjuryCauseTypes", {
          headers: authHeader(),
        });
      }
}
export default new InjuryCauseTypeService();