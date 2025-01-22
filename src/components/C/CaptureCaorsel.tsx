// @ts-nocheck

// this is for /capture --dont know why it is throwing in imagemasonary

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import style from "./corousel.module.css";
import CenteredLoader from "../LoadingAnimation/CameraLoading";
import { carouselItems } from "../constants/data";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import { Button } from "../ui/button";

const CaptureCard = () => {
  useEffect(() => {
    let nextDom = document.getElementById("next");
    let prevDom = document.getElementById("prev");

    let carouselDom = document.querySelector(".carousel");
    let SliderDom = carouselDom?.querySelector(".carousel .list");
    let thumbnailBorderDom = document.querySelector(".carousel .thumbnail");
    let thumbnailItemsDom = thumbnailBorderDom?.querySelectorAll(".item");
    let timeRunning = 1000;
    let timeAutoNext = 7000;

    if (thumbnailBorderDom && thumbnailItemsDom && thumbnailItemsDom[0]) {
      if (thumbnailItemsDom[0]) {
        if (thumbnailItemsDom[0]) {
          if (thumbnailItemsDom[0]) {
            if (thumbnailItemsDom[0]) {
              if (thumbnailItemsDom[0]) {
                if (thumbnailItemsDom[0]) {
                  if (thumbnailItemsDom[0]) {
                    thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
                  }
                }
              }
            }
          }
        }
      }
    }

    if (nextDom) {
      nextDom.onclick = function () {
        showSlider("next");
      };
    }

    if (prevDom) {
      prevDom.onclick = function () {
        showSlider("prev");
      };
    }

    let runTimeOut: NodeJS.Timeout;
    let runNextAuto = setTimeout(() => {
      nextDom?.click();
    }, timeAutoNext);

    function showSlider(type: "next" | "prev") {
      let SliderItemsDom = SliderDom?.querySelectorAll(".carousel .list .item");
      let thumbnailItemsDom = document.querySelectorAll(
        ".carousel .thumbnail .item",
      );

      if (
        SliderDom &&
        thumbnailBorderDom &&
        SliderItemsDom &&
        thumbnailItemsDom
      ) {
        if (type === "next") {
          if (SliderItemsDom[0]) {
            SliderDom.appendChild(SliderItemsDom[0]);
          }
          thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
          carouselDom?.classList.add("next");
        } else {
          if (SliderItemsDom[SliderItemsDom.length - 1]) {
            if (SliderItemsDom[SliderItemsDom.length - 1]) {
              SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
            }
          }
          thumbnailBorderDom.prepend(
            thumbnailItemsDom[thumbnailItemsDom.length - 1],
          );
          carouselDom?.classList.add("prev");
        }
        clearTimeout(runTimeOut);
        runTimeOut = setTimeout(() => {
          carouselDom?.classList.remove("next");
          carouselDom?.classList.remove("prev");
        }, timeRunning);

        clearTimeout(runNextAuto);
        runNextAuto = setTimeout(() => {
          nextDom?.click();
        }, timeAutoNext);
      }
    }
  }, []);

  return (
    <>
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
        /* body {
  margin: 0;
  background-color: #000;
  color: #eee;
  font-family: Poppins;
  font-size: 12px;
} */
        a {
          text-decoration: none;
        }
        header {
          width: 1140px;
          max-width: 80%;
          margin: auto;
          height: 50px;
          display: flex;
          align-items: center;
          position: relative;
          z-index: 100;
        }
        header a {
          color: #eee;
          margin-right: 40px;
        }
        /* carousel */
        .carousel {
          height: 100vh;
          margin-top: -50px;
          width: 100vw;
          overflow: hidden;
          position: relative;
        }
        .carousel .list .item {
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0 0 0 0;
        }
        .carousel .list .item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .carousel .list .item .content {
          position: absolute;
          top: 20%;
          width: 1140px;
          max-width: 80%;
          left: 50%;
          transform: translateX(-50%);
          padding-right: 30%;
          box-sizing: border-box;
          color: #fff;
          text-shadow: 0 5px 10px #0004;
        }
        .carousel .list .item .author {
          font-weight: bold;
          letter-spacing: 10px;
        }
        .carousel .list .item .title,
        .carousel .list .item .topic {
          font-size: 5em;
          font-weight: bold;
          line-height: 1.3em;
        }
        .carousel .list .item .topic {
          color: #f1683a;
        }
        .carousel .list .item .buttons {
          display: grid;
          grid-template-columns: repeat(2, 130px);
          grid-template-rows: 40px;
          gap: 5px;
          margin-top: 20px;
        }
        .carousel .list .item .buttons button {
          border: none;
          background-color: #eee;
          letter-spacing: 3px;
          font-family: Poppins;
          font-weight: 500;
        }
        .carousel .list .item .buttons button:nth-child(2) {
          background-color: transparent;
          border: 1px solid #fff;
          color: #eee;
        }
        /* thumbail */
        .thumbnail {
          position: absolute;
          bottom: 50px;
          left: 50%;
          width: max-content;
          z-index: 100;
          display: flex;
          gap: 20px;
        }
        .thumbnail .item {
          width: 150px;
          height: 220px;
          flex-shrink: 0;
          position: relative;
        }
        .thumbnail .item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 20px;
        }
        .thumbnail .item .content {
          color: #fff;
          position: absolute;
          bottom: 10px;
          left: 10px;
          right: 10px;
        }
        .thumbnail .item .content .title {
          font-weight: 500;
        }
        .thumbnail .item .content .description {
          font-weight: 300;
        }
        /* arrows */
        .arrows {
          position: absolute;
          top: 80%;
          right: 52%;
          z-index: 100;
          width: 300px;
          max-width: 30%;
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .arrows button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #eee4;
          border: none;
          color: #fff;
          font-family: monospace;
          font-weight: bold;
          transition: 0.5s;
        }
        .arrows button:hover {
          background-color: #fff;
          color: #000;
        }

        /* animation */
        .carousel .list .item:nth-child(1) {
          z-index: 1;
        }

        /* animation text in first item */

        .carousel .list .item:nth-child(1) .content .author,
        .carousel .list .item:nth-child(1) .content .title,
        .carousel .list .item:nth-child(1) .content .topic,
        .carousel .list .item:nth-child(1) .content .des,
        .carousel .list .item:nth-child(1) .content .buttons {
          transform: translateY(50px);
          filter: blur(20px);
          opacity: 0;
          animation: showContent 0.5s 1s linear 1 forwards;
        }
        @keyframes showContent {
          to {
            transform: translateY(0px);
            filter: blur(0px);
            opacity: 1;
          }
        }
        .carousel .list .item:nth-child(1) .content .title {
          animation-delay: 1.2s !important;
        }
        .carousel .list .item:nth-child(1) .content .topic {
          animation-delay: 1.4s !important;
        }
        .carousel .list .item:nth-child(1) .content .des {
          animation-delay: 1.6s !important;
        }
        .carousel .list .item:nth-child(1) .content .buttons {
          animation-delay: 1.8s !important;
        }
        /* create animation when next click */
        .carousel.next .list .item:nth-child(1) img {
          width: 150px;
          height: 220px;
          position: absolute;
          bottom: 50px;
          left: 50%;
          border-radius: 30px;
          animation: showImage 0.5s linear 1 forwards;
        }
        @keyframes showImage {
          to {
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 0;
          }
        }

        .carousel.next .thumbnail .item:nth-last-child(1) {
          overflow: hidden;
          animation: showThumbnail 0.5s linear 1 forwards;
        }
        .carousel.prev .list .item img {
          z-index: 100;
        }
        @keyframes showThumbnail {
          from {
            width: 0;
            opacity: 0;
          }
        }
        .carousel.next .thumbnail {
          animation: effectNext 0.5s linear 1 forwards;
        }

        @keyframes effectNext {
          from {
            transform: translateX(150px);
          }
        }

        /* running time */

        .carousel .time {
          position: absolute;
          z-index: 1000;
          width: 0%;
          height: 3px;
          background-color: #f1683a;
          left: 0;
          top: 0;
        }

        .carousel.next .time,
        .carousel.prev .time {
          animation: runningTime 3s linear 1 forwards;
        }
        @keyframes runningTime {
          from {
            width: 100%;
          }
          to {
            width: 0;
          }
        }

        /* prev click */

        .carousel.prev .list .item:nth-child(2) {
          z-index: 2;
        }

        .carousel.prev .list .item:nth-child(2) img {
          animation: outFrame 0.5s linear 1 forwards;
          position: absolute;
          bottom: 0;
          left: 0;
        }
        @keyframes outFrame {
          to {
            width: 150px;
            height: 220px;
            bottom: 50px;
            left: 50%;
            border-radius: 20px;
          }
        }

        .carousel.prev .thumbnail .item:nth-child(1) {
          overflow: hidden;
          opacity: 0;
          animation: showThumbnail 0.5s linear 1 forwards;
        }
        .carousel.next .arrows button,
        .carousel.prev .arrows button {
          pointer-events: none;
        }
        .carousel.prev .list .item:nth-child(2) .content .author,
        .carousel.prev .list .item:nth-child(2) .content .title,
        .carousel.prev .list .item:nth-child(2) .content .topic,
        .carousel.prev .list .item:nth-child(2) .content .des,
        .carousel.prev .list .item:nth-child(2) .content .buttons {
          animation: contentOut 1.5s linear 1 forwards !important;
        }

        @keyframes contentOut {
          to {
            transform: translateY(-150px);
            filter: blur(20px);
            opacity: 0;
          }
        }
        @media screen and (max-width: 678px) {
          .carousel .list .item .content {
            padding-right: 0;
          }
          .carousel .list .item .content .title {
            font-size: 30px;
          }
        }
      `}</style>

      <div className="carousel">
        <div className="list">
          {carouselItems.map((item, index) => (
            <div className="item" key={index}>
              <img src={item.imgSrc} alt={`Slide ${index + 1}`} />
              <div className="content">
                <div className="author">
                  <a href="/" className="mx-auto md:mx-0">
                    <Image
                      src="/images/Logo/capture.png"
                      alt="Logo"
                      width={150}
                      height={80}
                      className="h-auto w-auto max-w-32"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    />
                  </a>
                </div>
                <div className="title">{item.title}</div>
                <div className="des">{item.description}</div>

                <div
                  onClick={() => { window.location.href = `/captures/${item.route}`; }}
                  className="buttons"
                >
                  <Button className="h-16 w-64 px-6 py-4 text-lg font-bold hover:bg-[#101b37] text-white rounded-xl bg-[#081025] border-2">
                    Enter
                  </Button>
                </div>

              </div>
            </div>
          ))}
        </div>
        <div className="thumbnail">
          {carouselItems.map((thumb, index) => (
            <div className="item relative shadow-2xl hover:scale-110 " key={index}>
              <img
                src={thumb.imgSrc}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-auto object-cover"
              />
              <div className="  bottom-0 rounded-b-3xl absolute  w-full bg-gradient-to-t from-black via-black/50 to-transparent text-white p-4  transition-opacity duration-300">
                <div className="title text-lg font-bold">{thumb.title}</div>
              </div>
            </div>

          ))}
        </div>

        <div className="arrows">
          <button id="prev" className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full shadow-md hover:bg-gray-300"><ArrowLeftCircle /></button>
          <button id="next" className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full shadow-md hover:bg-gray-300" ><ArrowRightCircle /></button>
        </div>
        <div className="time"></div>
      </div>
    </>
  );
};

export default CaptureCard;
