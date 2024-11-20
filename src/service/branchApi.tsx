import userApi from "./axios"
import ConfigData from "../config/constant.json";


export const getApi = async (url: string) => {
    try {
      const response = await userApi.get(`${ConfigData.SERVER_URL}${url}`);
      return response; // Assuming you want the data from the response
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Rethrow the error to handle it where getApi is called
    }
  };
  export const getBranchData = async (url: string, options: { params: any }) => {
    try {
      // Passing the params along with the request
      const response = await userApi.get(`${ConfigData.SERVER_URL}${url}`, {
        params: options.params,  // Pass params here
      });
      return response; // Return the response data
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Rethrow the error to handle it in the calling function
    }
  };
  