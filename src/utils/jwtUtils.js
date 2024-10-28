import { jwtDecode } from "jwt-decode";

const getUsernameFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.username || decoded.sub || decoded.name || null; // Adjust according to the payload structure
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export default getUsernameFromToken;
