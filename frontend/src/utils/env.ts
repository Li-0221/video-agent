export const getEnv = (key: string): string => {
  if (window.__ENV__ && window.__ENV__[key]) {
    return window.__ENV__[key]!;
  }

  return import.meta.env[key] || '';
};

export const getEnvJson = <T = any>(key: string, fallback?: T): T | undefined => {
  const value = getEnv(key);
  if (!value) return fallback;

  try {
    return JSON.parse(value);
  } catch {
    console.warn(`Failed to parse JSON for env key: ${key}`);
    return fallback;
  }
};

// Usage example - export commonly used configs
export const API_BASE_URL = getEnv('VITE_SERVICE_BASE_URL');
export const OTHER_SERVICE_BASE_URL = getEnvJson<Record<string, string>>('VITE_OTHER_SERVICE_BASE_URL');
