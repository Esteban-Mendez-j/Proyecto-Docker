import { f as createComponent, i as renderComponent, r as renderTemplate } from '../../../chunks/astro/server_BYoYEapS.mjs';
import 'kleur/colors';
import { $ as $$Footer, H as Header } from '../../../chunks/Footer_BR33Q6Xf.mjs';
import { $ as $$Layout } from '../../../chunks/Layout_DMqpAtD-.mjs';
/* empty css                                      */
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import { A as API_URL } from '../../../chunks/Api_4ZQkpW66.mjs';
export { renderers } from '../../../renderers.mjs';

async function manejarFormulario({ form, validateForm, buildData, endpointUrl, redirectUrl, metodo, tipo = "application/json" }) {
  limpiarErrores();

  if (!validateForm()) {
    await Swal.fire({ text: "Por favor, complete los campos correctamente.", icon: 'info' });    return;
  }

  try {
    const formData = new FormData(form);
    const data = buildData(formData);
    let response;

    if (tipo === "application/json") {
      response = await fetch(endpointUrl, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: 'include'
      });
    } else if (tipo === "multipart/form-data") {
      response = await fetch(endpointUrl, {
        method: metodo,
        body: buildData(formData),
        credentials: 'include'
      });
    } else {
      throw new Error("Tipo de contenido no soportado");
    }

    const responseData = await response.json();
    if (responseData.status === 201) {
      form.reset();
      await Swal.fire({ text: responseData.mensaje || "Formulario enviado correctamente", icon: 'success' }); if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    }
    else if (responseData.status === 200) {
      form.reset();
      await Swal.fire({ text: responseData.mensaje || "Porceso exitoso!", icon: 'success' }); if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    }
    else if (responseData.errors) {
      mostrarErrores(responseData.errors);
    }
    else {
      await Swal.fire({ text: responseData.mensaje|| "Error desconocido", icon: 'error' });
    }

  } catch (error) {
    await Swal.fire({ text: "Error al conectar con el servidor", icon: 'error' });    console.error(error);
  }
}

function limpiarErrores() {
  const errorFields = document.querySelectorAll('.error-text');
  const errorInput = document.querySelectorAll('.error-input');
  errorInput.forEach(input => input.classList.remove("error-input"));
  errorFields.forEach(field => {
    field.textContent = "";
    field.classList.add('hidden');
  });
}

function mostrarErrores(errors) {
  for (let fieldName in errors) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    const labelError = document.getElementById(`error-${fieldName}`);
    if (field && labelError) {
      field.classList.add('error-input');
      labelError.classList.remove("hidden");
      labelError.textContent = errors[fieldName];
    }
  }
}

const tmpId = () => crypto.randomUUID();
function HistorialYEstudios() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [candidato, setCandidato] = useState({});
  const [estudios, setEstudios] = useState([]);
  const [historialLaboral, setHistorial] = useState([]);
  const [previewImg, setPreviewImg] = useState(null);
  const fotoRef = useRef(null);
  const cvRef = useRef(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/candidatos/perfil`, {
          credentials: "include"
        });
        const data = await res.json();
        setCandidato(data.candidato || {});
        setEstudios((data.estudios || []).map((e) => ({ ...e, _tmpId: tmpId() })));
        setHistorial((data.historialLaboral || []).map((h) => ({ ...h, _tmpId: tmpId() })));
      } catch {
        setError("Error al obtener perfil");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImg(url);
    } else {
      setPreviewImg(null);
    }
  };
  const agregarEstudio = () => setEstudios([
    ...estudios,
    { _tmpId: tmpId(), idEstudio: null, titulo: "", academia: "", idUsuario: candidato.idUsuario }
  ]);
  const eliminarEstudio = (id) => setEstudios(estudios.filter((e) => (e.idEstudio ?? e._tmpId) !== id));
  const actualizarEstudio = (id, campo, valor) => setEstudios(
    estudios.map(
      (e) => (e.idEstudio ?? e._tmpId) === id ? { ...e, [campo]: valor } : e
    )
  );
  const agregarHistorial = () => setHistorial([
    ...historialLaboral,
    {
      _tmpId: tmpId(),
      idHistorial: null,
      titulo: "",
      empresa: "",
      idUsuario: candidato.idUsuario
    }
  ]);
  const eliminarHistorial = (id) => setHistorial(
    historialLaboral.filter((h) => (h.idHistorial ?? h._tmpId) !== id)
  );
  const actualizarHistorial = (id, campo, valor) => setHistorial(
    historialLaboral.map(
      (h) => (h.idHistorial ?? h._tmpId) === id ? { ...h, [campo]: valor } : h
    )
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const estudiosEnviar = estudios.map(({ _tmpId, ...rest }) => rest);
    const historialEnviar = historialLaboral.map(({ _tmpId, ...rest }) => rest);
    try {
      const [respEst, respHist] = await Promise.all([
        fetch(`${API_URL}/api/estudios/replace/${candidato.idUsuario}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(estudiosEnviar),
          credentials: "include"
        }),
        fetch(`${API_URL}/api/historialLaborals/replace/${candidato.idUsuario}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(historialEnviar),
          credentials: "include"
        })
      ]);
      if (!respEst.ok || !respHist.ok) {
        const mensajeEst = (!respEst.ok ? (await respEst.json().catch(() => ({}))).mensaje : "") || "";
        const mensajeHist = (!respHist.ok ? (await respHist.json().catch(() => ({}))).mensaje : "") || "";
        throw new Error(`${mensajeEst} ${mensajeHist}`.trim() || "Error al actualizar datos");
      }
      await manejarFormulario({
        form: e.target,
        validateForm: () => !!candidato.nombre && !!candidato.apellido && !!candidato.correo && !!cvRef,
        buildData: (fd) => {
          fd.set(
            "candidato",
            new Blob(
              [
                JSON.stringify({
                  ...candidato,
                  idUsuario: candidato.idUsuario
                })
              ],
              { type: "application/json" }
            )
          );
          return fd;
        },
        endpointUrl: `${API_URL}/api/candidatos/edit/${candidato.idUsuario}`,
        redirectUrl: "/perfil/candidato",
        // ya redirigiremos al final
        metodo: "PUT",
        tipo: "multipart/form-data"
      });
    } catch (err) {
      console.error(err);
      await Swal.fire({
        icon: "error",
        text: err.message || "Ocurrió un error actualizando tu perfil"
      });
    }
  };
  if (loading) return /* @__PURE__ */ jsx("p", { className: "p-8 text-center", children: "Cargando…" });
  if (error) return /* @__PURE__ */ jsx("p", { className: "p-8 text-center text-red-600", children: error });
  return /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-4xl p-4", children: /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: handleSubmit,
      encType: "multipart/form-data",
      className: "space-y-8 rounded-2xl bg-white p-6 shadow-lg",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 md:flex-row md:items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 md:w-1/3", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: previewImg ? previewImg : candidato.imagen ? `${API_URL}/img/${candidato.imagen}` : `${API_URL}/images/imgCandidato.png`,
                alt: "avatar",
                className: "h-32 w-32 rounded-full object-cover shadow"
              }
            ),
            /* @__PURE__ */ jsxs("label", { className: "cursor-pointer text-sm font-medium text-primary-600 hover:underline", children: [
              "Cambiar foto",
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "file",
                  name: "img",
                  accept: "image/*",
                  ref: fotoRef,
                  className: "hidden",
                  onChange: handleFotoChange
                }
              )
            ] }),
            /* @__PURE__ */ jsx("p", { className: "error-text hidden", id: "error-imagen" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 md:flex-row", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col w-full md:w-1/2", children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "nombre", className: "mb-1 text-sm font-medium", children: "Nombre" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    id: "nombre",
                    placeholder: "Nombre",
                    name: "nombre",
                    value: candidato.nombre || "",
                    onChange: (e) => setCandidato({ ...candidato, nombre: e.target.value }),
                    className: "w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 "
                  }
                ),
                /* @__PURE__ */ jsx("p", { id: "error-nombre", className: "error-text hidden mt-1 text-xs text-red-500" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col w-full md:w-1/2", children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "apellido", className: "mb-1 text-sm font-medium", children: "Apellido" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    id: "apellido",
                    placeholder: "Apellido",
                    name: "apellido",
                    value: candidato.apellido || "",
                    onChange: (e) => setCandidato({ ...candidato, apellido: e.target.value }),
                    className: "w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 "
                  }
                ),
                /* @__PURE__ */ jsx("p", { id: "error-apellido", className: "error-text hidden mt-1 text-xs text-red-500" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 sm:flex-row sm:items-center text-sm", children: [
              /* @__PURE__ */ jsxs("label", { className: "inline-flex w-max cursor-pointer items-center gap-2 rounded-full bg-blue-500 px-4 py-2 font-medium text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300", children: [
                /* @__PURE__ */ jsxs(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    className: "h-4 w-4 shrink-0",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    strokeWidth: 2,
                    children: [
                      /* @__PURE__ */ jsx("path", { d: "M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" }),
                      /* @__PURE__ */ jsx("polyline", { points: "7 11 12 6 17 11" }),
                      /* @__PURE__ */ jsx("line", { x1: "12", y1: "6", x2: "12", y2: "18" })
                    ]
                  }
                ),
                candidato.curriculo ? "Cambiar CV" : "Subir CV",
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "file",
                    name: "pdf",
                    accept: "application/pdf",
                    ref: cvRef,
                    className: "hidden"
                  }
                )
              ] }),
              candidato.curriculo && /* @__PURE__ */ jsxs(
                "a",
                {
                  href: `${API_URL}/pdf/${candidato.curriculo}`,
                  target: "_blank",
                  rel: "noreferrer",
                  className: "inline-flex w-max cursor-pointer items-center gap-2 rounded-full bg-blue-500 px-4 py-2 font-medium text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500",
                  children: [
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        xmlns: "http://www.w3.org/2000/svg",
                        className: "h-4 w-4",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        strokeWidth: 2,
                        children: /* @__PURE__ */ jsx("path", { d: "M12 5v14m7-7H5" })
                      }
                    ),
                    "Ver CV"
                  ]
                }
              ),
              /* @__PURE__ */ jsx("p", { id: "error-curriculo", className: "error-text hidden text-xs text-red-500" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col w-full", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "correo", className: "mb-1 text-sm font-medium", children: "Correo electrónico" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "correo",
                type: "email",
                name: "correo",
                placeholder: "Correo electrónico",
                value: candidato.correo || "",
                onChange: (e) => setCandidato({ ...candidato, correo: e.target.value }),
                className: "w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 "
              }
            ),
            /* @__PURE__ */ jsx(
              "p",
              {
                id: "error-correo",
                className: "error-text hidden mt-1 text-xs text-red-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col w-full", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "telefono", className: "mb-1 text-sm font-medium", children: "Teléfono" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "telefono",
                name: "telefono",
                placeholder: "Teléfono",
                value: candidato.telefono || "",
                onChange: (e) => setCandidato({ ...candidato, telefono: e.target.value }),
                className: "w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 "
              }
            ),
            /* @__PURE__ */ jsx(
              "p",
              {
                id: "error-telefono",
                className: "error-text hidden mt-1 text-xs text-red-500"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 md:flex-row", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col w-full md:w-1/2", children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1 text-sm font-medium", children: "Identificación" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                name: "identificacion",
                placeholder: "Identificación",
                value: candidato.identificacion || "",
                onChange: (e) => setCandidato({ ...candidato, identificacion: e.target.value }),
                className: "w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 "
              }
            ),
            /* @__PURE__ */ jsx("p", { id: "error-identificacion", className: "error-text mt-1 text-red-500 text-xs hidden" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col w-full md:w-1/2", children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1 text-sm font-medium", children: "Años de experiencia laboral" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: "0",
                name: "experiencia",
                placeholder: "Años de experiencia",
                value: candidato.experiencia || "",
                onChange: (e) => setCandidato({ ...candidato, experiencia: e.target.value }),
                className: "w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 "
              }
            ),
            /* @__PURE__ */ jsx("p", { id: "error-experiencia", className: "error-text mt-1 text-red-500 text-xs hidden" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-2 text-lg font-semibold", children: "Descripción" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              className: "h-32 w-full resize-none rounded-2xl border border-gray-300 p-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200",
              placeholder: "Cuéntanos sobre ti, tus habilidades y experiencia…",
              value: candidato.descripcion || "",
              name: "descripcion",
              onChange: (e) => setCandidato({ ...candidato, descripcion: e.target.value }),
              required: true
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "error-text hidden", id: "error-descripcion" })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsxs("header", { className: "mb-4 flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "Estudios" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: agregarEstudio,
                className: "btn-primary inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm",
                children: "+ Añadir"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            estudios.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "No tienes estudios registrados." }),
            estudios.map((est) => {
              const key = est.idEstudio ?? est._tmpId;
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "relative pl-8 before:absolute before:left-3 before:top-2 before:h-3 before:w-3 before:-translate-x-1/2 before:rounded-full before:bg-primary-500",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                        /* @__PURE__ */ jsx("label", { htmlFor: `titulo-${key}`, className: "mb-1 text-sm font-medium", children: "Título" }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            id: `titulo-${key}`,
                            placeholder: "Título",
                            name: "titulo",
                            value: est.titulo,
                            onChange: (e) => actualizarEstudio(key, "titulo", e.target.value),
                            className: "w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                          }
                        ),
                        /* @__PURE__ */ jsx("p", { id: "error-titulo", className: "error-text hidden mt-1 text-xs text-red-500" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                        /* @__PURE__ */ jsx("label", { htmlFor: `academia-${key}`, className: "mb-1 text-sm font-medium", children: "Institución" }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            id: `academia-${key}`,
                            placeholder: "Institución",
                            name: "academia",
                            value: est.academia,
                            onChange: (e) => actualizarEstudio(key, "academia", e.target.value),
                            className: "w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                          }
                        ),
                        /* @__PURE__ */ jsx("p", { id: "error-academia", className: "error-text hidden mt-1 text-xs text-red-500" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => eliminarEstudio(key),
                        className: "mt-2 text-sm text-red-600 hover:underline",
                        children: "Eliminar"
                      }
                    )
                  ]
                },
                key
              );
            })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsxs("header", { className: "mb-4 flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "Historial laboral" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: agregarHistorial,
                className: "btn-primary inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm",
                children: "+ Añadir"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            historialLaboral.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "No tienes experiencia laboral registrada." }),
            historialLaboral.map((exp) => {
              const key = exp.idHistorial ?? exp._tmpId;
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "relative pl-8 before:absolute before:left-3 before:top-2 before:h-3 before:w-3 before:-translate-x-1/2 before:rounded-full before:bg-primary-500",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                        /* @__PURE__ */ jsx("label", { className: "mb-1 text-sm font-medium", children: "Cargo" }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            placeholder: "Cargo",
                            value: exp.titulo,
                            name: "titulo",
                            onChange: (e) => actualizarHistorial(key, "titulo", e.target.value),
                            className: "w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                        /* @__PURE__ */ jsx("label", { className: "mb-1 text-sm font-medium", children: "Empresa" }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            placeholder: "Empresa",
                            value: exp.empresa,
                            onChange: (e) => actualizarHistorial(key, "empresa", e.target.value),
                            className: "w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => eliminarHistorial(key),
                        className: "mt-2 text-sm text-red-600 hover:underline",
                        children: "Eliminar"
                      }
                    )
                  ]
                },
                key
              );
            })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: "rounded-full bg-blue-500 px-8 py-3 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300",
              children: "Guardar"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "reset",
              onClick: () => window.location.href = "/perfil/candidato",
              className: "rounded-full bg-gray-400 px-8 py-3 text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300",
              children: "Cancelar"
            }
          )
        ] })
      ]
    }
  ) });
}

const $$Editar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Editar Perfil | SearchJobs` }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/Header.jsx", "client:component-export": "default" })} ${renderComponent($$result2, "HistorialYEstudios", HistorialYEstudios, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/components/HistorialYEstudios.jsx", "client:component-export": "default" })}  `, "footer": ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer" })}` })}`;
}, "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/perfil/candidato/editar.astro", void 0);

const $$file = "C:/Users/Asus/OneDrive/Desktop/Proyecto-Docker/SearchJobs-front/src/pages/perfil/candidato/editar.astro";
const $$url = "/perfil/candidato/editar";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Editar,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
