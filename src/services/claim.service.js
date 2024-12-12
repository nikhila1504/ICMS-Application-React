import axios from "axios";

// const authHeader = () => {
//   const user = localStorage.getItem("token");
//   if (user) {
//     console.log(`Bearer ${user}`);
//     return { Authorization: `Bearer ${user}` };
//   } else {
//     return {};
//   }
// };

const authHeader = () => {
  const user = localStorage.getItem("token");
  if (user) {
    console.log(`Bearer ${user}`);
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
    return axios.get(CLAIM_URL + "/claim/2024039501", {
      headers: authHeader(),
    });
  }
  saveClaim(formData){
    return axios.post(CLAIM_URL + "/submitWc1Form" , formData ,{
      headers: authHeader(),
      responseType: 'arraybuffer', 
    });
  }

  // getClaimForm(formData){
  //   return axios.post(CLAIM_URL + "/submitWc1Form" , formData ,{
  //     headers: authHeader(),
  //   });
  // }
}
export default new ClaimService();