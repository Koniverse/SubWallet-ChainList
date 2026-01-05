export function flattenObject(data: Record<string, any>, prefix?: string): Record<string, any> {
  const result: Record<string, any> = {};

  if (typeof data !== 'object' || data === null) {
    return result;
  }

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'object' && value !== null) {
      result[key] = null;
      Object.assign(result, flattenObject(value, key));
    } else {
      const k = prefix ? `${prefix}.${key}` : key;
      result[k] = value;
    }
  }
  return result;
}