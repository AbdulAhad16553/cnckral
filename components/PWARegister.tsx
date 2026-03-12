// "use client";

// import { useEffect } from "react";

// const PWARegister = () => {
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     if (!("serviceWorker" in navigator)) return;

//     const registerServiceWorker = async () => {
//       try {
//         await navigator.serviceWorker.register("/service-worker.js");
//       } catch (error) {
//         console.error("Service worker registration failed:", error);
//       }
//     };

//     registerServiceWorker();
//   }, []);

//   return null;
// };

// export default PWARegister;

