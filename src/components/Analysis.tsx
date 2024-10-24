import { useState } from "react";
import { api } from "~/utils/api";

const Analysis = () => {
  const [filter, setFilter] = useState<string>("all"); // State for filter
  const { data: logs = [], isLoading } = api.web.getAllLogs.useQuery(); // Use the getAllLogs query with a default empty array

  // Ensure logs data is loaded
  if (isLoading) return <div>Loading...</div>;

  // Access the environment variable
  const analysisDatesEnv = process.env.NEXT_PUBLIC_ANALYSIS_DATES;

  // Convert the environment variable into a Record<string, Date>
  const dateReferences: Record<string, Date> = analysisDatesEnv
    ? analysisDatesEnv.split(",").reduce((acc, date, index) => {
        const dayKey = `day${index + 1}`; // day1, day2, day3
        acc[dayKey] = new Date(date.trim()); // Convert string to Date object
        return acc;
      }, {} as Record<string, Date>)
    : {};

  // Filter logs based on the selected day
  const filteredLogs =
    filter === "all"
      ? logs
      : logs.filter(log => {
          const logDate = new Date(log.date_time);
          const dateReferenceKey = `day${filter}` as keyof typeof dateReferences; // Ensure correct type
          const dateReference = dateReferences[dateReferenceKey]; // Access date reference

          // Check if dateReference is defined before comparing dates
          return dateReference && logDate.toDateString() === dateReference.toDateString();
        });

  // Calculate total visits and unique viewers
  const totalVisits = filteredLogs.length;
  const uniqueIPs = new Set(filteredLogs.map(entry => entry.ip_address)).size;

  return (
    <div className="analysis-container">
      <h1 className="text-3xl font-bold">Analysis</h1>
      <h2 className="text-xl">Web Analysis</h2>

      <div className="filter-container">
        <span>Filter:</span>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Days</option>
          <option value="1">Day 1</option>
          <option value="2">Day 2</option>
          <option value="3">Day 3</option>
        </select>
      </div>

      <div className="results">
        <p>Total website visits: {totalVisits/2}</p> {/* Divided by 2 for unknown double entry problem */}
        <p>Total unique viewers: {uniqueIPs}</p>
      </div>
    </div>
  );
};

export default Analysis;
