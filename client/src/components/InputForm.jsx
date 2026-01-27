import { useEffect, useState } from "react";
import { validateRule } from "../services/validacionForm";

export default function InputForm({
  as = "input",   // "input" | "textarea" | "select"
  type,
  name,
  value,
  placeholder,
  error,
  handleOnChange,
  autoComplete=undefined,
  children,
  className = "form-control",
  minL = 0,
  maxL = undefined,
  rules = null,
  isDisabled= false,
  submitted
}) {
  const backendError = error?.fieldErrors?.find( error => error.field === name)?.message;
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (!rules || !rules[name]) return;

    for (const rule of rules[name]) {
      const mensaje = validateRule(rule, value);
      if (mensaje) {
        setLocalError(mensaje);
        return;
      }
    }
    setLocalError(null);
  }, [value, rules, name]);

  const fieldError = localError || backendError ;

  const Component = as; // aquí decides si es input, textarea o select

  return (
    <>
      <Component
        id={name}
        name={name}
        value={value}
        onChange={handleOnChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={isDisabled}
        className={`${className} ${(fieldError && submitted) ? "error-input" : ""}`}
        {...(type ? { type } : {})}
        {...(as === "input" && type === "number" ? { min: minL } : {})}
        {...(as === "input" && type === "text" ? { maxLength: maxL } : {})}
        {...(as === "select" ? { children } : {})} 
      />
      {as != "select" && children} 
      {(submitted && fieldError) && <p className="error-text">{fieldError}</p>}
    </>
  );
}
