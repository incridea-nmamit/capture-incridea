import { useState, useEffect } from 'react';

/**
 * Type definition for breakpoint configuration object
 * Key: breakpoint width in pixels
 * Value: number of columns at that breakpoint
 */
type NonEmptyBreakpoints = Exclude<{ [key: number]: number }, { [key: number]: never }>;

/**
 * Custom hook to handle responsive column layouts
 * @param columnsBp - Object containing breakpoint-to-columns mapping
 * @returns {number} Current number of columns based on viewport width
 */
const useResponsiveColumns = (columnsBp: NonEmptyBreakpoints): number => {
  /**
   * Calculates number of columns based on viewport width
   * @param width - Current viewport width
   * @returns {number} Number of columns to display
   */
  const getColumns = (width: number): number => {
    const breakpoints = Object.keys(columnsBp)
      .map(Number)
      .sort((a, b) => a - b);

    let columns = columnsBp[breakpoints[0]!]!;
    for (const breakpoint of breakpoints) {
      if (width >= breakpoint) {
        columns = columnsBp[breakpoint]!;
      } else {
        break;
      }
    }
    return columns;
  };

  // Initialize state with current window width
  const [columns, setColumns] = useState<number>(getColumns(window.innerWidth));

  useEffect(() => {
    const handleResize = () => {
      setColumns(getColumns(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [columnsBp]);

  return columns;
};

export default useResponsiveColumns;
