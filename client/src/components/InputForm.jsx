export default function InputForm({
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
  maxL = undefined
}) {
  const fieldError = error?.[name];

  return (
    <>
      <input
        type={type}
        id={name}
        name={name}
        className={`${className} ${fieldError && "error-input"}`}
        placeholder={placeholder}
        value={value}
        required
        onChange={handleOnChange}
        autoComplete={autoComplete}
        min={type == "number" ? minL : undefined}
        maxLength={type == "number" && maxL}
      />

      {children}
      {fieldError && <p className="error-text">{fieldError}</p>}
    </>
  );
}
