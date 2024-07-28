import axiosInstance from "./api";

export const postAiText = async (payload) => {
  try {
    const response = await axiosInstance.post("/openai/text", payload);
    return response.data;
  } catch (error) {
    throw error.response?error.response.data : new Error("Network error");
  }
};

export const postAiCode = async (payload) => {
  try {
    const response = await axiosInstance.post("/openai/code", payload);
    return response.data;
  } catch (error) {
    throw error.response?error.response.data : new Error("Network error");
  }
};

export const postAiAssist = async (payload) => {
  try {
    const response = await axiosInstance.post("/openai/assist", payload);
    return response.data;
  } catch (error) {
    throw error.response?error.response.data : new Error("Network error");
  }
};
