// utils/adminAuth.js
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET_KEY = "aayush"; // change this to a strong secret

// Set JWT token in cookie after login
export function setAdminSession(res, adminData) {
  const token = jwt.sign(adminData, SECRET_KEY, { expiresIn: "1h" });
  res.setHeader(
    "Set-Cookie",
    `admin_token=${token}; HttpOnly; Path=/; Max-Age=3600`
  );
  return token;
}

// Get session from cookies
export function getAdminSession() {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) return null;

  try {
    const session = jwt.verify(token, SECRET_KEY);
    return session; // returns admin data if valid
  } catch (err) {
    return null; // invalid token
  }
}

// Logout admin
export function clearAdminSession(res) {
  res.setHeader("Set-Cookie", `admin_token=; HttpOnly; Path=/; Max-Age=0`);
}
