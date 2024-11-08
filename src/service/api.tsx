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


  
export const postApi = async (url: string, data: any) => {
    try {
        console.log('url',url);
        console.log('data',data);
        
      const response = await userApi.post(`${ConfigData.SERVER_URL}${url}`, data);
      return response.data;
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  };