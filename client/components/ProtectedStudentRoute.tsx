import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { API } from "@/lib/studentApi";

export default function ProtectedStudentRoute({
  children,
}: {
  children: ReactNode;
}) {
  const [status, setStatus] = useState<
    "checking" | "authenticated" | "unauthenticated"
  >("checking");

  const location = useLocation();

  useEffect(() => {
    let active = true;

    fetch(`${API}/api/student-auth/me`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Session is not valid");
        }
        return response.json();
      })
      .then(() => {
        if (active) setStatus("authenticated");
      })
      .catch(() => {
        if (active) setStatus("unauthenticated");
      });

    return () => {
      active = false;
    };
  }, [location.pathname]);

  if (status === "checking") {
    return <div className="p-6 text-center">Checking student session...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <>{children}</>;
}
