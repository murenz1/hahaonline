interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class Validator {
  private rules: Map<string, ValidationRule[]> = new Map();

  public addRule(field: string, rule: ValidationRule): void {
    if (!this.rules.has(field)) {
      this.rules.set(field, []);
    }
    this.rules.get(field)?.push(rule);
  }

  public validate(field: string, value: any): ValidationResult {
    const fieldRules = this.rules.get(field) || [];
    const errors: string[] = [];

    for (const rule of fieldRules) {
      if (!rule.validate(value)) {
        errors.push(rule.message);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  public validateAll(data: Record<string, any>): Record<string, ValidationResult> {
    const results: Record<string, ValidationResult> = {};

    for (const [field, value] of Object.entries(data)) {
      results[field] = this.validate(field, value);
    }

    return results;
  }
}

// Common validation rules
export const validationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    validate: (value) => value !== undefined && value !== null && value !== '',
    message,
  }),

  email: (message = 'Invalid email format'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message,
  }),

  minLength: (min: number, message = `Minimum length is ${min}`): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return value.length >= min;
    },
    message,
  }),

  maxLength: (max: number, message = `Maximum length is ${max}`): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return value.length <= max;
    },
    message,
  }),

  number: (message = 'Must be a number'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return !isNaN(Number(value));
    },
    message,
  }),

  min: (min: number, message = `Minimum value is ${min}`): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return Number(value) >= min;
    },
    message,
  }),

  max: (max: number, message = `Maximum value is ${max}`): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return Number(value) <= max;
    },
    message,
  }),

  pattern: (pattern: RegExp, message = 'Invalid format'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return pattern.test(value);
    },
    message,
  }),
}; 