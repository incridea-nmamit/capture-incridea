/**
 * Analytics Dashboard Component
 * Provides comprehensive analytics visualization with charts and data tables
 */

import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import { Bar, Doughnut, Line, Radar } from "react-chartjs-2";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
} from "chart.js";
import CameraLoading from "~/components/LoadingAnimation/CameraLoading";
import type { ChartData } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
);

// Add a monochrome palette near the top of the file
const monochromeColors = {
  line: {
    primary: 'rgba(255, 255, 255, 0.9)',
    secondary: 'rgba(200, 200, 200, 0.9)',
    tertiary: 'rgba(150, 150, 150, 0.9)',
    quaternary: 'rgba(100, 100, 100, 0.9)',
    background: 'rgba(255, 255, 255, 0.1)'
  },
  bar: {
    primary: 'rgba(255, 255, 255, 0.8)',
    hover: 'rgba(255, 255, 255, 0.9)'
  }
};

// Update the line chart styles
const lineChartBaseStyle = {
  borderWidth: 2,
  fill: true,
  tension: 0.4,
  pointBackgroundColor: 'rgba(255, 255, 255, 0.8)'
};

/**
 * Main Analytics component
 * Handles data fetching and visualization
 */
const Analytics = () => {
  // State management for filters and data
  const [filter, setFilter] = useState<string>("all");
  const [captureFilter, setCaptureFilter] = useState<string>("all");
  const [customDate, setCustomDate] = useState<string | null>(null);
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [selectedRoute, setSelectedRoute] = useState<string>("all");
  
  const router = useRouter();
  const { data: session, status } = useSession();

  // Hardcoded dates for Day 1, Day 2, and Day 3
  const dateReferences: Record<string, Date> = { 
    day1: new Date('2025-02-27'),
    day2: new Date('2025-02-28'),
    day3: new Date('2025-03-01'),
  };

  // API calls using the backend endpoints
  const { data: events = [], isLoading: eventsLoading } = api.events.getAllEvents.useQuery();
  const { data: users = [], isLoading: usersLoading } = api.user.getAllUsers.useQuery();
  const { data: verifiedusers = [], isLoading: verifiedUsersLoading } = api.user.getAllVerifiedUsers.useQuery();

  // Analytics data from backend
  const { data: analyticsSummary, isLoading: summaryLoading } = api.analytics.getAnalyticsSummary.useQuery({
    filter,
    customDate,
    dateReferences,
  });
  
  const { data: chartData, isLoading: chartLoading } = api.analytics.getChartData.useQuery({
    filter,
    customDate,
    dateReferences,
  });
  
  const { data: routeAnalytics, isLoading: routeLoading } = api.analytics.getRouteAnalytics.useQuery({
    filter,
    customDate,
    dateReferences,
    selectedRoute,
  });
  
  const { data: filteredRouteData, isLoading: routeDataLoading } = api.analytics.getFilteredRouteCounts.useQuery({
    filter,
    customDate,
    dateReferences,
    captureFilter,
  });
  
  const { data: eventData, isLoading: eventDataLoading } = api.analytics.getEventCounts.useQuery({
    filter,
    customDate,
    dateReferences,
    eventFilter,
  });
  
  const { data: galleryData, isLoading: galleryLoading } = api.analytics.getGalleryData.useQuery({
    filter,
    dateReferences,
  });
  
  const { data: downloadLogs = [], isLoading: downloadLogsLoading } = api.analytics.getDownloadLogs.useQuery({
    filter,
    customDate,
    dateReferences,
  });
  
  const { data: playbackLogs = [], isLoading: playbackLogsLoading } = api.analytics.getPlaybackLogs.useQuery({
    filter,
    customDate,
    dateReferences,
  });
  
  const { data: collegeStats, isLoading: collegeStatsLoading } = api.analytics.getCollegeAnalytics.useQuery({
    filter,
    customDate,
    dateReferences,
  });

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

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      void router.push('/');
    }
  }, [session, status, router]);

  // Formatting time values
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return { hours, minutes, seconds: secs };
  };

  const totalTimeFormatted = analyticsSummary 
    ? formatTime(analyticsSummary.totalTimeSpent)
    : { hours: 0, minutes: 0, seconds: 0 };
    
  const avgTimeFormatted = analyticsSummary 
    ? formatTime(analyticsSummary.averageTimeSpent)
    : { hours: 0, minutes: 0, seconds: 0 };

  // Chart configurations using backend data
  const avgTimeSpentGraphData = chartData ? {
    labels: chartData.timeSeriesData.map((data) => data.time),
    datasets: [
      {
        label: "Average Time Spent per Visit (s)",
        data: chartData.timeSeriesData.map((data) => data.avgTimeSpent),
        borderColor: monochromeColors.line.primary,
        backgroundColor: monochromeColors.line.background,
        ...lineChartBaseStyle
      },
    ],
  } : { labels: [], datasets: [] };

  const visitGraphData = chartData ? {
    labels: chartData.timeSeriesData.map((data) => data.time),
    datasets: [
      {
        label: "Total Visits",
        data: chartData.timeSeriesData.map((data) => data.visits),
        borderColor: monochromeColors.line.secondary,
        backgroundColor: monochromeColors.line.background,
        ...lineChartBaseStyle
      },
    ],
  } : { labels: [], datasets: [] };

  const uniqueGraphData = chartData ? {
    labels: chartData.timeSeriesData.map((data) => data.time),
    datasets: [
      {
        label: "Unique Visitors",
        data: chartData.timeSeriesData.map((data) => data.unique),
        borderColor: monochromeColors.line.tertiary,
        backgroundColor: monochromeColors.line.background,
        ...lineChartBaseStyle
      },
    ],
  } : { labels: [], datasets: [] };

  const viewsPerUniqueGraphData = chartData ? {
    labels: chartData.timeSeriesData.map((data) => data.time),
    datasets: [
      {
        label: "Total Views per Unique View",
        data: chartData.timeSeriesData.map((data) => data.viewsPerUnique),
        borderColor: monochromeColors.line.quaternary,
        backgroundColor: monochromeColors.line.background,
        ...lineChartBaseStyle
      },
    ],
  } : { labels: [], datasets: [] };

  const growthGraphData = chartData ? {
    labels: chartData.growthData.map((data) => data.time),
    datasets: [
      {
        label: "Cumulative Visits Growth",
        data: chartData.growthData.map((data) => data.cumulativeVisits),
        borderColor: monochromeColors.line.primary,
        backgroundColor: monochromeColors.line.background,
        ...lineChartBaseStyle
      },
    ],
  } : { labels: [], datasets: [] };
  
  // College analytics charts
  const collegeDistributionData = collegeStats ? {
    labels: ['Internal', 'External'],
    datasets: [{
      label: 'Users by College Type',
      data: [collegeStats.internal, collegeStats.external],
      backgroundColor: ['#B0B0B0', '#606060'], // Light gray, dark gray
      borderColor: ['#A0A0A0', '#505050'], // Slightly darker borders
      borderWidth: 1
    }]
  } : { labels: [], datasets: [] };

  const collegeEngagementData = collegeStats ? {
    labels: ['Downloads', 'Playback Views'],
    datasets: [
      {
        label: 'Internal College',
        data: [
          collegeStats.internalDownloads,
          collegeStats.internalPlaybackViews
        ],
        backgroundColor: monochromeColors.line.primary,
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 1
      },
      {
        label: 'External College',
        data: [
          collegeStats.externalDownloads,
          collegeStats.externalPlaybackViews
        ],
        backgroundColor: monochromeColors.line.tertiary,
        borderColor: 'rgba(200, 200, 200, 1)',
        borderWidth: 1
      }
    ]
  } : { labels: [], datasets: [] };

  // Route-specific analytics charts
  const hourlyTrafficData = routeAnalytics ? {
    labels: routeAnalytics.hourlyTraffic.map(item => `${item.hour}:00`),
    datasets: [{
      label: 'Visits per Hour',
      data: routeAnalytics.hourlyTraffic.map(item => item.count),
      backgroundColor: monochromeColors.bar.primary,
      hoverBackgroundColor: monochromeColors.bar.hover,
      borderColor: 'rgba(255, 255, 255, 1)',
      borderWidth: 1,
    }]
  } : { labels: [], datasets: [] };

  const deviceDistributionData = routeAnalytics ? {
    labels: routeAnalytics.deviceDistribution.map(item => item.device),
    datasets: [{
      label: 'Device Distribution',
      data: routeAnalytics.deviceDistribution.map(item => item.count),
      backgroundColor: ['#E0E0E0', '#B0B0B0', '#808080', '#505050'], // Monochrome grays
    }]
  } : { labels: [], datasets: [] };

  // Chart options
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

  const options = {
    plugins: {
      legend: {
        labels: {
          color: "#FFFFFF", // White text for legend
        },
      },
      tooltip: {
        titleColor: "#FFFFFF", // White tooltip title
        bodyColor: "#FFFFFF", // White tooltip text
      },
    },
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setCustomDate(selectedDate);
    setFilter("custom");
  };

  // Check if data is loading
  if (summaryLoading || chartLoading || routeLoading || galleryLoading || 
      eventsLoading || usersLoading || verifiedUsersLoading || 
      routeDataLoading || eventDataLoading || collegeStatsLoading) {
    return <CameraLoading />;
  }

  // Define default empty chart data
  const emptyBarChartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: []
  };

  const emptyLineChartData: ChartData<'line', number[], string> = {
    labels: [],
    datasets: []
  };

  const emptyPieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: []
  };

  const emptyDoughnutChartData: ChartData<'doughnut', number[], string> = {
    labels: [],
    datasets: []
  };

  return (
    <div className="p-6 mt-20 mb-20">
      <h1 className="text-center text-4xl font-Trap-Black mb-8 text-white">Detailed Admin Analytics</h1>
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
                  <option value="shaan">Shaan</option>
                  <option value="masalacoffee">Masala Coffee</option>
                  <option value="accolades">Accolades</option>
                  <option value="faculty">Faculty</option>
                  <option value="your-snaps">Your Snaps</option>
                  <option value="behindincridea">Behind Incridea</option>
                  <option value="our-team">Our Team</option>
                  <option value="about">About</option>
                </select>
              </td>
              <td className="p-2 text-center w-1/3">{filteredRouteData?.routeVisits || 0}</td>
              <td className="p-2 text-center w-1/3">{filteredRouteData?.uniqueRouteIDs || 0}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto mt-5 mb-5">
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
              <td className="p-2 text-center w-1/3">{eventData?.eventVisits || 0}</td>
              <td className="p-2 text-center w-1/3">{eventData?.uniqueEventIPs || 0}</td>              
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full text-white font-Trap-Regular">
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b">Total Users Logged</td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b">{users.length}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Total Verfied Users</td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b">{verifiedusers.length}</td>
            </tr>
            <tr>
              <td className="py-6"></td>
              <td className="py-6"></td>
              <td className="py-6"></td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Total Web Visits</td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b">{analyticsSummary?.totalVisits || 0}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Total Legitimate Visits ({'>'}10s)</td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b">{analyticsSummary?.legitimateVisits || 0}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Total Unique Visitors</td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b">{analyticsSummary?.uniqueVisitors || 0}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Total Time Spent</td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b">
                {totalTimeFormatted.hours} hours {totalTimeFormatted.minutes} minutes {totalTimeFormatted.seconds} seconds
              </td> 
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Average Time Spent</td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b">
                {avgTimeFormatted.hours} hours {avgTimeFormatted.minutes} minutes {avgTimeFormatted.seconds} seconds
              </td> 
            </tr>
            <tr>
              <td className="py-6"></td>
              <td className="py-6"></td>
              <td className="py-6"></td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Total Captures</td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b">{galleryData?.filteredGallery?.length || 0}</td> 
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Total Captures Downloads</td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b">{downloadLogs.length}</td> 
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Unique Captures Download ID's</td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b">{new Set(downloadLogs.map((entry) => entry.session_user)).size}</td> 
            </tr>
            <tr>
              <td className="py-6"></td>
              <td className="py-6"></td>
              <td className="py-6"></td>
            </tr>            
            <tr>
              <td className="py-6"></td>
              <td className="py-6"></td>
              <td className="py-6"></td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Total Playbacks</td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b">{galleryData?.filteredPlaybacks?.length || 0}</td> 
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Total Playbacks Downloads</td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b">{playbackLogs.length}</td> 
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Unique Playbacks Download ID's</td>
              <td className="py-2 px-4 border-b"></td>
              <td className="py-2 px-4 border-b">{new Set(playbackLogs.map((entry) => entry.session_user)).size}</td> 
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 place-items-center py-20 gap-20">
        {/* Bar Chart - Full Width */}
        <div className="col-span-1 md:col-span-2 w-full max-w-4xl">
          <Bar data={chartData?.chartData.barData || emptyBarChartData} options={options}/>
        </div>

        {/* Line Chart - Full Width */}
        <div className="col-span-1 md:col-span-2 w-full max-w-4xl">
          <Line data={chartData?.chartData.lineData || emptyLineChartData} />
        </div>

        {/* Pie Chart (Half Width) */}
        <div className="col-span-1 w-full max-w-sm">
          <Pie data={chartData?.chartData.pieData || emptyPieChartData} options={options}/>
        </div>

        {/* Doughnut Chart (Half Width) */}
        <div className="col-span-1 w-full max-w-sm">
          <Doughnut data={chartData?.chartData.doughnutData || emptyDoughnutChartData} />
        </div>
      </div>
      
      {/* Route-specific analytics */}
      <div className="mt-20 max-h-[1200px] overflow-y-auto">
        <h2 className="text-center text-3xl font-Trap-Black mb-8 text-white sticky top-0 py-4 z-10">
          Route-specific Analytics
        </h2>
        
        <div className="flex justify-center mb-8 sticky top-16 py-4 z-10">
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="border font-Trap-Regular border-gray-700 rounded-lg py-2 pl-3 pr-4 text-white"
          >
            <option value="all">Select Route</option>
            <option value="/">Home</option>
            <option value="captures">Captures</option>
            <option value="events">Events</option>
            <option value="shaan">Shaan</option>
            <option value="masalacoffee">Masala Coffee</option>
            <option value="accolades">Accolades</option>
            <option value="faculty">Faculty</option>
            <option value="your-snaps">Your Snaps</option>
            <option value="behindincridea">Behind Incridea</option>
            <option value="our-team">Our Team</option>
            <option value="about">About</option>
          </select>
        </div>

        {selectedRoute !== "all" && routeAnalytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
            {/* Stats Cards */}
            <div className="bg-gray-800 rounded-lg p-6 h-[400px] overflow-y-auto">
              <h3 className="text-xl text-white mb-4 sticky top-0 bg-gray-800 py-2">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400">Avg. Time Spent</p>
                  <p className="text-2xl text-white">
                    {Math.floor(routeAnalytics?.averageTimeSpent / 60)}m {Math.floor(routeAnalytics?.averageTimeSpent % 60)}s
                  </p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400">Bounce Rate</p>
                  <p className="text-2xl text-white">{routeAnalytics?.bounceRate.toFixed(1)}%</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400">User Retention</p>
                  <p className="text-2xl text-white">{routeAnalytics?.userRetention.toFixed(1)}%</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400">Peak Hours</p>
                  <p className="text-sm text-white">
                    {routeAnalytics?.peakHours.map(peak => `${peak.hour}:00 (${peak.count})`).join(', ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Hourly Traffic Chart */}
            <div className="bg-gray-800 rounded-lg p-6 h-[400px]">
              <h3 className="text-xl text-white mb-4 sticky top-0 bg-gray-800 py-2">Hourly Traffic</h3>
              <div className="h-[320px]">
                <Bar data={hourlyTrafficData} options={{
                  ...chartOptions,
                  maintainAspectRatio: false,
                  scales: {
                    ...chartOptions.scales,
                    y: {
                      beginAtZero: true,
                      ticks: { color: "white" }
                    }
                  }
                }} />
              </div>
            </div>

            {/* Device Distribution Chart */}
            <div className="bg-gray-800 rounded-lg p-6 h-[400px] md:col-span-2">
              <h3 className="text-xl text-white mb-4 sticky top-0 bg-gray-800 py-2">Device Distribution</h3>
              <div className="h-[320px]">
                <Doughnut 
                  data={deviceDistributionData} 
                  options={{
                    ...chartOptions,
                    maintainAspectRatio: false
                  }} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
