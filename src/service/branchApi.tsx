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