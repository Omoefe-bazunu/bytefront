"use client";

import React, { useEffect, useState, useMemo } from "react";
import { getVisitorStats, getQuickMetrics } from "@/lib/firestoreService";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Users,
  MousePointerClick,
  Globe,
  Layout,
  Calendar,
  Terminal,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Cpu,
} from "lucide-react";

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState([]);
  const [counts, setCounts] = useState({ total: 0, unique: 0 });
  const [loading, setLoading] = useState(true);
  const [openBreakdown, setOpenBreakdown] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [logs, trueCounts] = await Promise.all([
          getVisitorStats(),
          getQuickMetrics(),
        ]);
        setStats(logs);
        setCounts(trueCounts);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  const insights = useMemo(() => {
    if (stats.length === 0)
      return {
        topCountry: "N/A",
        topPage: "N/A",
        growth: 0,
        sortedCountries: [],
      };

    const countryMap = {};
    const pageMap = {};

    stats.forEach((log) => {
      countryMap[log.country] = (countryMap[log.country] || 0) + 1;
      pageMap[log.page] = (pageMap[log.page] || 0) + 1;
    });

    const sortMap = (map) =>
      Object.entries(map)
        .sort(([, a], [, b]) => b - a)
        .map(([name, count]) => ({ name, count }));
    const sortedCountries = sortMap(countryMap);
    const sortedPages = sortMap(pageMap);

    return {
      topCountry: sortedCountries[0]?.name || "N/A",
      topPage: sortedPages[0]?.name || "N/A",
      sortedCountries,
      sortedPages,
    };
  }, [stats]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-black min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF6B00] mb-4" />
        <p className="font-mono text-[10px] font-black uppercase tracking-widest text-zinc-500">
          Syncing_Intelligence...
        </p>
      </div>
    );

  return (
    <div className="space-y-8 bg-black p-6 border-2 border-zinc-900 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
      {/* --- HEADER --- */}
      <div className="flex items-center gap-2 mb-4">
        <Terminal className="h-4 w-4 text-[#FF6B00]" />
        <span className="font-sans text-[10px] font-black tracking-[0.3em] text-[#FF6B00] uppercase">
          Traffic_Protocol_v1.0
        </span>
      </div>

      {/* --- METRIC GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Unique Sessions"
          value={counts.unique}
          icon={<Users />}
          color="bg-zinc-900"
        />
        <MetricCard
          label="Total Hits"
          value={counts.total}
          icon={<MousePointerClick />}
          color="bg-zinc-900"
        />
        <MetricCard
          label="Primary Region"
          value={insights.topCountry}
          icon={<Globe />}
          color="bg-zinc-900"
          isExpandable
          onClick={() =>
            setOpenBreakdown(openBreakdown === "countries" ? null : "countries")
          }
        />
        <MetricCard
          label="Active Entry"
          value={insights.topPage}
          icon={<Layout />}
          color="bg-zinc-900"
        />
      </div>

      {/* --- TRAFFIC STREAM --- */}
      <div className="bg-zinc-950 border border-zinc-900 p-6">
        <h2 className="font-display text-2xl font-black uppercase italic text-white mb-6">
          Traffic_<span className="text-zinc-700">Stream</span>
        </h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-black border-b border-zinc-900">
              <TableRow className="hover:bg-transparent">
                <TableCell className="font-black uppercase text-[9px] tracking-widest text-zinc-500">
                  Timestamp
                </TableCell>
                <TableCell className="font-black uppercase text-[9px] tracking-widest text-zinc-500">
                  Destination_Unit
                </TableCell>
                <TableCell className="font-black uppercase text-[9px] tracking-widest text-zinc-500">
                  Geo_Location
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((log) => (
                <TableRow
                  key={log.id}
                  className="border-zinc-900 hover:bg-zinc-900/50 group"
                >
                  <TableCell className="font-mono text-[10px] text-zinc-500">
                    {log.timestamp}
                  </TableCell>
                  <TableCell>
                    <span className="bg-[#FF6B00]/10 text-[#FF6B00] px-2 py-0.5 text-[9px] font-black uppercase border border-[#FF6B00]/20">
                      {log.page}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs font-bold text-zinc-300 uppercase italic">
                    {log.city}, {log.country}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, color, isExpandable, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`${color} border border-zinc-800 p-6 flex justify-between items-center h-28 relative group transition-all hover:border-[#FF6B00] ${isExpandable ? "cursor-pointer" : ""}`}
    >
      <div className="max-w-[80%]">
        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1 group-hover:text-[#FF6B00] transition-colors">
          {label}
        </p>
        <h3 className="text-xl font-display font-black text-white italic truncate tracking-tighter">
          {value}
        </h3>
        {isExpandable && (
          <ChevronDown
            size={12}
            className="absolute bottom-2 right-2 text-zinc-700 group-hover:text-[#FF6B00]"
          />
        )}
      </div>
      <div className="text-zinc-800 group-hover:text-white transition-colors grayscale group-hover:grayscale-0">
        {icon}
      </div>
      <div className="absolute bottom-0 left-0 h-0.5 bg-[#FF6B00] w-0 group-hover:w-full transition-all duration-500" />
    </div>
  );
}
