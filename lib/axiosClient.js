import axios from "axios";
import Router from "next/router";

const axiosClient = axios.create({
  timeout: 30000,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const skipRedirect = error.config?.skipRedirect;
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);

      
      if (!skipRedirect) {
        if (error.response.status >= 500) {
          Router.push("/500");
        } else if (error.response.status === 404) {
          Router.push("/404");
        }
      }
    } else if (error.request) {
      console.error("Network Error: No response from server");
      if (!skipRedirect) {
        Router.push("/network-error");
      }
    } else {
      console.error("Axios Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
