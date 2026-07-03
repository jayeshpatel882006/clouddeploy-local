const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL] ?? LOG_LEVELS.info;

const timestamp = () => new Date().toISOString();

const formatMessage = (level, message, meta) => {
  const base = `[${timestamp()}] [${level.toUpperCase()}] ${message}`;
  if (meta) {
    return `${base} ${typeof meta === "object" ? JSON.stringify(meta) : meta}`;
  }
  return base;
};

const logger = {
  debug(message, meta) {
    if (currentLevel <= LOG_LEVELS.debug) {
      console.debug(formatMessage("debug", message, meta));
    }
  },

  info(message, meta) {
    if (currentLevel <= LOG_LEVELS.info) {
      console.log(formatMessage("info", message, meta));
    }
  },

  warn(message, meta) {
    if (currentLevel <= LOG_LEVELS.warn) {
      console.warn(formatMessage("warn", message, meta));
    }
  },

  error(message, meta) {
    if (currentLevel <= LOG_LEVELS.error) {
      console.error(formatMessage("error", message, meta));
    }
  },
};

export default logger;
