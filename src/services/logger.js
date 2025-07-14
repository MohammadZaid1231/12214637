// Logging service as specified in the requirements
// This implements the logging middleware functionality

const LOG_LEVELS = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    fatal: 4
  };
  
  const LOG_COLORS = {
    debug: '#6c757d',
    info: '#17a2b8',
    warn: '#ffc107',
    error: '#dc3545',
    fatal: '#6f42c1'
  };
  
  // Mock API endpoint for logging (replace with actual endpoint)
  const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';
  
  // Log function that matches the required structure
  export const log = (stack, level, packageName, message) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      stack,
      level,
      package: packageName,
      message
    };
    
    // Console logging with colors (for development)
    const color = LOG_COLORS[level] || '#000000';
    console.log(
      `%c[${timestamp}] ${stack.toUpperCase()} - ${level.toUpperCase()} - ${packageName}: ${message}`,
      `color: ${color}; font-weight: bold;`
    );
    
    // Store logs in session storage for statistics
    const logs = JSON.parse(sessionStorage.getItem('applicationLogs') || '[]');
    logs.push(logEntry);
    
    // Keep only last 1000 logs to prevent memory issues
    if (logs.length > 1000) {
      logs.splice(0, logs.length - 1000);
    }
    
    sessionStorage.setItem('applicationLogs', JSON.stringify(logs));
    
    // Send to API (mock implementation)
    sendLogToAPI(logEntry);
  };
  
  // Send log to API
  const sendLogToAPI = async (logEntry) => {
    try {
      // Mock API call - replace with actual API call
      // This would normally send logs to the backend
      
      // Uncomment when actual API is ready
      /*
      const response = await fetch(LOG_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry)
      });
      
      if (!response.ok) {
        console.error('Failed to send log to API');
      }
      */
      
      // Mock success response
      return { success: true };
      
    } catch (error) {
      console.error('Error sending log to API:', error);
    }
  };
  
  // Get logs from session storage
  export const getLogs = () => {
    return JSON.parse(sessionStorage.getItem('applicationLogs') || '[]');
  };
  
  // Clear logs
  export const clearLogs = () => {
    sessionStorage.removeItem('applicationLogs');
  };
  
  // Filter logs by level
  export const getLogsByLevel = (level) => {
    const logs = getLogs();
    return logs.filter(log => log.level === level);
  };
  
  // Get logs by stack (frontend/backend)
  export const getLogsByStack = (stack) => {
    const logs = getLogs();
    return logs.filter(log => log.stack === stack);
  };
  
  // Get logs by package
  export const getLogsByPackage = (packageName) => {
    const logs = getLogs();
    return logs.filter(log => log.package === packageName);
  };
  
  // Get recent logs (last n entries)
  export const getRecentLogs = (count = 100) => {
    const logs = getLogs();
    return logs.slice(-count);
  };
  
  // Example usage patterns as shown in the requirements:
  // log("backend", "error", "handler", "received string, expected bool")
  // log("backend", "fatal", "db", "critical database connection failure.")
  
  // Initialize logging
  log('frontend', 'info', 'logger', 'Logging service initialized');