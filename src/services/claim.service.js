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
const SEARCH_URL="http://localhost:9092/searchClaim"

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
  searchClaim(formData){
    const { firstName, lastName, dateOfBirth, dateOfInjury } = formData;
    const url = `${SEARCH_URL}/findClaim?firstName=${firstName}&lastName=${lastName}&dateOfBirth=${dateOfBirth}&dateOfInjury=${dateOfInjury}`;
    return axios.get(url,{
      headers: authHeader(),
    });
  }

  // getClaimForm(formData){
  //   return axios.post(CLAIM_URL + "/submitWc1Form" , formData ,{
  //     headers: authHeader(),
  //   });
  // }
}
export default new ClaimService();