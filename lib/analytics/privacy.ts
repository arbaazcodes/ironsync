/**
 * IronSync Analytics Privacy Sanitizer
 *
 * Strict privacy-by-design policy:
 * - NO raw body measurements (weight, height, bmi, body_fat, waist, etc.)
 * - NO health conditions, medical details, or injuries
 * - NO food allergy strings or raw restriction lists
 * - NO credentials, passwords, OTPs, auth tokens, or private secrets
 * - NO personal email or phone numbers in telemetry properties
 */

// Patterns matching prohibited field names
const FORBIDDEN_KEY_PATTERNS = [
  // Raw body measurements
  /weight/i,
  /height/i,
  /^bmi$/i,
  /body_?fat/i,
  /waist/i,
  /chest/i,
  /hips/i,
  /^measurement(s)?$/i,

  // Health and medical details
  /health/i,
  /medical/i,
  /condition/i,
  /injur/i,
  /diagnos/i,
  /medication/i,
  /disorder/i,
  /symptom/i,

  // Food allergy details & specific restriction lists
  /allerg/i,
  /restriction/i,
  /intoleran/i,

  // Passwords, OTPs, Tokens & Secrets
  /password/i,
  /^pass$/i,
  /otp/i,
  /^pin$/i,
  /token/i,
  /secret/i,
  /credential/i,
  /api_?key/i,

  // Direct contact identifiers in analytics properties (use identify() instead)
  /phone/i,
  /email/i,
];

/**
 * Checks if a property key violates privacy rules.
 */
export function isForbiddenKey(key: string): boolean {
  return FORBIDDEN_KEY_PATTERNS.some((pattern) => pattern.test(key));
}

/**
 * Sanitizes an event properties object by recursively stripping all forbidden keys.
 * Returns a clean, privacy-guaranteed copy.
 */
export function sanitizeProperties(properties?: Record<string, any>): Record<string, any> {
  if (!properties || typeof properties !== "object" || Array.isArray(properties)) {
    return {};
  }

  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(properties)) {
    if (isForbiddenKey(key)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[IronSync Analytics Privacy Warning] Key "${key}" was removed from event properties to protect user privacy.`
        );
      }
      continue;
    }

    if (value === null || value === undefined) {
      continue;
    }

    // Recursively sanitize nested objects
    if (typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
      const nested = sanitizeProperties(value);
      if (Object.keys(nested).length > 0) {
        sanitized[key] = nested;
      }
    } else if (Array.isArray(value)) {
      // For arrays, if they contain objects, sanitize each item
      const sanitizedArray = value
        .map((item) => {
          if (typeof item === "object" && item !== null && !Array.isArray(item)) {
            return sanitizeProperties(item);
          }
          // Do not allow arrays of strings if the key looks like allergies or conditions
          if (typeof item === "string" && /allerg|medic|injur|condit/i.test(key)) {
            return null;
          }
          return item;
        })
        .filter((item) => item !== null);

      sanitized[key] = sanitizedArray;
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
