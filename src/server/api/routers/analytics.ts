import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { db } from "~/server/db";

// Define interface for User with college field
interface UserWithCollege {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: string;
  college?: string; // Make college optional since it might not be present
}

export const analyticsRouter = createTRPCRouter({
  logVisit: publicProcedure
    .input(
      z.object({
        session_user: z.string(),
        uniqueId: z.string(),
        routePath: z.string(),
        device: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { session_user, uniqueId, routePath, device } = input;
      const currentDateAndTime = new Date();
      await db.webAnalytics.create({
        data: {
          session_user: session_user,
          uniqueId: uniqueId,
          routePath: routePath,
          isChecked: "no",
          device: device,
          timer: 0,
          startPing: currentDateAndTime,
          lastPing: currentDateAndTime,
        },
      });
    }),

  updateVisit: publicProcedure
    .input(
      z.object({
        uniqueId: z.string(),
        timer: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { uniqueId, timer } = input;
      const currentDateAndTime = new Date();
      await db.webAnalytics.updateMany({
        where: { uniqueId },
        data: {
          timer,
          isChecked: "yes",
          lastPing: currentDateAndTime,
        },
      });
    }),

  getAnalytics: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.webAnalytics.findMany();
    return data;
  }),

  updateNullEntries: publicProcedure
    .input(
      z.object({
        session_user: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { session_user } = input;
      await db.webAnalytics.updateMany({
        where: {
          session_user: session_user,
          isChecked: "no",
        },
        data: {
          isChecked: "yes",
        },
      });
    }),

  syncTimerVisit: publicProcedure
    .input(
      z.object({
        uniqueId: z.string(),
        timer: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { uniqueId, timer } = input;
      const currentDateAndTime = new Date();
      await db.webAnalytics.updateMany({
        where: { uniqueId },
        data: {
          timer,
          lastPing: currentDateAndTime,
        },
      });
    }),

  getAnalyticsSummary: publicProcedure
    .input(
      z.object({
        filter: z.string(),
        customDate: z.string().nullable(),
        dateReferences: z.record(z.string(), z.date()),
      })
    )
    .query(async ({ ctx, input }) => {
      const { filter, customDate, dateReferences } = input;
      const allLogs = await ctx.db.webAnalytics.findMany();

      const filteredLogs =
        filter === "all"
          ? allLogs.filter(
              (log) =>
                log.routePath.includes("/") &&
                log.isChecked === "yes" &&
                log.session_user !== "" &&
                log.session_user !== null
            )
          : filter === "custom" && customDate
          ? allLogs.filter((log) => {
              const logDate = new Date(log.startPing).toISOString().split("T")[0];
              return logDate === customDate;
            })
          : allLogs.filter((log) => {
              const logDate = new Date(log.startPing);
              const dateReferenceKey = `day${filter}`;
              const dateReference = dateReferences[dateReferenceKey];
              return (
                dateReference &&
                logDate.toDateString() === new Date(dateReference).toDateString() &&
                log.routePath.includes("/") &&
                log.session_user !== "" &&
                log.session_user !== null
              );
            });

      const totalTimeSpent = filteredLogs.reduce(
        (total, log) => total + (log.timer || 0),
        0
      );
      const averageTimeSpent =
        filteredLogs.length > 0 ? totalTimeSpent / filteredLogs.length : 0;
      const uniqueVisitors = new Set(
        filteredLogs.map((entry) => entry.session_user)
      ).size;
      const legitimateVisits = filteredLogs.filter(
        (log) => (log.timer || 0) > 10
      ).length;

      const deviceCounts = filteredLogs.reduce((acc, log) => {
        acc[log.device] = (acc[log.device] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const deviceTimeSpent = filteredLogs.reduce((acc, log) => {
        acc[log.device] = (acc[log.device] || 0) + (log.timer || 0);
        return acc;
      }, {} as Record<string, number>);

      const routeCounts = filteredLogs.reduce((acc, log) => {
        acc[log.routePath] = (acc[log.routePath] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalVisits: filteredLogs.length,
        legitimateVisits,
        uniqueVisitors,
        totalTimeSpent,
        averageTimeSpent,
        deviceCounts,
        deviceTimeSpent,
        routeCounts,
        filteredLogs,
      };
    }),

  getTimeSeriesData: publicProcedure
    .input(
      z.object({
        filter: z.string(),
        customDate: z.string().nullable(),
        dateReferences: z.record(z.string(), z.date()),
      })
    )
    .query(async ({ ctx, input }) => {
      const { filter, customDate, dateReferences } = input;
      const allLogs = await ctx.db.webAnalytics.findMany();

      const filteredLogs =
        filter === "all"
          ? allLogs.filter(
              (log) =>
                log.routePath.includes("/") &&
                log.isChecked === "yes" &&
                log.session_user !== "" &&
                log.session_user !== null
            )
          : filter === "custom" && customDate
          ? allLogs.filter((log) => {
              const logDate = new Date(log.startPing).toISOString().split("T")[0];
              return logDate === customDate;
            })
          : allLogs.filter((log) => {
              const logDate = new Date(log.startPing);
              const dateReferenceKey = `day${filter}`;
              const dateReference = dateReferences[dateReferenceKey];
              return (
                dateReference &&
                logDate.toDateString() === new Date(dateReference).toDateString() &&
                log.routePath.includes("/") &&
                log.session_user !== "" &&
                log.session_user !== null
              );
            });

      const visitData = filteredLogs.reduce(
        (acc, log) => {
          const dateObj = new Date(log.startPing);
          const dateKey = dateObj.toLocaleDateString([], {
            month: "short",
            day: "numeric",
          });
          const timeKey = dateObj.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          const combinedKey = `${dateKey} ${timeKey}`;

          if (!acc[combinedKey]) {
            acc[combinedKey] = { visits: 0, uniqueIPs: new Set(), totalTime: 0 };
          }

          acc[combinedKey].visits += 1;
          acc[combinedKey].uniqueIPs.add(log.session_user);
          acc[combinedKey].totalTime += log.timer ?? 0;

          return acc;
        },
        {} as Record<
          string,
          { visits: number; uniqueIPs: Set<string>; totalTime: number }
        >
      );

      const timeSeriesData = Object.entries(visitData).map(([time, data]) => ({
        time,
        visits: data.visits,
        unique: data.uniqueIPs.size,
        viewsPerUnique: data.uniqueIPs.size
          ? data.visits / data.uniqueIPs.size
          : 0,
        avgTimeSpent: data.visits > 0 ? data.totalTime / data.visits : 0,
      }));

      timeSeriesData.sort((a, b) => {
        const timeA = new Date(a.time).getTime();
        const timeB = new Date(b.time).getTime();
        return timeA - timeB;
      });

      let cumulativeVisits = 0;
      const growthData = timeSeriesData.map((data) => {
        cumulativeVisits += data.visits;
        return { time: data.time, cumulativeVisits };
      });

      return {
        timeSeriesData,
        growthData,
      };
    }),

  getRouteAnalytics: publicProcedure
    .input(
      z.object({
        filter: z.string(),
        customDate: z.string().nullable(),
        dateReferences: z.record(z.string(), z.date()),
        selectedRoute: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { filter, customDate, dateReferences, selectedRoute } = input;
      const allLogs = await ctx.db.webAnalytics.findMany();

      const filteredLogs =
        filter === "all"
          ? allLogs.filter(
              (log) =>
                log.routePath.includes("/") &&
                log.isChecked === "yes" &&
                log.session_user !== "" &&
                log.session_user !== null
            )
          : filter === "custom" && customDate
          ? allLogs.filter((log) => {
              const logDate = new Date(log.startPing).toISOString().split("T")[0];
              return logDate === customDate;
            })
          : allLogs.filter((log) => {
              const logDate = new Date(log.startPing);
              const dateReferenceKey = `day${filter}`;
              const dateReference = dateReferences[dateReferenceKey];
              return (
                dateReference &&
                logDate.toDateString() === new Date(dateReference).toDateString() &&
                log.routePath.includes("/") &&
                log.session_user !== "" &&
                log.session_user !== null
              );
            });

      if (selectedRoute === "all") {
        return {
          hourlyTraffic: [],
          deviceDistribution: [],
          averageTimeSpent: 0,
          bounceRate: 0,
          peakHours: [],
          userRetention: 0,
        };
      }

      const routeLogs = filteredLogs.filter((log) =>
        selectedRoute === "/"
          ? log.routePath === "/"
          : log.routePath.includes(selectedRoute)
      );

      const hourlyTrafficMap = new Map<number, number>();
      for (let i = 0; i < 24; i++) {
        hourlyTrafficMap.set(i, 0);
      }

      routeLogs.forEach((log) => {
        const hour = new Date(log.startPing).getHours();
        const currentValue = hourlyTrafficMap.get(hour) ?? 0;
        hourlyTrafficMap.set(hour, currentValue + 1);
      });

      const hourlyTraffic = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        count: hourlyTrafficMap.get(hour) || 0,
      }));

      const devices = routeLogs.reduce((acc, log) => {
        acc[log.device] = (acc[log.device] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const deviceDistribution = Object.entries(devices).map(([device, count]) => ({
        device,
        count,
      }));

      const averageTimeSpent =
        routeLogs.reduce((acc, log) => acc + (log.timer || 0), 0) /
        (routeLogs.length || 1);

      const userVisits = routeLogs.reduce((acc, log) => {
        const key = log.session_user;
        if (!(key in acc)) {
          acc[key] = 1;
        } else {
          acc[key] = (acc[key] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const uniqueUsers = Object.keys(userVisits).length;
      const bounceUsers = Object.entries(userVisits).filter(
        ([_, count]) => count === 1
      ).length;
      const bounceRate =
        uniqueUsers > 0 ? (bounceUsers / uniqueUsers) * 100 : 0;

      const peakHours = [...hourlyTraffic]
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      const userRetention = 100 - bounceRate;

      return {
        hourlyTraffic,
        deviceDistribution,
        averageTimeSpent,
        bounceRate,
        peakHours,
        userRetention,
      };
    }),

  getPathAnalytics: publicProcedure
    .input(
      z.object({
        filter: z.string(),
        customDate: z.string().nullable(),
        dateReferences: z.record(z.string(), z.date()),
        pathFilter: z.string(),
        pathType: z.enum(["capture", "event"]),
      })
    )
    .query(async ({ ctx, input }) => {
      const { filter, customDate, dateReferences, pathFilter, pathType } = input;
      const allLogs = await ctx.db.webAnalytics.findMany();

      const filteredLogs =
        filter === "all"
          ? allLogs.filter(
              (log) =>
                log.routePath.includes("/") &&
                log.isChecked === "yes" &&
                log.session_user !== "" &&
                log.session_user !== null
            )
          : filter === "custom" && customDate
          ? allLogs.filter((log) => {
              const logDate = new Date(log.startPing).toISOString().split("T")[0];
              return logDate === customDate;
            })
          : allLogs.filter((log) => {
              const logDate = new Date(log.startPing);
              const dateReferenceKey = `day${filter}`;
              const dateReference = dateReferences[dateReferenceKey];
              return (
                dateReference &&
                logDate.toDateString() === new Date(dateReference).toDateString() &&
                log.routePath.includes("/") &&
                log.session_user !== "" &&
                log.session_user !== null
              );
            });

      let pathLogs;

      if (pathType === "capture") {
        if (pathFilter === "all") {
          const validRoutes = [
            "pronite",
            "your-snaps",
            "accolades",
            "faculty",
            "our-team",
            "about",
            "events",
            "/",
            "behindincridea",
            "captures",
          ];

          pathLogs = filteredLogs.filter((log) => {
            return (
              validRoutes.some((route) => log.routePath.includes(route)) &&
              log.isChecked === "yes"
            );
          });
        } else {
          if (pathFilter === "/") {
            pathLogs = filteredLogs.filter(
              (log) => log.routePath === "/" && log.isChecked === "yes"
            );
          } else if (pathFilter === "captures") {
            pathLogs = filteredLogs.filter(
              (log) => log.routePath === "/captures" && log.isChecked === "yes"
            );
          } else if (pathFilter === "events") {
            pathLogs = filteredLogs.filter(
              (log) =>
                log.routePath === "/captures/events" && log.isChecked === "yes"
            );
          } else {
            pathLogs = filteredLogs.filter(
              (log) => log.routePath.includes(pathFilter) && log.isChecked === "yes"
            );
          }
        }
      } else {
        if (pathFilter === "all") {
          pathLogs = filteredLogs.filter((log) =>
            log.routePath.startsWith("/captures/events")
          );
        } else {
          pathLogs = filteredLogs.filter(
            (log) => log.routePath === `/captures/events/${pathFilter}`
          );
        }
      }

      const totalVisits = pathLogs.length;
      const uniqueVisitors = new Set(
        pathLogs.map((entry) => entry.session_user)
      ).size;

      return {
        totalVisits,
        uniqueVisitors,
      };
    }),

  getCollegeAnalytics: publicProcedure
    .input(
      z.object({
        filter: z.string(),
        customDate: z.string().nullable(),
        dateReferences: z.record(z.string(), z.date()),
      })
    )
    .query(async ({ ctx, input }) => {
      const { filter, customDate, dateReferences } = input;

      const verifiedUsers = await ctx.db.user.findMany({
        where: {
          emailVerified: { not: null },
        },
      }) as UserWithCollege[]; // Cast to our interface with college field

      const downloadLogs = await ctx.db.downloadLog.findMany();

      const playbackLogs = await ctx.db.playbackLog.findMany();

      const filteredDownloadLogs =
        filter === "all"
          ? downloadLogs.filter(
              (log) => log.session_user !== "" && log.session_user !== null
            )
          : filter === "custom" && customDate
          ? downloadLogs.filter((log) => {
              const logDate = new Date(log.date_time).toISOString().split("T")[0];
              return logDate === customDate;
            })
          : downloadLogs.filter((log) => {
              const logDate = new Date(log.date_time);
              const dateReferenceKey = `day${filter}`;
              const dateReference = dateReferences[dateReferenceKey];
              return (
                dateReference &&
                logDate.toDateString() === new Date(dateReference).toDateString() &&
                log.session_user !== "" &&
                log.session_user !== null
              );
            });

      const filteredPlaybackLogs =
        filter === "all"
          ? playbackLogs.filter(
              (log) => log.session_user !== "" && log.session_user !== null
            )
          : filter === "custom" && customDate
          ? playbackLogs.filter((log) => {
              const logDate = new Date(log.date_time).toISOString().split("T")[0];
              return logDate === customDate;
            })
          : playbackLogs.filter((log) => {
              const logDate = new Date(log.date_time);
              const dateReferenceKey = `day${filter}`;
              const dateReference = dateReferences[dateReferenceKey];
              return (
                dateReference &&
                logDate.toDateString() === new Date(dateReference).toDateString() &&
                log.session_user !== "" &&
                log.session_user !== null
              );
            });

      const internal = verifiedUsers.filter(
        (user) => user.college === "internal"
      ).length;
      const external = verifiedUsers.filter(
        (user) => user.college === "external"
      ).length;

      const internalIds = new Set(
        verifiedUsers
          .filter((user) => user.college === "internal")
          .map((user) => user.id)
      );
      const externalIds = new Set(
        verifiedUsers
          .filter((user) => user.college === "external")
          .map((user) => user.id)
      );

      const internalDownloads = filteredDownloadLogs.filter((log) =>
        internalIds.has(String(log.session_user)) // Convert to string
      ).length;
      const externalDownloads = filteredDownloadLogs.filter((log) =>
        externalIds.has(String(log.session_user)) // Convert to string
      ).length;

      const internalPlaybackViews = filteredPlaybackLogs.filter((log) =>
        internalIds.has(String(log.session_user)) // Convert to string
      ).length;
      const externalPlaybackViews = filteredPlaybackLogs.filter((log) =>
        externalIds.has(String(log.session_user)) // Convert to string
      ).length;

      return {
        internal,
        external,
        internalDownloads,
        externalDownloads,
        internalPlaybackViews,
        externalPlaybackViews,
      };
    }),

  getFilteredRouteCounts: publicProcedure
    .input(
      z.object({
        filter: z.string(),
        customDate: z.string().nullable(),
        dateReferences: z.record(z.string(), z.date()),
        captureFilter: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { filter, customDate, dateReferences, captureFilter } = input;
      const allLogs = await ctx.db.webAnalytics.findMany();

      const filteredLogs =
        filter === "all"
          ? allLogs.filter(
              (log) =>
                log.routePath.includes("/") &&
                log.isChecked === "yes" &&
                log.session_user !== "" &&
                log.session_user !== null
            )
          : filter === "custom" && customDate
          ? allLogs.filter((log) => {
              const logDate = new Date(log.startPing).toISOString().split("T")[0];
              return logDate === customDate;
            })
          : allLogs.filter((log) => {
              const logDate = new Date(log.startPing);
              const dateReferenceKey = `day${filter}`;
              const dateReference = dateReferences[dateReferenceKey];
              return (
                dateReference &&
                logDate.toDateString() === new Date(dateReference).toDateString() &&
                log.routePath.includes("/") &&
                log.session_user !== "" &&
                log.session_user !== null
              );
            });

      const filteredCaptures = captureFilter === "all"
        ? filteredLogs.filter((log) => {
            const validRoutes = [
              "pronite", 
              "your-snaps", 
              "accolades",
              "faculty",
              "our-team", 
              "about", 
              "events", 
              "/", 
              "behindincridea",
              "captures"
            ];

            const isValidRoute = validRoutes.some((route) => log.routePath.includes(route));
            return isValidRoute && log.isChecked === "yes";
          })
        : filteredLogs.filter((log) => {
            if (captureFilter === "/") {
              return log.routePath === "/" && log.isChecked === "yes";
            }
            if (captureFilter === "captures") {
              return log.routePath === "/captures" && log.isChecked === "yes";
            }
            if (captureFilter === "events") {
              return log.routePath === "/captures/events" && log.isChecked === "yes";
            }
            return log.routePath.includes(captureFilter) && log.isChecked === "yes";
        });

      const routeVisits = filteredCaptures.length;
      const uniqueRouteIDs = new Set(filteredCaptures.filter(log => log.isChecked === "yes")
        .map((entry) => entry.session_user)).size;

      return {
        routeVisits,
        uniqueRouteIDs
      };
    }),

  getEventCounts: publicProcedure
    .input(
      z.object({
        filter: z.string(),
        customDate: z.string().nullable(),
        dateReferences: z.record(z.string(), z.date()),
        eventFilter: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { filter, customDate, dateReferences, eventFilter } = input;
      const allLogs = await ctx.db.webAnalytics.findMany();

      const filteredLogs =
        filter === "all"
          ? allLogs.filter(
              (log) =>
                log.routePath.includes("/") &&
                log.isChecked === "yes" &&
                log.session_user !== "" &&
                log.session_user !== null
            )
          : filter === "custom" && customDate
          ? allLogs.filter((log) => {
              const logDate = new Date(log.startPing).toISOString().split("T")[0];
              return logDate === customDate;
            })
          : allLogs.filter((log) => {
              const logDate = new Date(log.startPing);
              const dateReferenceKey = `day${filter}`;
              const dateReference = dateReferences[dateReferenceKey];
              return (
                dateReference &&
                logDate.toDateString() === new Date(dateReference).toDateString() &&
                log.routePath.includes("/") &&
                log.session_user !== "" &&
                log.session_user !== null
              );
            });

      const filteredEvents = eventFilter === "all"
        ? filteredLogs.filter((log) => log.routePath.startsWith("/captures/events"))
        : filteredLogs.filter((log) => log.routePath === `/captures/events/${eventFilter}`);

      const eventVisits = filteredEvents.length;
      const uniqueEventIPs = new Set(filteredEvents.map((entry) => entry.session_user)).size;

      return {
        eventVisits,
        uniqueEventIPs
      };
    }),

  getGalleryData: publicProcedure
    .input(
      z.object({
        filter: z.string(),
        dateReferences: z.record(z.string(), z.date()),
      })
    )
    .query(async ({ ctx, input }) => {
      const { filter, dateReferences } = input;
      
      // Define more flexible interface to match actual database schema
      interface CaptureItem {
        id: number;
        date_time: Date;
        // Allow additional properties
        [key: string]: any;
      }

      interface PlaybackItem {
        id: number;
        date_time: Date;
        // Allow additional properties
        [key: string]: any;
      }
      
      // Get data and cast to our interfaces
      const captures = await ctx.db.captures.findMany() as unknown as CaptureItem[];
      const playbacks = await ctx.db.playbacks.findMany() as unknown as PlaybackItem[];
      
      const filteredGallery =
        filter === "all"
          ? captures
          : captures.filter((galleryItem) => {
              if (!galleryItem.date_time) return false;
              const galleryItemDate = new Date(galleryItem.date_time);
              const dateReferenceKey = `day${filter}`;
              const dateReference = dateReferences[dateReferenceKey];
              return dateReference && galleryItemDate.toDateString() === dateReference.toDateString();
            });
            
      const filteredPlaybacks =
        filter === "all"
          ? playbacks
          : playbacks.filter((galleryItem) => {
              if (!galleryItem.date_time) return false;
              const galleryItemDate = new Date(galleryItem.date_time);
              const dateReferenceKey = `day${filter}`;
              const dateReference = dateReferences[dateReferenceKey];
              return dateReference && galleryItemDate.toDateString() === dateReference.toDateString();
            });
            
      return {
        filteredGallery,
        filteredPlaybacks
      };
    }),

  getDownloadLogs: publicProcedure
    .input(
      z.object({
        filter: z.string(),
        customDate: z.string().nullable(),
        dateReferences: z.record(z.string(), z.date()),
      })
    )
    .query(async ({ ctx, input }) => {
      const { filter, customDate, dateReferences } = input;
      
      const downloadLogs = await ctx.db.downloadLog.findMany();
      
      const filteredDownloadLogs =
        filter === "all"
          ? downloadLogs.filter(
              (log) => log.session_user !== "" && log.session_user !== null
            )
          : filter === "custom" && customDate
          ? downloadLogs.filter((log) => {
              const logDate = new Date(log.date_time).toISOString().split("T")[0];
              return logDate === customDate;
            })
          : downloadLogs.filter((log) => {
              const logDate = new Date(log.date_time);
              const dateReferenceKey = `day${filter}`;
              const dateReference = dateReferences[dateReferenceKey];
              return (
                dateReference &&
                logDate.toDateString() === new Date(dateReference).toDateString() &&
                log.session_user !== "" &&
                log.session_user !== null
              );
            });
            
      return filteredDownloadLogs;
    }),

  getPlaybackLogs: publicProcedure
    .input(
      z.object({
        filter: z.string(),
        customDate: z.string().nullable(),
        dateReferences: z.record(z.string(), z.date()),
      })
    )
    .query(async ({ ctx, input }) => {
      const { filter, customDate, dateReferences } = input;
      
      const playbackLogs = await ctx.db.playbackLog.findMany();
      
      const filteredPlaybackLogs =
        filter === "all"
          ? playbackLogs.filter(
              (log) => log.session_user !== "" && log.session_user !== null
            )
          : filter === "custom" && customDate
          ? playbackLogs.filter((log) => {
              const logDate = new Date(log.date_time).toISOString().split("T")[0];
              return logDate === customDate;
            })
          : playbackLogs.filter((log) => {
              const logDate = new Date(log.date_time);
              const dateReferenceKey = `day${filter}`;
              const dateReference = dateReferences[dateReferenceKey];
              return (
                dateReference &&
                logDate.toDateString() === new Date(dateReference).toDateString() &&
                log.session_user !== "" &&
                log.session_user !== null
              );
            });
            
      return filteredPlaybackLogs;
    }),

  getChartData: publicProcedure
    .input(
      z.object({
        filter: z.string(),
        customDate: z.string().nullable(),
        dateReferences: z.record(z.string(), z.date()),
      })
    )
    .query(async ({ ctx, input }) => {
      const { filter, customDate, dateReferences } = input;
      const allLogs = await ctx.db.webAnalytics.findMany();
      
      const filteredLogs =
        filter === "all"
          ? allLogs.filter(
              (log) =>
                log.routePath.includes("/") &&
                log.isChecked === "yes" &&
                log.session_user !== "" &&
                log.session_user !== null
            )
          : filter === "custom" && customDate
          ? allLogs.filter((log) => {
              const logDate = new Date(log.startPing).toISOString().split("T")[0];
              return logDate === customDate;
            })
          : allLogs.filter((log) => {
              const logDate = new Date(log.startPing);
              const dateReferenceKey = `day${filter}`;
              const dateReference = dateReferences[dateReferenceKey];
              return (
                dateReference &&
                logDate.toDateString() === new Date(dateReference).toDateString() &&
                log.routePath.includes("/") &&
                log.session_user !== "" &&
                log.session_user !== null
              );
            });
      
      // Calculate device counts
      const deviceCounts = filteredLogs.reduce(
        (acc, log) => {
          if (!acc[log.device]) {
            acc[log.device] = 0;
          }
          acc[log.device] = (acc[log.device] ?? 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );
      
      // Time spent per device
      const deviceTimeSpent = filteredLogs.reduce((acc, log) => {
        if (!acc[log.device]) {
          acc[log.device] = 0;
        }
        acc[log.device] = (acc[log.device] ?? 0) + (log.timer || 0);
        return acc;
      }, {} as Record<string, number>);
      
      // Visit data processing for time series
      const visitData = filteredLogs.reduce(
        (acc, log) => {
          const dateObj = new Date(log.startPing);
          const dateKey = dateObj.toLocaleDateString([], {
            month: "short",
            day: "numeric",
          });
          const timeKey = dateObj.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          const combinedKey = `${dateKey} ${timeKey}`;

          if (!acc[combinedKey]) {
            acc[combinedKey] = { 
              visits: 0, 
              uniqueIPs: new Set<string>(), 
              totalTime: 0 
            };
          }

          const entry = acc[combinedKey];
          entry.visits += 1;
          entry.uniqueIPs.add(log.session_user);
          entry.totalTime += log.timer ?? 0;

          return acc;
        },
        {} as Record<string, { visits: number; uniqueIPs: Set<string>; totalTime: number }>
      );
      
      // Process time series data
      const timeSeriesData = Object.entries(visitData).map(([time, data]) => ({
        time,
        visits: data.visits,
        unique: data.uniqueIPs.size,
        viewsPerUnique: data.uniqueIPs.size ? data.visits / data.uniqueIPs.size : 0,
        avgTimeSpent: data.visits > 0 ? data.totalTime / data.visits : 0, 
      }));
      
      // Sort by time
      timeSeriesData.sort((a, b) => {
        const timeA = new Date(a.time).getTime();
        const timeB = new Date(b.time).getTime();
        return timeA - timeB;
      });
      
      // Calculate growth data
      let cumulativeVisits = 0;
      const growthData = timeSeriesData.map((data) => {
        cumulativeVisits += data.visits;
        return { time: data.time, cumulativeVisits };
      });
      
      // Route counts
      const routeCounts = filteredLogs.reduce((acc, log) => {
        acc[log.routePath] = (acc[log.routePath] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Device chart data
      const pieData = {
        labels: Object.keys(deviceCounts),
        datasets: [{
          label: 'Device Distribution',
          data: Object.values(deviceCounts),
          backgroundColor: ['#E0E0E0', '#B0B0B0', '#808080', '#505050'],
        }],
      };
      
      const barData = {
        labels: Object.keys(deviceCounts),
        datasets: [{
          label: 'Sessions by Device',
          data: Object.values(deviceCounts),
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          hoverBackgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: 'rgba(255, 255, 255, 1)',
          borderWidth: 1
        }],
      };
      
      const lineData = {
        labels: filteredLogs.map(log => new Date(log.startPing).toLocaleString()),
        datasets: Object.keys(deviceCounts ?? {}).map((device, index) => ({
          label: device,
          data: filteredLogs
            .filter(log => log.device === device)
            .map(log => log.timer ?? 0),
          borderColor: index === 0 ? 'rgba(255, 255, 255, 0.9)' : 
                       index === 1 ? 'rgba(200, 200, 200, 0.9)' : 
                       'rgba(150, 150, 150, 0.9)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        })),
      };
      
      const doughnutData = {
        labels: Object.keys(deviceTimeSpent),
        datasets: [{
          label: 'Time Spent per Device (ms)',
          data: Object.values(deviceTimeSpent),
          backgroundColor: ['#E0E0E0', '#B0B0B0', '#808080', '#505050'],
        }],
      };
      
      return {
        deviceCounts,
        deviceTimeSpent,
        timeSeriesData,
        growthData,
        routeCounts,
        chartData: {
          pieData,
          barData, 
          lineData,
          doughnutData
        }
      };
    }),
});
