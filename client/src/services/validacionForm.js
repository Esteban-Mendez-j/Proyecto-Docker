// ========================================
// 1. Reglas reutilizables para formularios
// ========================================

export const rules = {
  required: (message = "Campo obligatorio") => ({
    type: "required",
    message,
  }),

  minNumber: (min, message) => ({
    type: "minNumber",
    min,
    message: message || `El valor debe ser mayor o igual a ${min}`,
  }),

  maxNumber: (max, message) => ({
    type: "maxNumber",
    max,
    message: message || `El valor debe ser menor o igual a ${max}`,
  }),

  minLength: (min, message) => ({
    type: "minLength",
    min,
    message: message || `Debe tener al menos ${min} caracteres`,
  }),

  maxLength: (max, message) => ({
    type: "maxLength",
    max,
    message: message || `Debe tener máximo ${max} caracteres`,
  }),

  email: (message = "Correo inválido") => ({
    type: "email",
    message,
  }),

  number: (message = "Debe ser un número") => ({
    type: "number",
    message,
  }),

  positive: (message = "Debe ser un número positivo") => ({
    type: "positive",
    message,
  }),

  youtubeUrl: (message = "Debe ser un enlace de YouTube válido") => ({
    type: "youtubeUrl",
    message,
  }),

  maxMb: (max, message) => ({
    type: "maxMb",
    max,
    message: message || `Debe tener máximo ${max}megabyte`,
  }),
};



// ========================================
// 2. Validador general de formularios
// ========================================

export function validateForm(form, formRules) {
  const errors = {};

  for (const field in formRules) {
    const value = form[field] ?? ""; // evita undefined/null
    const fieldRules = formRules[field];

    for (const rule of fieldRules) {
      let error = null;

      // normalizar strings
      const v = typeof value === "string" ? value.trim() : value;

      switch (rule.type) {
        case "required":
          if (v === "" || v === null || v === undefined) {
            error = rule.message;
          }
          break;

        case "minLength":
          if (v && String(v).length < rule.min) {
            error = rule.message;
          }
          break;


        case "maxLength":
          if (String(v).length > rule.max) {
            error = rule.message;
          }
          break;

        case "email":
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v))) {
            error = rule.message;
          }
          break;

        case "number":
          if (v !== "" && isNaN(Number(v))) {
            error = rule.message;
          }
          break;

        case "positive":
          if (v !== "" && Number(v) < 0) {
            error = rule.message;
          }
          break;

        case "youtubeUrl":
          const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}([&?].*)?$/;
          if (value && !youtubeRegex.test(value)) {
            error = rule.message;
          }
          break;
        case "maxMb":
    
        if (value) {
          const maxBytes = rule.max * 1024 * 1024; // convertir MB a bytes
          if (value.size > maxBytes) {
            error = rule.message;
          }
        }
        break;
      }

      if (error) {
        errors[field] = error;
        break; // solo 1 error por campo
      }
    }
  }

  return errors;
}



// ========================================
// 3. Reglas específicas para el formulario 
//    de creación/edición de una vacante
// ========================================

export const formRulesVacante = {
  titulo: [
    rules.required(),
    rules.minLength(10),
    rules.maxLength(100),
  ],

  ciudad: [
    rules.required(),
  ],

  sueldo: [
    rules.number(),
    rules.positive(),
    rules.maxNumber(100000000000)
  ],

  tipo: [
    rules.required(),
  ],

  modalidad: [
    rules.required(),
  ],

  cargo: [
    rules.required(),
    rules.minLength(5),
    rules.maxLength(50),
  ],

  experiencia: [
    rules.required(),
    rules.number(),
    rules.positive(),
    rules.maxNumber(90)
  ],

  descripcion: [
    rules.required(),
    rules.minLength(20),
    rules.maxLength(400)
  ],

  requerimientos: [
    rules.required(),
    rules.minLength(20),
    rules.maxLength(400)
  ],

};


export const formRulesEmpresa = {
  nombre: [
    rules.required(),
    rules.minLength(3, "Debe tener al menos 3 caracteres"),
    rules.maxLength(50, "Debe tener máximo  50 caracteres"),
  ],

  nit: [
    rules.required("NIT es obligatorio"),
    rules.number("Debe ser un número"),
    rules.minNumber(100000000, "Debe tener al menos 9 dígitos"),
    rules.maxNumber(999999999, "No puede tener más de 9 dígitos"),
  ],

  sectorEmpresa: [
    rules.required("Selecciona un sector"),
  ],

  correo: [
    rules.required("Correo corporativo obligatorio"),
    rules.email("Correo inválido"),
    rules.maxLength(100)
  ],

  telefono: [
    rules.required("Teléfono obligatorio"),
    rules.number("Debe ser un número"),
    rules.minLength(10, "Debe tener 10 dígitos"),
    rules.maxLength(10, "Debe tener 10 dígitos"),
  ],

  contrasena: [
    rules.required("Contraseña obligatoria"),
    rules.minLength(8, "La contraseña debe tener al menos 8 caracteres"),
    rules.maxLength(15, "La contraseña debe tener máximo 15 caracteres"),
    // podrías agregar reglas personalizadas para mayúsculas, minúsculas, números
  ],

  contraseñaVerificada: [
    rules.required("Confirmar contraseña es obligatorio"),
    // Puedes agregar una regla custom para validar que coincida con 'contrasena'
  ],

  descripcion: [
    rules.minLength(20),
    rules.maxLength(400)
  ],

  imagen: [
    rules.maxMb(4)
  ]
};

export const formRulesCandidato = {
  nombre: [
    rules.required(),
    rules.minLength(3, "Debe tener al menos 3 caracteres"),
    rules.maxLength(50, "Debe tener máximo  50 caracteres"),
  ],

  identificacion: [
    rules.required(),
    rules.number("Debe ser un número"),
    rules.minLength(10, "Debe tener 10 dígitos"),
    rules.maxLength(10, "Debe tener 10 dígitos"),
  ],

  apellido: [
    rules.required(),
    rules.minLength(3, "Debe tener al menos 3 caracteres"),
    rules.maxLength(20, "Debe tener máximo 20 caracteres"),
  ],

  correo: [
    rules.required("Correo obligatorio"),
    rules.email("Correo inválido"),
    rules.maxLength(100)
  ],

  telefono: [
    rules.required("Teléfono obligatorio"),
    rules.number("Debe ser un número"),
    rules.minLength(10, "Debe tener 10 dígitos"),
    rules.maxLength(10, "Debe tener 10 dígitos"),
  ],

  contrasena: [
    rules.required("Contraseña obligatoria"),
    rules.minLength(8, "La contraseña debe tener al menos 8 caracteres"),
    rules.maxLength(15, "La contraseña debe tener máximo 15 caracteres"),
    // podrías agregar reglas personalizadas para mayúsculas, minúsculas, números
  ],

  contraseñaVerificada: [
    rules.required("Confirmar contraseña es obligatorio"),
    // Puedes agregar una regla custom para validar que coincida con 'contrasena'
  ],

  nivelEducativo:[
    rules.maxLength(30)
  ],

  descripcion: [
    rules.minLength(20),
    rules.maxLength(400)
  ],

  imagen: [
    rules.maxMb(4)
  ],

  curriculo: [
    rules.maxMb(4)
  ],

  experiencia: [
    rules.number(),
    rules.positive(),
    rules.maxNumber(90)
  ],
};

export function validateRule(rule, value) {
  const v = typeof value === "string" ? value.trim() : value;

  switch (rule.type) {
    case "required":
      if (!v) return rule.message;
      break;

    case "minLength":
      if (v && String(v).length < rule.min) {
        return rule.message;
      }
      break;

    case "maxLength":
      if (String(v).length > rule.max) return rule.message;
      break;

    case "email":
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)))
        return rule.message;
      break;

    case "number":
      if (v !== "" && isNaN(Number(v))) {
        return rule.message;
      }
      break;

    case "positive":
      if (v !== "" && Number(v) < 0) {
        return rule.message;
      }
      break;


    case "youtubeUrl":
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}([&?].*)?$/;
      if (v && !youtubeRegex.test(v)) return rule.message;
      break;
      
    case "minNumber":
      if (v < rule.min) return rule.message;
      break;

    case "maxNumber":
      if (v > rule.max) return rule.message;
      break;

    case "maxMb":
      if (value instanceof File) {
        const maxBytes = rule.max * 1024 * 1024; // convertir MB a bytes
        if (value.size > maxBytes) {
          return rule.message;
        }
      }
      break;

  }

  return null;
}
