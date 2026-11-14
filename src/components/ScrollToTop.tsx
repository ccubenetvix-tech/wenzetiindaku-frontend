import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Start every new page (including a new ?category= or ?q= search) at the top.
export default function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
}
