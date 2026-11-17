function writeLog(level, message, details = {}) {
  const log = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...details,
  };

  console.log(JSON.stringify(log));
}

export function logInfo(message, details = {}) {
  writeLog("INFO", message, details);
}

export function logError(message, details = {}) {
  writeLog("ERROR", message, details);
}