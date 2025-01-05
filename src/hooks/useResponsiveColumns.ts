import { useState, useEffect } from 'react';

type NonEmptyBreakpoints = Exclude<{ [key: number]: number }, { [key: number]: never }>; // Disallow empty object

const useResponsiveColumns = (columnsBp: NonEmptyBreakpoints): number => {
  const getColumns = (width: number): number => {

    const breakpoints = Object.keys(columnsBp)
      .map(Number)
      .sort((a, b) => a - b);

    let columns = columnsBp[breakpoints[0]!]!; // Default to the smallest breakpoint
    for (const breakpoint of breakpoints) {
      if (width >= breakpoint) {
        columns = columnsBp[breakpoint]!;
      } else {
        break;
      }
    }
    return columns;
  };

  const [columns, setColumns] = useState<number>(getColumns(window.innerWidth));

  useEffect(() => {
    const handleResize = () => {
      setColumns(getColumns(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call to set columns based on current width

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [columnsBp]);

  return columns;
};

export default useResponsiveColumns;
