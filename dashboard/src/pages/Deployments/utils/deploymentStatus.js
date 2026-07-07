import {
  Clock,
  RefreshCw,
  HardDrive,
  Upload,
  Rocket,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { isTerminalStatus } from "@/utils/status";

/**
 * Status configuration for every backend deployment status.
 * Each entry defines the display label, color theme, and icon.
 */
export const STATUS_CONFIG = {
  REGISTERED: {
    label: "Registered",
    color: "blue",
    icon: Clock,
    dot: "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]",
    badge:
      "bg-blue-500/10 text-blue-400 border-blue-500/20",
    order: 0,
  },
  CLONING: {
    label: "Cloning",
    color: "blue",
    icon: RefreshCw,
    dot: "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]",
    badge:
      "bg-blue-500/10 text-blue-400 border-blue-500/20",
    order: 1,
  },
  BUILDING: {
    label: "Building",
    color: "yellow",
    icon: HardDrive,
    dot: "bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.5)]",
    badge:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    order: 2,
  },
  PUSHING: {
    label: "Pushing",
    color: "yellow",
    icon: Upload,
    dot: "bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.5)]",
    badge:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    order: 3,
  },
  DEPLOYING: {
    label: "Deploying",
    color: "purple",
    icon: Rocket,
    dot: "bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.5)]",
    badge:
      "bg-purple-500/10 text-purple-400 border-purple-500/20",
    order: 4,
  },
  RUNNING: {
    label: "Running",
    color: "green",
    icon: CheckCircle2,
    dot: "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]",
    badge:
      "bg-green-500/10 text-green-400 border-green-500/20",
    order: 5,
  },
  FAILED: {
    label: "Failed",
    color: "red",
    icon: AlertCircle,
    dot: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]",
    badge:
      "bg-red-500/10 text-red-400 border-red-500/20",
    order: 6,
  },
};

export const getStatusConfig = (status) =>
  STATUS_CONFIG[status] || STATUS_CONFIG.FAILED;

export const isTransientStatus = (status) =>
  ["REGISTERED", "CLONING", "BUILDING", "PUSHING", "DEPLOYING"].includes(status);

export { isTerminalStatus };

export const STATUSES = Object.keys(STATUS_CONFIG);
