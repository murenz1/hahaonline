import { useState, useCallback } from 'react';
import { Validator, validationRules, ValidationResult } from '../utils/validation';

interface UseValidationProps {
  initialValues: Record<string, any>;
  validationConfig: Record<string, any[]>;
}

export const useValidation = ({ initialValues, validationConfig }: UseValidationProps) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validator = new Validator();

  // Set up validation rules
  Object.entries(validationConfig).forEach(([field, rules]) => {
    rules.forEach((rule) => {
      validator.addRule(field, rule);
    });
  });

  const validateField = useCallback((field: string, value: any): ValidationResult => {
    return validator.validate(field, value);
  }, []);

  const validateAll = useCallback((): boolean => {
    const results = validator.validateAll(values);
    const newErrors: Record<string, string[]> = {};

    Object.entries(results).forEach(([field, result]) => {
      if (!result.isValid) {
        newErrors[field] = result.errors;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values]);

  const handleChange = useCallback((field: string, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    const result = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: result.isValid ? [] : result.errors,
    }));
  }, [validateField]);

  const handleBlur = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
}; 