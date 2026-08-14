import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";

import { Link, useLocation } from "react-router-dom";

export default function AppBreadcrumbs() {
  const location = useLocation();

  const parts = location.pathname.split("/").filter(Boolean);

  return (
    <Breadcrumbs sx={{ mb: 3 }}>
      <Link to="/dashboard">Dashboard</Link>

      {parts.map((part, index) => {
        const path = "/" + parts.slice(0, index + 1).join("/");

        const last = index === parts.length - 1;

        return last ? (
          <Typography key={path}>{part}</Typography>
        ) : (
          <Link key={path} to={path}>
            {part}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
