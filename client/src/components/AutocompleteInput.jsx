import { useState } from "react";
// value → valor actual del input.
// onChange → función para actualizar el valor en el estado padre.
// options → lista de elementos que se mostrarán en el autocomplete.
// placeholder → texto de placeholder.
// maxHeight → para controlar la altura máxima de la lista.
// className o listClassName → para estilos adicionales.

const AutocompleteInput = ({
  value,
  onChange,
  name,
  options = [],
  placeholder = "",
  maxHeight = "200px",
  className = "",
  listClassName = ""
}) => {
  const [showList, setShowList] = useState(false);

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(value?.toLowerCase() || "")
  );

  const handleSelect = (selectedValue) => {
    // Simula un evento de input normal
    onChange({ target: { name, value: selectedValue } });
    setShowList(false);
  };

  return (
    <div className={`relative `}>
      <input
        type="text"
        placeholder={placeholder}
        value={value || ""}
        name={name}
        onChange={(e) => {
          onChange(e); 
          setShowList(true);
        }}
        onBlur={() => setTimeout(() => setShowList(false), 100)}
        onFocus={() => setShowList(true)}
        autoComplete="off"
        className={className}
      />

      {showList && filteredOptions.length > 0 && (
        <ul
          className={`absolute z-[100] w-full overflow-y-auto bg-white border rounded shadow-md ${listClassName}`}
          style={{ maxHeight }}
        >
          {filteredOptions.map((opt, i) => (
            <li
              key={i}
              className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
              onMouseDown={() => handleSelect(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export default AutocompleteInput;
