const { default: axios } = require("axios");

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const getCategory = () => axiosClient.get("/get-categories");

const getSliders = () =>
  axiosClient.get("/sliders?populate=*").then((resp) => resp.data.data);

const getCategoryList = () =>
  axiosClient.get("/categories?populate=*").then((resp) => resp.data.data);

const getProductList = () =>
  axiosClient.get("/products?populate=*").then((resp) => resp.data.data);

const getProductByCategory = async (categoryName) => {
  try {
    // 1️⃣ Get the category ID from the backend
    const categoryResp = await axiosClient.get("/get-category-id", {
      params: { name: categoryName }, // send the categoryName as query param
    });

    console.log("Response", categoryResp);
    const categoryId = categoryResp.data.id; // assuming backend returns { id: "123" }
    // 2️⃣ Get products by category ID
    const productsResp = await axiosClient.get(
      `/products/category/${categoryId}`
    ); // replace :categoryId

    console.log("Get products By category", productsResp);
    return productsResp.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const registerUser = async (username, email, phone, password) => {
  try {
    const response = await axiosClient.post("/user/signup", {
      username,
      email,
      phone,
      password,
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error registering user:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const SignInUser = async (email, password) => {
  try {
    const response = await axiosClient.post("/user/login", { email, password });
    const { jwt, user } = response.data;

    sessionStorage.setItem("token", jwt);
    sessionStorage.setItem("user", JSON.stringify(user));

    console.log("Login response data:", response.data); // <- correct log
    return response.data; // <- return data only
  } catch (error) {
    console.error("Login error from frontend:", error); // <-- log full error
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Error signing in user";
    throw new Error(message);
  }
};

const addToCart = async (data, token) =>
  axiosClient
    .post("/user-carts", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((resp) => resp.data);

const getCartQuantity = async (userId, token) => {
  try {
    const response = await axiosClient.get(
      `/user-carts?filters[userId][$eq]= ${userId}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching cart Quantity:", error);
    throw error;
  }
};

const createOrder = async (data, token) => {
  try {
    console.log("Creating order with data:", data);
    if (!token) {
      throw new Error("Token is required to create an order");
    }
    const response = await axiosClient.post("/orders-details", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export default {
  getCategory,
  getSliders,
  getCategoryList,
  getProductList,
  getProductByCategory,
  registerUser,
  SignInUser,
  addToCart,
  getCartQuantity,
  createOrder,
  getProductByCategory,
};
