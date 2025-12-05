// src/routes/index.jsx
import publicRoutes from "./publicRoutes";
import privateRoutes from "./privateRoutes";

// Combine all routes
const allRoutes = [...publicRoutes, ...privateRoutes];

export { publicRoutes, privateRoutes };
export default allRoutes;
