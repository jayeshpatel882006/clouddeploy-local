import {
  LayoutDashboard,
  Rocket,
  Boxes,
  Activity,
  FileText,
  Database,
  Settings,
} from "lucide-react";

export const navigation = [
  {
    id: 1,
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    id: 2,
    title: "Deployments",
    path: "/deployments",
    icon: Rocket,
  },
  {
    id: 3,
    title: "Clusters",
    path: "/clusters",
    icon: Boxes,
  },
  {
    id: 4,
    title: "Monitoring",
    path: "/monitoring",
    icon: Activity,
  },
  {
    id: 5,
    title: "Logs",
    path: "/logs",
    icon: FileText,
  },
  {
    id: 6,
    title: "Registry",
    path: "/registry",
    icon: Database,
  },
  {
    id: 7,
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];
