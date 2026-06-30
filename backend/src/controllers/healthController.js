import { sendSuccess } from "../utils/response.js";

export const getHealth = (req, res) => {
  return sendSuccess(res, "Sadar Uang API is running");
};
