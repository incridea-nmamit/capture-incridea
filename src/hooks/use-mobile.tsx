import * as React from "react";

/** Breakpoint for mobile devices in pixels */
const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook to detect if the current viewport is mobile
 * @returns {boolean} True if viewport width is less than mobile breakpoint
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // Create media query list
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    /**
     * Handler for media query changes
     */
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Add listener and set initial value
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Cleanup listener on unmount
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
