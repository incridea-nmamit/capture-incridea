import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import { Line } from "react-chartjs-2";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
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
import CameraLoading from "~/components/LoadingAnimation/CameraLoading";


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
  const [customDate, setCustomDate] = useState<string | null>(null);
  const [eventFilter, setEventFilter] = useState<string>("all");
  const { data: events = [], isLoading: eventsLoading } = api.events.getAllEvents.useQuery();
  const { data: logs = [], isLoading } = api.analytics.getAnalytics.useQuery();
  const { data: dlogs = [] } = api.download.getAllLogs.useQuery();
  const { data: gallery = [], isLoading: galleryLoading } = api.capture.getAllcaptures.useQuery();
  const [graphData, setGraphData] = useState<{ time: string; visits: number; unique: number; viewsPerUnique: number; avgTimeSpent: number }[]>([]);
  const [growthData, setGrowthData] = useState<{ time: string; cumulativeVisits: number }[]>([]);
  const router = useRouter();
  const { data: session, status } = useSession();
  
    useEffect(() => {
      if (status === 'unauthenticated') {
       void router.push('/unauthorized');
      }
      if (status === 'authenticated' && session?.user?.role === 'user') {
        void router.push('/unauthorized');
      }
      if (status === 'authenticated' && session?.user?.role !== 'admin') {
        void router.push('/unauthorized');
      }
      
    }, [session, status, router]);
  // Hardcoded dates for Day 1, Day 2, and Day 3
  const dateReferences: Record<string, Date> = {
    day1: new Date('2024-12-22'),
    day2: new Date('2024-12-23'),
    day3: new Date('2024-12-24'),
  };

  // Change to this during production
  // const dateReferences: Record<string, Date> = { 
  //   day1: new Date('2025-02-27'),
  //   day2: new Date('2025-02-28'),
  //   day3: new Date('2025-03-01'),
  // };

  const filteredLogs =
  filter === "all"
    ? logs.filter(
        (log) =>
          log.routePath.includes("/") &&
          log.isChecked === "yes" &&
          log.session_user !== "" &&
          log.session_user !== null
      )
    : filter === "custom" && customDate
    ? logs.filter((log) => {
        const logDate = new Date(log.startPing).toISOString().split("T")[0];
        return logDate === customDate;
      })
    : logs.filter((log) => {
        const logDate = new Date(log.startPing);
        const dateReferenceKey = `day${filter}`;
        const dateReference = dateReferences[dateReferenceKey];
        return (
          dateReference &&
          logDate.toDateString() === dateReference.toDateString() &&
          log.routePath.includes("/") &&
          log.session_user !== "" &&
          log.session_user !== null
        );
      });

      const filtereddLogs =
      filter === "all"
        ? dlogs.filter(
            (log) =>
              log.session_user !== "" &&
              log.session_user !== null
          )
          : filter === "custom" && customDate
          ? dlogs.filter((log) => {
              const logDate = new Date(log.date_time).toISOString().split("T")[0];
              return logDate === customDate;
            })
        : dlogs.filter((log) => {
            const logDate = new Date(log.date_time);
            const dateReferenceKey = `day${filter}`;
            const dateReference = dateReferences[dateReferenceKey];
            return (
              dateReference &&
              logDate.toDateString() === dateReference.toDateString() &&
              log.session_user !== "" &&
              log.session_user !== null
            );
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
      ? gallery
      : gallery.filter((galleryItem: any) => {
          const galleryItemDate = new Date(galleryItem.date_time);
          const dateReferenceKey = `day${filter}`;
          const dateReference = dateReferences[dateReferenceKey];
          return dateReference && galleryItemDate.toDateString() === dateReference.toDateString();
        });

  const filteredCaptures = captureFilter === "all"
    ? logs.filter((log) => {
        const logDate = new Date(log.startPing);
        const dateReferenceKey = `day${filter}`;
        const dateReference = dateReferences[dateReferenceKey];

        const validRoutes = [
          "pronite", 
          "your-snaps", 
          "our-team", 
          "about", 
          "events", 
          "/", 
          "behindincridea",
          "captures"
        ];

        const isValidRoute = validRoutes.some((route) => log.routePath.includes(route));

        return (
          isValidRoute && 
          (filter === "all" || logDate.toDateString() === dateReference?.toDateString()) &&
          log.isChecked === "yes"
        );
      })
    : logs.filter((log) => {
        const logDate = new Date(log.startPing);
        const dateReferenceKey = `day${filter}`;
        const dateReference = dateReferences[dateReferenceKey];

        if (captureFilter === "/") {
          return (
            log.routePath === "/" && 
            (filter === "all" || logDate.toDateString() === dateReference?.toDateString()) &&
            log.isChecked === "yes"
          );
        }
        if (captureFilter === "captures") {
          return (
            log.routePath === "/captures" &&
            (filter === "all" || logDate.toDateString() === dateReference?.toDateString()) &&
            log.isChecked === "yes"
          );
        }

        if (captureFilter === "events") {
          return (
            log.routePath === "/captures/events" &&
            (filter === "all" || logDate.toDateString() === dateReference?.toDateString()) &&
            log.isChecked === "yes"
          );
        }

        return (
          log.routePath.includes(captureFilter) &&
          (filter === "all" || logDate.toDateString() === dateReference?.toDateString()) &&
          log.isChecked === "yes"
        );
    });

  const routeVisits = filteredCaptures.length;
  const uniqueRouteIDs = new Set(filteredCaptures.filter(log => log.isChecked === "yes").map((entry) => entry.session_user)).size;

  const filteredEvents = eventFilter === "all"
    ? logs.filter((log) => {
        const logDate = new Date(log.startPing);
        const dateReferenceKey = `day${filter}`;
        const dateReference = dateReferences[dateReferenceKey];
        return (
          log.routePath.startsWith("/captures/events") && 
          (filter === "all" || logDate.toDateString() === dateReference?.toDateString())
        );
      })
    : logs.filter((log) => {
        const logDate = new Date(log.startPing);
        const dateReferenceKey = `day${filter}`;
        const dateReference = dateReferences[dateReferenceKey];
        return (
          log.routePath === `/captures/events/${eventFilter}` && 
          (filter === "all" || logDate.toDateString() === dateReference?.toDateString())
        );
      });

  const eventVisits = filteredEvents.length;
  const uniqueEventIPs = new Set(filteredEvents.map((entry) => entry.session_user)).size;

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
        acc[combinedKey].uniqueIPs.add(log.session_user);
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
        borderColor: "rgba(255, 159, 64, 1)",
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
        borderColor: "rgba(54, 162, 235, 1)",
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
      tooltip: { backgroundColor: "rgba(0, 0, 0, 0.7)", titleColor: "#fff", bodyColor: "#fff" },
    },
    scales: {
      x: { ticks: { color: "white" } },
      y: { ticks: { color: "white" } },
    },
  };
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setCustomDate(selectedDate);
    setFilter("custom");
  };

  if (isLoading || galleryLoading || eventsLoading) {
    return <CameraLoading />;
  }


  return (
    <div className="p-6 mb-20">
      <h1 className="text-center text-4xl font-Teknaf mb-8 text-white">Detailed Admin Analytics</h1>
      <div className="flex justify-center gap-2">
        <div className="flex justify-center mb-4 ">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="ml-2 border font-Trap-Regular border-gray-700 rounded-lg py-2 pl-3 pr-4 bg-neutral-950 text-white"
          >
            <option value="all">All Days</option>
            <option value="1">Day 1</option>
            <option value="2">Day 2</option>
            <option value="3">Day 3</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>
      <div className="flex justify-center gap-2">
        <div className="flex justify-center mb-4">
          {filter === "custom" && (
            <input
              type="date"
              value={customDate || ""}
              onChange={handleDateChange}
              className="mt-4 border font-Trap-Regular border-gray-700 rounded-lg py-2 px-4 bg-neutral-950 text-white"
            />
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-white font-Trap-Regular">
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b">Total Web Visits</td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b">{filteredLogs.length}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Total Unique Visitors</td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b">{new Set(filteredLogs.map((entry) => entry.session_user)).size}</td>
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
            <tr>
              <td className="py-2 px-4 border-b">Total Downloads</td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b">{filtereddLogs.length}</td> 
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Unique Download ID's</td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b">{new Set(filtereddLogs.map((entry) => entry.session_user)).size}</td> 
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="overflow-x-auto mt-5 font-Trap-Regular">
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
                  className="border font-Trap-Regular border-gray-700 rounded-lg py-2 pl-3 pr-4 bg-neutral-950 text-white"
                >
                  <option value="all">All Routes</option>
                  <option value="/">Home</option>
                  <option value="captures">Captures</option>
                  <option value="events">Events</option>
                  <option value="pronite">Pronite</option>
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
        <table className="min-w-full text-white font-Trap-Regular">
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
                  className="border font-Trap-Regular border-gray-700 rounded-lg py-2 pl-3 pr-4 bg-neutral-950 text-white"
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
      <div className="mt-20 w-full h-56 mx-auto p-4 rounded-2xl font-Trap-Regular">
        <h3 className="text-center text-2xl text-white mb-4">Visits Growth Rate</h3>
        <Line data={growthGraphData} options={chartOptions} />
      </div>

      <div className="mt-20 w-full h-56 mx-auto p-4 rounded-2xl font-Trap-Regular">
        <h3 className="text-center text-2xl text-white mb-4">Average Time Spent per Visit</h3>
        <Line data={avgTimeSpentGraphData} options={chartOptions} />
      </div>

      <div className="mt-20 w-full h-56 mx-auto p-4 rounded-2xl font-Trap-Regular">
        <h3 className="text-center text-2xl text-white mb-4">Total Visits Over Time</h3>
        <Line data={visitGraphData} options={chartOptions} />
      </div>

      <div className="mt-20 w-full h-56 mx-auto p-4 rounded-2xl font-Trap-Regular">
        <h3 className="text-center text-2xl text-white mb-4">Unique Visitors Over Time</h3>
        <Line data={uniqueGraphData} options={chartOptions} />
      </div>

      <div className="mt-20 w-full h-56 mx-auto p-4 rounded-2xl font-Trap-Regular">
        <h3 className="text-center text-2xl text-white mb-4">Views per Unique Visitor Over Time</h3>
        <Line data={viewsPerUniqueGraphData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Analytics;
