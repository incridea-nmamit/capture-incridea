"use client";
import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import { StoryLogColumns, PlayBacksLogColumns, downloadLogColumns } from "./coloums";
import { DataTable } from "./datatable";
import { LogChartComponent } from "./chart";

/**
 * DownloadLogs Component
 * Displays logs for downloads, stories, and playbacks with filtering and visualization
 */
const DownloadLogs = () => {
  // Type definition for log categories
  type LogType = "download" | "story" | "playback";

  // State management with session storage persistence
  const [logType, setLogType] = useState<LogType>(() => {
    if (typeof window !== "undefined") {
      const storedLogType = sessionStorage.getItem("logType");
      return storedLogType ? (storedLogType as LogType) : "download";
    }
    return "download";
  });

  // API queries for different log types
  const { data: downloadLogs = [] } = api.download.getAllDownloadLogs.useQuery();
  const { data: playbackLogs = [] } = api.playbacks.getAllPlayBackLogs.useQuery();

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("logType", logType);
    }
  }, [logType]);

  return (
    <div className="p-3">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">DownLoad Logs</h1>
        <select
          className="border rounded-md p-2"
          value={logType}
          onChange={(e) => setLogType(e.target.value as LogType)}
        >
          <option value="download">Download Logs</option>
          <option value="story">Story Logs</option>
          <option value="playback">Playback Logs</option>
        </select>
      </div>

      {logType === "download" && (
        <DataTable columns={downloadLogColumns} data={downloadLogs} />
      )}
      {logType === "playback" && (
        <DataTable columns={PlayBacksLogColumns} data={ playbackLogs } />
      )}
      <div>
        <LogChartComponent/>
      </div>
    </div>
  );
};

export default DownloadLogs;
