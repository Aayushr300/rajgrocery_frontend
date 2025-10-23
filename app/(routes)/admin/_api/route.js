const { default: axios } = require("axios");

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // include cookies if your backend uses them
});

const adminLogin = async (email, password) => {
  try {
    const response = await axiosClient.post("/login", { email, password });

    console.log("Response from adminLogin:", response);

    if (!response || !response.data) {
      throw new Error("No response data");
    }

    // Use the correct keys returned by backend
    const { token, message } = response.data;

    // Store token in sessionStorage
    sessionStorage.setItem("adminToken", token);

    console.log("Admin Login successful:", message, token);

    return response.data;
  } catch (error) {
    console.error("Admin Login error from frontend:", error);
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Error signing in admin";
    throw new Error(message);
  }
};

// Admin Signup
const adminSignup = async ({ name, email, password, phone, role }) => {
  try {
    const response = await axiosClient.post("/signup", {
      name,
      email,
      password,
      phone,
      role,
    });

    const { jwt, admin } = response.data;

    // Optionally store admin data after signup
    sessionStorage.setItem("adminToken", jwt);
    sessionStorage.setItem("admin", JSON.stringify(admin));

    console.log("Admin Signup response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Admin Signup error from frontend:", error);
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Error signing up admin";
    throw new Error(message);
  }
};

module.exports = {
  adminLogin,
  adminSignup,
  axiosClient,
};
