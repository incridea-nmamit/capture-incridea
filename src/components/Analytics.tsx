import { useState } from "react";
import { api } from "~/utils/api";

const Analytics = () => {
  const [filter, setFilter] = useState<string>("all"); // State for filter
  const { data: logs = [], isLoading } = api.web.getAllLogs.useQuery(); // Use the getAllLogs query with a default empty array

  // Ensure logs data is loaded
  if (isLoading) return <div>Loading...</div>;

  // Access the environment variable
  const analyticsDatesEnv = process.env.NEXT_PUBLIC_ANALYTICS_DATES;

  // Convert the environment variable into a Record<string, Date>
  const dateReferences: Record<string, Date> = analyticsDatesEnv
    ? analyticsDatesEnv.split(",").reduce((acc, date, index) => {
        const dayKey = `day${index + 1}`; // day1, day2, day3
        acc[dayKey] = new Date(date.trim()); // Convert string to Date object
        return acc;
      }, {} as Record<string, Date>)
    : {};

  // Filter logs based on the selected day
  const filteredLogs =
  filter === "all"
    ? logs.filter(log => log.page_name === "/") // Filter only `/` page visits
    : logs.filter(log => {
        const logDate = new Date(log.date_time);
        const dateReferenceKey = `day${filter}`; // Removed the type assertion
        const dateReference = dateReferences[dateReferenceKey];
        
        // Match both the date and the page_name to `/`
        return (
          dateReference &&
          logDate.toDateString() === dateReference.toDateString() &&
          log.page_name === "/"
        );
      });

  // Calculate total visits and unique viewers
  const totalVisits = filteredLogs.length;
  const uniqueIPs = new Set(filteredLogs.map(entry => entry.ip_address)).size;

  return (
    <div className="p-6">
      <h1 className="text-center text-4xl font-bold mb-8 text-white">Analytics</h1>
      <div className="flex justify-center gap-2">
        <h2 className="text-center text-2xl mb-4 text-white">Web Analytics</h2>
        <div className="flex justify-center mb-4">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="ml-2 border border-gray-700 rounded-lg py-2 pl-3 pr-4 bg-black text-white"
          >
            <option value="all">All Days</option>
            <option value="1">Day 1</option>
            <option value="2">Day 2</option>
            <option value="3">Day 3</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
      <table className="min-w-full text-white">
        <thead className="text-left">
          <tr>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-4 border-b">Total Web Visits</td>
            <td className="py-2 px-4 border-b">{totalVisits/2}</td> {/* Divided by 2 for unknown double entry problem */}
          </tr>
          <tr>
            <td className="py-2 px-4 border-b">Total Unique Visitors</td>
            <td className="py-2 px-4 border-b">{uniqueIPs}</td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default Analytics;
