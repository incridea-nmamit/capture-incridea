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
import { useQueries } from "@tanstack/react-query";

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
  const [filter, setFilter] = useState<string>("all");
  const [captureFilter, setCaptureFilter] = useState<string>("all");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const { data: events = [], isLoading: eventsLoading } = api.events.getAllEvents.useQuery();
  const { data: logs = [], isLoading } = api.analytics.getAnalytics.useQuery();
  const { data: gallery = [], isLoading:galleryLoading } = api.gallery.getAllGallery.useQuery();
  const [graphData, setGraphData] = useState<{ time: string; visits: number; unique: number; viewsPerUnique: number; avgTimeSpent: number }[]>([]);
  const [growthData, setGrowthData] = useState<{ time: string; cumulativeVisits: number }[]>([]);

  const analyticsDatesEnv = process.env.NEXT_PUBLIC_ANALYTICS_DATES;
  const dateReferences: Record<string, Date> = analyticsDatesEnv
    ? analyticsDatesEnv.split(",").reduce((acc, date, index) => {
        const dayKey = `day${index + 1}`;
        acc[dayKey] = new Date(date.trim());
        return acc;
      }, {} as Record<string, Date>)
    : {};

    const queries = useQueries({
      queries: Array.from({ length: 3 }, (_, i) => ({
        queryKey: ['variable', `Day-${i + 1}`],
        queryFn: () => api.variable.getVariable.useQuery({ key: `Day-${i + 1}` }),
      })),
    });

  // Filter and calculate analytics
  const filteredLogs =
    filter === "all"
      ? logs.filter((log) => log.routePath.includes("/"))
      : logs.filter((log) => {
          const logDate = new Date(log.startPing);
          const time = log.timer;
          const dateReferenceKey = `day${filter}`;
          const dateReference = dateReferences[dateReferenceKey];
          return dateReference && logDate.toDateString() === dateReference.toDateString() && log.routePath.includes("/");
        });
      const totalTimeSpent = filteredLogs.reduce((total, log) => total + (log.timer || 0), 0);
      const averageTimeSpent = filteredLogs.length > 0 ? totalTimeSpent / filteredLogs.length : 0;
      const hours = Math.floor(averageTimeSpent / 3600);
      const minutes = Math.floor((averageTimeSpent % 3600) / 60);
      const seconds = Math.floor(averageTimeSpent % 60);
      const thours = Math.floor(totalTimeSpent / 3600);
      const tminutes = Math.floor((totalTimeSpent % 3600) / 60);
      const tseconds = Math.floor(totalTimeSpent % 60);
    const filteredGallery =
    filter === "all"
      ? gallery // If no filter is selected, fetch all gallery entries
      : gallery.filter((galleryItem) => {
          const galleryItemDate = new Date(galleryItem.date_time); // Assuming each gallery item has a `date_time` field
          const dateReferenceKey = `day${filter}`;
          const dateReference = dateReferences[dateReferenceKey];
          return dateReference && galleryItemDate.toDateString() === dateReference.toDateString();
        });

    // Filter capture data based on captureFilter and selected day
    // Assuming captureFilter and logs are defined elsewhere

    const filteredCaptures = captureFilter === "all"
    ? logs.filter((log) => {
        const logDate = new Date(log.startPing);
        const dateReferenceKey = `day${filter}`;
        const dateReference = dateReferences[dateReferenceKey];
  
        // Define a list of valid route paths to check
        const validRoutes = [
          "pronight", 
          "your-snaps", 
          "our-team", 
          "about", 
          "events", 
          "/", 
          "behindincridea",
          "captures"
        ];
  
        // Check if the routePath matches any of the valid routes
        const isValidRoute = validRoutes.some((route) => log.routePath.includes(route));
  
        return (
          isValidRoute && // Ensure the routePath matches
          (filter === "all" || logDate.toDateString() === dateReference?.toDateString()) && // Check date filter
          log.isChecked // Ensure the log is checked
        );
      })
    : logs.filter((log) => {
        const logDate = new Date(log.startPing);
        const dateReferenceKey = `day${filter}`;
        const dateReference = dateReferences[dateReferenceKey];
  
        // Adjust conditions for "Home" and "Events"
        if (captureFilter === "/") {
          return (
            log.routePath === "/" && // Only matches "/" route
            (filter === "all" || logDate.toDateString() === dateReference?.toDateString()) &&
            log.isChecked
          );
        }
        if (captureFilter === "captures") {
          return (
            log.routePath === "/captures" && // Only matches "/" route
            (filter === "all" || logDate.toDateString() === dateReference?.toDateString()) &&
            log.isChecked
          );
        }
  
        if (captureFilter === "events") {
          return (
            log.routePath === "/captures/events" && // Only matches "/events" route
            (filter === "all" || logDate.toDateString() === dateReference?.toDateString()) &&
            log.isChecked
          );
        }
  
        // General filter for other routes
        return (
          log.routePath.includes(captureFilter) && // Ensure the routePath includes captureFilter
          (filter === "all" || logDate.toDateString() === dateReference?.toDateString()) && // Check date filter
          log.isChecked // Ensure the log is checked
        );
    }); 

  
  const routeVisits = filteredCaptures.length;
  const uniqueRouteIDs = new Set(filteredCaptures.filter(log => log.isChecked).map((entry) => entry.cookie_id)).size;
  

  // Filter event data based on eventFilter and selected day
  const filteredEvents = eventFilter === "all"
  ? logs.filter((log) => {
      const logDate = new Date(log.startPing);
      const dateReferenceKey = `day${filter}`;
      const dateReference = dateReferences[dateReferenceKey];
      return (
        log.routePath.startsWith("/captures/events") && // Ensure route starts with "/events/"
        (filter === "all" || logDate.toDateString() === dateReference?.toDateString())
      );
    })
  : logs.filter((log) => {
      const logDate = new Date(log.startPing);
      const dateReferenceKey = `day${filter}`;
      const dateReference = dateReferences[dateReferenceKey];
      return (
        log.routePath===`/captures/events/${eventFilter}` && // Match exact route for the selected event
        (filter === "all" || logDate.toDateString() === dateReference?.toDateString())
      );
    });


  const eventVisits = filteredEvents.length;
  const uniqueEventIPs = new Set(filteredEvents.map((entry) => entry.cookie_id)).size;

  useEffect(() => {
    const visitData = filteredLogs.reduce<{ [key: string]: { visits: number; uniqueIPs: Set<string>; totalTime: number } }>(
      (acc, log) => {
        const dateObj = new Date(log.startPing);
        const dateKey = dateObj.toLocaleDateString([], { month: "short", day: "numeric" });
        const timeKey = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const combinedKey = `${dateKey} ${timeKey}`;

        if (!acc[combinedKey]) {
          acc[combinedKey] = { visits: 0, uniqueIPs: new Set(), totalTime: 0 };
        } 

        acc[combinedKey].visits += 1;
        acc[combinedKey].uniqueIPs.add(log.cookie_id);
        acc[combinedKey].totalTime += log.timer ?? 0;

        return acc;
      },
      {}
    );

    const timeSeriesData = Object.entries(visitData).map(([time, data]) => ({
      time,
      visits: data.visits,
      unique: data.uniqueIPs.size,
      viewsPerUnique: data.uniqueIPs.size ? data.visits / data.uniqueIPs.size : 0,
      avgTimeSpent: data.visits > 0 ? data.totalTime / data.visits : 0, 
    }));

    setGraphData(timeSeriesData);

    // Calculate cumulative visits for growth rate chart
    let cumulativeVisits = 0;
    const growthSeriesData = timeSeriesData.map((data) => {
      cumulativeVisits += data.visits;
      return { time: data.time, cumulativeVisits };
    });

    setGrowthData(growthSeriesData);
  }, [filteredLogs]);

  const avgTimeSpentGraphData = {
    labels: graphData.map((data) => data.time),
    datasets: [
      {
        label: "Average Time Spent per Visit (s)",
        data: graphData.map((data) => data.avgTimeSpent),
        borderColor: "rgba(255, 159, 64, 1)", // Orange color
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        fill: true,
      },
    ],
  };

  const visitGraphData = {
    labels: graphData.map((data) => data.time),
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

  const uniqueGraphData = {
    labels: graphData.map((data) => data.time),
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

  const viewsPerUniqueGraphData = {
    labels: graphData.map((data) => data.time),
    datasets: [
      {
        label: "Total Views per Unique View",
        data: graphData.map((data) => data.viewsPerUnique),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
      },
    ],
  };

  const growthGraphData = {
    labels: growthData.map((data) => data.time),
    datasets: [
      {
        label: "Cumulative Visits Growth",
        data: growthData.map((data) => data.cumulativeVisits),
        borderColor: "rgba(54, 162, 235, 1)", // Blue color
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
    ],
  };

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

  if (isLoading || eventsLoading || galleryLoading) return <div>Loading...</div>;

  return (
    <div className="p-6 mb-20">
      <h1 className="text-center text-6xl font-Hunters mb-8 text-white">Detailed Admin Analytics</h1>
      <div className="flex justify-center gap-2">
        <div className="flex justify-center mb-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="ml-2 border font-BebasNeue border-gray-700 rounded-lg py-2 pl-3 pr-4 bg-black text-white"
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
              <td className="py-2 px-4 border-b">{filteredLogs.length}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Total Unique Visitors</td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b">{new Set(filteredLogs.map((entry) => entry.cookie_id)).size}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Total Time Spent</td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b">{thours} hours {tminutes} minutes {tseconds} seconds</td> 
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Average Time Spent</td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b">{hours} hours {minutes} minutes {seconds} seconds</td> 
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Total Captures</td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b">{filteredGallery.length}</td> 
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="overflow-x-auto mt-5">
        <table className="min-w-full text-white">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-2 w-1/3">Routes</th>
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
                  className="border  font-BebasNeue border-gray-700 rounded-lg py-2 pl-3 pr-4 bg-black text-white"
                >
                  <option value="all">All Routes</option>
                  <option value="/">Home</option>
                  <option value="captures">Captures</option>
                  <option value="events">Events</option>
                  <option value="pronight">Pronight</option>
                  <option value="your-snaps">Your Snaps</option>
                  <option value="behindincridea">Behind Incridea</option>
                  <option value="our-team">Our Team</option>
                  <option value="about">About</option>
                  
                  
                </select>
              </td>
              <td className="p-2 text-center w-1/3">{routeVisits}</td>
              <td className="p-2 text-center w-1/3">{uniqueRouteIDs}</td>
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
                  className="border  font-BebasNeue border-gray-700 rounded-lg py-2 pl-3 pr-4 bg-black text-white"
                >
                  <option value="all">All Events</option>
                  {events.map((event) => {
                    const formattedEventName = event.name.split(' ').join('-'); // Split by space and join with hyphen
                    return (
                      <option key={event.id} value={formattedEventName}>
                        {formattedEventName}
                      </option>
                    );
                  })}
                </select>
              </td>
              <td className="p-2 text-center w-1/3">{eventVisits}</td>
              <td className="p-2 text-center w-1/3">{uniqueEventIPs}</td>              
            </tr>
          </tbody>
        </table>
        </div>

      <div className="mt-20 w-full h-56 mx-auto bg-black p-4 rounded-2xl">
        <h3 className="text-center text-2xl text-white mb-4">Visits Growth Rate</h3>
        <Line data={growthGraphData} options={chartOptions} />
      </div>

      <div className="mt-20 w-full h-56 mx-auto bg-black p-4 rounded-2xl">
        <h3 className="text-center text-2xl text-white mb-4">Average Time Spent per Visit</h3>
        <Line data={avgTimeSpentGraphData} options={chartOptions} />
      </div>

      <div className="mt-20 w-full h-56 mx-auto bg-black p-4 rounded-2xl">
        <h3 className="text-center text-2xl text-white mb-4">Total Visits Over Time</h3>
        <Line data={visitGraphData} options={chartOptions} />
      </div>

      <div className="mt-20 w-full h-56 mx-auto bg-black p-4 rounded-2xl">
        <h3 className="text-center text-2xl text-white mb-4">Unique Visitors Over Time</h3>
        <Line data={uniqueGraphData} options={chartOptions} />
      </div>

      <div className="mt-20 w-full h-56 mx-auto bg-black p-4 rounded-2xl">
        <h3 className="text-center text-2xl text-white mb-4">Views per Unique Visitor Over Time</h3>
        <Line data={viewsPerUniqueGraphData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Analytics;
