import React from "react";
import { TimelineLayout } from "./TimeLineLayout";
import { timeLineData } from "../constants/data";

/**
 * TimeLine Component
 * Renders a timeline of events using the TimelineLayout component
 * Data is imported from timeLineData constant
 */
const TimeLine = () => {
  return (
    <div className="w-full">
      <TimelineLayout data={timeLineData} />
    </div>
  );
}

export default TimeLine;
