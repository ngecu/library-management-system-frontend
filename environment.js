export const MODE = "development";

// Get the IP or hostname dynamically from window.location
// const ipA = "192.168.0.100";
const ipA = "localhost";
// http://192.168.1.102:5173/
// Dynamically set host based on window location
export const host = `http://${ipA}:5000/api`;

console.log("Dynamic host set to:", host);
