export const MODE = "development";

// Get the IP or hostname dynamically from window.location
const ipA = window.location.hostname || "localhost";

// Dynamically set host based on window location
export const host = `http://${ipA}:5000/api`;

console.log("Dynamic host set to:", host);
