"use client";
import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import { downlodeLogColumns, StoryLogColumns, PlayBacksLogColumns } from "./coloums";
import { DataTable } from "./datatable";
import { LogChartComponent } from "./chart";

const DownLodeLogs = () => {
  type LogType = "download" | "story" | "playback";

  const [logType, setLogType] = useState<LogType>(() => {
    if (typeof window !== "undefined") {
      const storedLogType = sessionStorage.getItem("logType");
      return storedLogType ? (storedLogType as LogType) : "download";
    }
    return "download";
  });

  const { data: downloadLogs = [] } = api.download.getAllDownloadLogs.useQuery();
  const { data: storyLogs = [] } = api.stories.getAllStoryLogs.useQuery();
  const { data: playbackLogs = [] } = api.playbacks.getAllPlayBackLogs.useQuery();

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("logType", logType);
    }
  }, [logType]);

  return (
    <div className="p-3">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">DownLode Logs</h1>
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
        <DataTable columns={downlodeLogColumns} data={downloadLogs} />
      )}
      {logType === "story" && (
        <DataTable columns={StoryLogColumns} data={storyLogs} />
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

export default DownLodeLogs;
