import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [filter, setFilter] = useState<string>("all"); // State for filter
  const [captureFilter, setCaptureFilter] = useState<string>("all"); // State for capture filter
  const [eventFilter, setEventFilter] = useState<string>("all"); // State for event filter
  const { data: events = [], isLoading: eventsLoading } = api.events.getAllEvents.useQuery(); // Fetch events
  const { data: logs = [], isLoading } = api.web.getAllLogs.useQuery(); // Use the getAllLogs query with a default empty array
  const [graphData, setGraphData] = useState<{ time: string; visits: number; unique: number; viewsPerUnique: number }[]>([]);

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

  // Filter capture data based on captureFilter and selected day
  const filteredCaptures = captureFilter === "all"
    ? logs.filter((log) => {
        const logDate = new Date(log.date_time);
        const dateReferenceKey = `day${filter}`;
        const dateReference = dateReferences[dateReferenceKey];
        return (
          (log.page_name.includes("pronight") ||
            log.page_name.includes("your-snaps") ||
            log.page_name.includes("behindincridea")) &&
          (filter === "all" || logDate.toDateString() === dateReference?.toDateString())
        );
      })
    : logs.filter((log) => {
        const logDate = new Date(log.date_time);
        const dateReferenceKey = `day${filter}`;
        const dateReference = dateReferences[dateReferenceKey];
        return (
          log.page_name.includes(captureFilter) &&
          (filter === "all" || logDate.toDateString() === dateReference?.toDateString())
        );
      });

  const captureVisits = filteredCaptures.length;
  const uniqueCaptureIPs = new Set(filteredCaptures.map((entry) => entry.ip_address)).size;

  // Filter event data based on eventFilter and selected day
  const filteredEvents = eventFilter === "all"
    ? logs.filter((log) => {
        const logDate = new Date(log.date_time);
        const dateReferenceKey = `day${filter}`;
        const dateReference = dateReferences[dateReferenceKey];
        return (
          log.page_name.includes("event") &&
          (filter === "all" || logDate.toDateString() === dateReference?.toDateString())
        );
      })
    : logs.filter((log) => {
        const logDate = new Date(log.date_time);
        const dateReferenceKey = `day${filter}`;
        const dateReference = dateReferences[dateReferenceKey];
        return (
          log.page_name.includes(eventFilter) &&
          (filter === "all" || logDate.toDateString() === dateReference?.toDateString())
        );
      });

  const eventVisits = filteredEvents.length;
  const uniqueEventIPs = new Set(filteredEvents.map((entry) => entry.ip_address)).size;



  // Filter logs based on the selected day
  const filteredLogs =
    filter === "all"
      ? logs.filter((log) => log.page_name === "/") // Filter only `/` page visits
      : logs.filter((log) => {
          const logDate = new Date(log.date_time);
          const dateReferenceKey = `day${filter}`;
          const dateReference = dateReferences[dateReferenceKey];
          return (
            dateReference &&
            logDate.toDateString() === dateReference.toDateString() &&
            log.page_name === "/"
          );
        });

  // Calculate total visits and unique viewers
  const totalVisits = filteredLogs.length;
  const uniqueIPs = new Set(filteredLogs.map((entry) => entry.ip_address)).size;

  // Process data for graphs
  useEffect(() => {
    const visitData = filteredLogs.reduce<{ [key: string]: { visits: number; uniqueIPs: Set<string> } }>(
      (acc, log) => {
        const dateObj = new Date(log.date_time);
        const dateKey = dateObj.toLocaleDateString([], { month: "short", day: "numeric" }); // Exclude the year
        const timeKey = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // Exclude seconds
        const combinedKey = `${dateKey} ${timeKey}`; // Combine date and time without year and seconds
  
        if (!acc[combinedKey]) {
          acc[combinedKey] = { visits: 0, uniqueIPs: new Set() };
        }
        acc[combinedKey].visits += 1;
        acc[combinedKey].uniqueIPs.add(log.ip_address);
        return acc;
      },
      {}
    );
  
    const timeSeriesData = Object.entries(visitData).map(([time, data]) => ({
      time,
      visits: data.visits,
      unique: data.uniqueIPs.size,
      viewsPerUnique: data.uniqueIPs.size ? data.visits / data.uniqueIPs.size : 0, // Calculate the ratio
    }));
  
    setGraphData(timeSeriesData);
  }, [filteredLogs]);
  

  // Define data for "Total Visits Over Time" graph
  const visitGraphData = {
    labels: graphData.map((data) => data.time), // Display both date and time
    datasets: [
      {
        label: "Total Visits",
        data: graphData.map((data) => data.visits),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  // Define data for "Unique Visitors Over Time" graph
  const uniqueGraphData = {
    labels: graphData.map((data) => data.time), // Display both date and time
    datasets: [
      {
        label: "Unique Visitors",
        data: graphData.map((data) => data.unique),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  };

  // Define data for "Total Views per Unique View" graph
  const viewsPerUniqueGraphData = {
    labels: graphData.map((data) => data.time), // Display both date and time
    datasets: [
      {
        label: "Total Views per Unique View",
        data: graphData.map((data) => data.viewsPerUnique),
        borderColor: "rgba(153, 102, 255, 1)", // Purple color for the line
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, labels: { color: "white" } },
      tooltip: { backgroundColor: "rgba(0, 0, 0, 0.8)", titleColor: "white", bodyColor: "white" },
    },
    scales: {
      x: { 
        ticks: { 
          color: "white",
          autoSkip: true, 
          maxRotation: 90, 
          minRotation: 45,
        }, 
        grid: { display: false } 
      },
      y: { ticks: { color: "white" }, grid: { color: "rgba(255, 255, 255, 0.1)" } },
    },
  };

  if (isLoading || eventsLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-center text-6xl font-Hunters mb-8 text-white">Analytics</h1>
      <div className="flex justify-center gap-2">
        <h2 className="text-center text-2xl mb-4 text-white">Web Analytics</h2>
        <div className="flex justify-center mb-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
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
              <th className="py-2 px-4 border-b"></th>
              <th className="py-2 px-4 border-b">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b">Total Web Visits</td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b">{totalVisits}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Total Unique Visitors</td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b">{uniqueIPs}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto mt-5">
        <table className="min-w-full text-white">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-2 w-1/3">Captures</th>
              <th className="p-2 w-1/3">Total Visits</th>
              <th className="p-2 w-1/3">Unique Visitors</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 text-center w-1/3">
                <select
                  value={captureFilter}
                  onChange={(e) => setCaptureFilter(e.target.value)}
                  className="border border-gray-700 rounded-lg py-2 pl-3 pr-4 bg-black text-white"
                >
                  <option value="all">All Captures</option>
                  <option value="pronight">Pronight</option>
                  <option value="your-snaps">Your Snaps</option>
                  <option value="behindincridea">Behind Incridea</option>
                </select>
              </td>
              <td className="p-2 text-center w-1/3">{captureVisits}</td>
              <td className="p-2 text-center w-1/3">{uniqueCaptureIPs}</td>
            </tr>
          </tbody>
        </table>
        </div>

        <div className="overflow-x-auto mt-5">
        <table className="min-w-full text-white">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-2 w-1/3">Events</th>
              <th className="p-2 w-1/3">Total Visits</th>
              <th className="p-2 w-1/3">Unique Visitors</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 text-center w-1/3">
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className="border border-gray-700 rounded-lg py-2 pl-3 pr-4 bg-black text-white"
                >
                  <option value="all">All Events</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.name}>
                      {event.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-2 text-center w-1/3">{eventVisits}</td>
              <td className="p-2 text-center w-1/3">{uniqueEventIPs}</td>              
            </tr>
          </tbody>
        </table>
        </div>

      {/* Line chart for Total Visits */}
      <div className="mt-20 w-full h-56 mx-auto bg-black p-4 rounded-2xl">
        <h3 className="text-center text-2xl text-white mb-4">Total Visits Over Time</h3>
        <Line className="bg-black" data={visitGraphData} options={chartOptions} />
      </div>

      {/* Line chart for Unique Visitors */}
      <div className="mt-20 w-full h-56 mx-auto bg-black p-4 rounded-2xl">
        <h3 className="text-center text-2xl text-white mb-4">Unique Visitors Over Time</h3>
        <Line className="bg-black" data={uniqueGraphData} options={chartOptions} />
      </div>

      {/* Line chart for Total Views per Unique View */}
      <div className="mt-20 w-full h-56 mx-auto bg-black p-4 rounded-2xl">
        <h3 className="text-center text-2xl text-white mb-4">Total Views per Unique View Over Time</h3>
        <Line className="bg-black" data={viewsPerUniqueGraphData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Analytics;
