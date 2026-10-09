import axios from 'axios'
import { useRouter } from 'vue-router';
const router = useRouter();

const API_BASE = import.meta.env.BACKEND_URL ?? "http://localhost:8042";

export const login = async (email,password) => {
  const response = await axios.post(`${API_BASE}/auth/login`, {email:email,password:password});
  console.log("RESP", response)
  const authToken = response.data?.access_token;
  if(authToken != null) {
    sessionStorage.setItem("authToken",authToken)
    sessionStorage.setItem("user",JSON.stringify(response.data.user))
    return authToken;
  }
  else {
    return null;
  }
}

export const register = async (name,email,password) => {
  const response = await axios.post(`${API_BASE}/auth/register`, {name:name,email:email,password:password});
  const authToken = response.data?.access_token;
  if(authToken != null) {
    sessionStorage.setItem("authToken",authToken)
    return authToken;
  }
  else {
    return null;
  }
}

// main API function
export const useApi = async (method, path, params = {}, data = {}, reattempt=false) => {
  // try to obtain token if it doesn't currently exist
  let authToken = sessionStorage.getItem("authToken")
  if (!authToken || authToken=="null") {
    const router = useRouter();
    console.log("ROUTER", router);
    router.push("/login");
    return;
  }
  // attempt to run API
  try {
    const response = await axios({
      method,
      url: `${API_BASE}${path}`,
      responseType: 'json',
      params,
      data,
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    return response;
  } catch (error) {
    throw error;
  }
};