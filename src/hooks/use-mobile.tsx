
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false); // Default to false (desktop)
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true); // Indicate component has mounted

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(mql.matches); // Use mql.matches directly
    };

    // Set initial state based on mql and listen for changes
    setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);

    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Before mount, return the default (false for isMobile). After mount, return the actual value.
  // This ensures server and first client render agree on `isMobile = false`.
  if (!hasMounted) {
    return false;
  }

  return isMobile;
}
