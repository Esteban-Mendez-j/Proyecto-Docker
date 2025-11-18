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
  autoComplete,
  children,
  className = "form-control",
  minL = 0,
  maxL = undefined,
  rules = null,
  submitted
}) {
  const backendError = error?.[name];
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

  const fieldError = backendError || localError;

  const Component = as; // aquí decides si es input, textarea o select

  return (
    <>
      <Component
        id={name}
        name={name}
        value={value}
        onChange={handleOnChange}
        placeholder={placeholder}
        className={`${className} ${fieldError ? "error-input" : ""}`}
        {...(type ? { type } : {})}
        {...(as === "input" && type === "number" ? { min: minL } : {})}
        {...(as === "input" && type === "text" ? { maxLength: maxL } : {})}
        {...(as === "select" ? { children } : {})} 
      />
      {(submitted && fieldError) && <p className="error-text">{fieldError}</p>}
    </>
  );
}


// export default function InputForm({
//   type,
//   name,
//   value,
//   placeholder,
//   error,
//   handleOnChange,
//   autoComplete,
//   children,
//   className = "form-control",
//   minL = 0,
//   maxL = undefined,
//   rules = null,   // ← NUEVO
//   submitted
// }) {
//   const backendError = error?.[name];
//   const [localError, setLocalError] = useState(null);

//   useEffect(() => {
//     if (!rules) return;
//     if (!rules[name]) return;

//     for (const rule of rules[name]) {
//       const mensaje = validateRule(rule, value); 
//       if (mensaje) {
//         setLocalError(mensaje);
//         return;
//       }
//     }

//     setLocalError(null);
//   }, [value, rules, name]);


//   const fieldError = backendError || localError;

//   return (
//     <>
//       <input
//         type={type}
//         id={name}
//         name={name}
//         className={`${className} ${fieldError ? "error-input" : ""}`}
//         placeholder={placeholder}
//         value={value}
//         required
//         onChange={handleOnChange}
//         autoComplete={autoComplete}
//         min={type === "number" ? minL : undefined}
//         maxLength={type === "text" ? maxL : undefined}
//       />

//       {children}
//       {(submitted && fieldError) && (
//         <p className="error-text">{fieldError}</p>
//       )}
//     </>
//   );
// }



// export default function InputForm({
//   type,
//   name,
//   value,
//   placeholder,
//   error,
//   handleOnChange,
//   autoComplete,
//   children,
//   className = "form-control",
//   minL = 0,
//   maxL = undefined
// }) {
//   const fieldError = error?.[name];

//   return (
//     <>
//       <input
//         type={type}
//         id={name}
//         name={name}
//         className={`${className} ${fieldError && "error-input"}`}
//         placeholder={placeholder}
//         value={value}
//         required
//         onChange={handleOnChange}
//         autoComplete={autoComplete}
//         min={type == "number" ? minL : undefined}
//         maxLength={type == "text"? maxL: undefined}
//       />

//       {children}
//       {fieldError && <p className="error-text">{fieldError}</p>}
//     </>
//   );
// }
