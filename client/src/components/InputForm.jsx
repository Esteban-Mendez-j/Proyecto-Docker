export default function InputForm({ type , name, value,  placeholder, error, handleOnChange, autoComplete, children}) {
    
    const fieldError = error?.[name];  
    
    return (
        <>
            <input
                type={type}
                id={name}
                name={name}
                className= {`form-control ${fieldError && "error-input" }`}
                placeholder={placeholder}
                value={value}
                required
                onChange={handleOnChange}
                autoComplete={autoComplete}
            />

            {children}
            {fieldError && <p className="error-text">{fieldError}</p>}        
        </>
    );
}
