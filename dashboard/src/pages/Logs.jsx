import { useState } from "react";
import { motion } from "framer-motion";
import LogsHeader from "@/components/logs/LogsHeader";
import LogViewer from "@/components/logs/LogViewer";

const Logs = () => {
  const [selectedSource, setSelectedSource] = useState("all");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 flex flex-col flex-1 min-h-0"
    >
      <LogsHeader
        selectedSource={selectedSource}
        onSourceChange={setSelectedSource}
      />

      <div className="flex-1 min-h-0 relative">
        <LogViewer selectedSource={selectedSource} />
      </div>
    </motion.div>
  );
};

export default Logs;
