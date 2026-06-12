"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingIcon as TrendingUp, TrendingIcon as Flame, RefreshIcon as RefreshCw } from "@/components/Icons/CustomIcons";
import { TrendingService } from "@/lib/services/trending.service";

interface TrendingItem {
  id: string;
  topic: string;
  momentum: number;
  platform: string;
}

interface TrendingPanelProps {
  intent?: string;
  refreshInterval?: number;
  onTrendSelect?: (trend: any, suggestedPrompt: string) => void;
}

export default function TrendingPanel({ intent, refreshInterval, onTrendSelect }: TrendingPanelProps) {
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrending = async () => {
      const topics = await TrendingService.getTrendingTopics();
      setTrending(topics);
      setLoading(false);
    };
    loadTrending();
  }, []);

  const refresh = async () => {
    setLoading(true);
    const topics = await TrendingService.getTrendingTopics();
    setTrending(topics);
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-black dark:text-white flex items-center gap-2">
          <Flame size={16} className="text-black dark:text-white" />
          Trending Now
        </h3>
        <button
          onClick={refresh}
          disabled={loading}
          className="p-1 hover:bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="space-y-2">
        {trending.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-gray-100 dark:bg-gray-800/30 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-gray-400 dark:border-gray-700 hover:bg-gray-100 dark:bg-gray-800/50 transition-all"
            onClick={() => {
              if (onTrendSelect) {
                onTrendSelect(item, `Create something with ${item.topic}`);
              }
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-xs font-medium text-black dark:text-white">{item.topic}</p>
                <p className="text-[10px] text-gray-600 dark:text-gray-200">{item.platform}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-black dark:text-white">{item.momentum}%</p>
                <div className="w-8 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-black transition-all"
                    style={{ width: `${item.momentum}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}



