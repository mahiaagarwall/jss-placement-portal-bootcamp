import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCompany } from "@/context/CompanyContext";

/** Route guard: returns the selected company (restored from localStorage).
 *  If none is selected, sends the visitor to "/" — never to NotFound. */
export function useSelectedCompany() {
  const { selected } = useCompany();
  const navigate = useNavigate();
  useEffect(() => {
    if (!selected) navigate("/", { replace: true });
  }, [selected, navigate]);
  return selected;
}
