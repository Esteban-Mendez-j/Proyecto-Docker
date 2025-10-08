export default function InputForm({ type , name, value,  placeholder, error, handleOnChange, autoComplete, children, className="form-control"}) {
    
    const fieldError = error?.[name];  
    
    return (
        <>
            <input
                type={type}
                id={name}
                name={name}
                className= { `${className} ${fieldError && "error-input" }`}
                placeholder={placeholder}
                value={value}
                required
                onChange={handleOnChange}
                autoComplete={autoComplete}
                min={type=="number"? "0": undefined}
            />

            {children}
            {fieldError && <p className="error-text">{fieldError}</p>}        
        </>
    );
}
