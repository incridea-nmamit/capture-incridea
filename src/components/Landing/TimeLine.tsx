import Image from "next/image";
import React from "react";
import { TimelineLayout } from "./TimeLineLayout";
import { timeLineData } from "../constants/data";

const  TimeLine=() =>{
  return (
    <div className="w-full">
      <TimelineLayout data={timeLineData} />
    </div>
  );
}

export default TimeLine;
