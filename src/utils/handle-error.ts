import { AxiosError } from "axios";

export const handleError = (error: Error | AxiosError) => {
  console.error("Error:", error.message);
  if (error instanceof AxiosError) {
    console.error("Error Details:", error.response?.data);
  }
  process.exit(1);
};
