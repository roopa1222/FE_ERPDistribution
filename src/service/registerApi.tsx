import userApi from "./axios"
import ConfigData from "../config/constant.json";




type FormData = {
    firstName: string;
    lastName: string;
    branchId: string;
    mobileNo: string;
    userName: string;
    email: string;
    role: string;
    password:string;
};
export const registerApi = async (url: string, formData:FormData) => {
    try {
        const response = await userApi.post(`${ConfigData.SERVER_URL}${url}`, formData);
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
 }