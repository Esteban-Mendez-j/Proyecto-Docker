import { useEffect, useRef, useState } from "react";

import Layout from "../../../layouts/Layout.jsx";
import { URL_IMAGEN } from "../../../services/Api";
import "../../../style/invitado/empresa.css";
import { Link, useNavigate } from "react-router-dom";
import { useFetch, useSendForm } from "../../../hooks/useFetch.jsx";
import { modalResponse } from "../../../services/Modal";

const EditarPerfilEmpresa = () => {
  const initialData = {
    nombre: "",
    nit: "",
    correo: "",
    telefono: "",
    sectorEmpresarial: "",
    imagen: "",
    sitioWeb: "",
    descripcion: "",
     linkvideo: "",
  }

  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState(initialData);
  const [preview, setPreview] = useState(null);
  const {data} = useFetch("/api/empresas/perfil", "GET");
  const { send , error} = useSendForm();
  const fotoRef = useRef(null);

  const sectores = [
    "Tecnologia de la Informacion (TI) / Software",
    "Salud y Medicina",
    "Educacion y Formacion",
    "Construccion e Infraestructura",
    "Manufactura e Industria",
    "Comercio y Ventas",
    "Logistica y Transporte",
    "Banca, Finanzas y Seguros",
    "Agroindustria y Agricultura",
    "Legal y Juridico",
    "Turismo, Hoteleria y Gastronomia",
    "Medios, Comunicacion y Publicidad",
    "Energia y Mineria",
    "Servicios Profesionales y Consultoria",
    "Arte, Cultura y Entretenimiento",
    "Bienes Raices e Inmobiliaria",
    "Ciencia e Investigacion",
    "Organizaciones sin Fines de Lucro y ONG",
    "Otros",
  ];

  useEffect(() => {
    if(!data){return}
    setEmpresa(data.empresa);
  }, [data]);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setEmpresa(prev => ({
      ...prev,
      [name]: value
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      "empresa",
      new Blob([JSON.stringify(empresa)], { type: "application/json" })
    );

    if (fotoRef.current?.files[0]) {
      formData.append("img", fotoRef.current.files[0]);
    }

    const result = await send(`/api/empresas/edit/${empresa.idUsuario}`, "PUT", formData, null);

    if (result.status === 200) {
      const isOk = await modalResponse(result.mensaje, "success");
      if (isOk) {
        navigate("/perfil/empresa");
      }
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-sky-50/60 py-12">
        <form
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-5xl space-y-10 rounded-3xl bg-white/90 backdrop-blur shadow-2xl ring-1 ring-sky-100 p-10"
        >
          {/* Cabecera */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Logo */}
            <div className="relative shrink-0">
              <img
                id="logo-preview"
                src={
                  preview
                    ? preview
                    : empresa.imagen
                    ? `${URL_IMAGEN}${empresa.imagen}`
                    : `/imgEmpresa.png`
                }
                alt="Logo"
                className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover ring-4 ring-sky-200"
              />

              <label
                htmlFor="logo-upload"
                className="absolute -bottom-2 -right-2 grid place-items-center h-10 w-10 rounded-full bg-sky-600 hover:bg-sky-700 transition shadow-md text-white cursor-pointer"
                title="Cambiar logo"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 7h2l2-3h10l2 3h2a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V9a2 2 0 0 1 2-2Z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </label>

              <input
                id="logo-upload"
                ref={fotoRef}
                type="file"
                name="img"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />

              <input type="hidden" name="imagen" value={empresa.imagen || ""} />
              <p className="error-text hidden" id="error-imagen"></p>
            </div>

            {/* Nombre & Sector */}
            <div className="flex-1 w-full space-y-4">
              <input
                type="text"
                name="nombre"
                value={empresa.nombre || ""}
                placeholder="Nombre de la empresa"
                className="w-full text-3xl font-semibold bg-transparent border-b-2 border-sky-200 focus:border-sky-500 focus:outline-none"
                onChange={handleOnChange}
              />
              {error?.nombre && <p className="error-text">{error.nombre}</p>}

              <select 
                value={empresa.sectorEmpresarial || ""} 
                name="sectorEmpresarial" 
                className={`form-control ${error?.sectorEmpresarial ? "error-input" : ""}`} 
                required 
                onChange={handleOnChange}
              >
                <option value="" disabled>Selecciona tu sector</option>
                {sectores.map((sector, index) => (
                  <option key={index} value={sector}>{sector}</option>
                ))}
              </select>
              {error?.sectorEmpresarial && <p className="error-text">{error.sectorEmpresarial}</p>}
            </div>
          </div>

          {/* Contenido del perfil */}
          <div className="empresa-perfil-content">
            {/* Información de contacto */}
            <div className="empresa-info-grid">
              {/* NIT */}
              <div className="empresa-info-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <div className="empresa-info-content">
                  <span className="empresa-info-label">NIT</span>
                  <input
                    type="number"
                    name="nit"
                    value={empresa.nit || ""}
                    className="empresa-info-input"
                    placeholder="NIT de la empresa"
                    onChange={handleOnChange}
                    minLength="9"
                  />
                  {error?.nit && <p className="error-text">{error.nit}</p>}
                </div>
              </div>

              {/* Correo */}
              <div className="empresa-info-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <div className="empresa-info-content">
                  <span className="empresa-info-label">Correo</span>
                  <input
                    type="email"
                    name="correo"
                    value={empresa.correo || ""}
                    className="empresa-info-input"
                    placeholder="Correo electrónico"
                    onChange={handleOnChange}
                  />
                  {error?.correo && <p className="error-text">{error.correo}</p>}
                </div>
              </div>

              {/* Teléfono */}
              <div className="empresa-info-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <div className="empresa-info-content">
                  <span className="empresa-info-label">Teléfono</span>
                  <input
                    type="number"
                    name="telefono"
                    value={empresa.telefono || ""}
                    className="empresa-info-input"
                    placeholder="Teléfono de contacto"
                    onChange={handleOnChange}
                    minLength="10"
                  />
                  {error?.telefono && <p className="error-text">{error.telefono}</p>}
                </div>
              </div>

              {/* Sitio Web */}
              <div className="empresa-info-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <div className="empresa-info-content">
                  <span className="empresa-info-label">Sitio Web</span>
                  <input
                    type="url"
                    name="sitioWeb"
                    value={empresa.sitioWeb || ""}
                    className="empresa-info-input"
                    placeholder="Sitio web (ejemplo.com)"
                    onChange={handleOnChange}
                  />
                  {error?.sitioWeb && <p className="error-text">{error.sitioWeb}</p>}
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="empresa-descripcion-section">
              <h2 className="empresa-section-title">Descripción</h2>
              <textarea
                name="descripcion"
                value={empresa.descripcion || ""}
                className={`empresa-descripcion-input ${error?.descripcion ? "error-input" : ""}`}
                placeholder="Describe tu empresa, su misión, visión y valores..."
                onChange={handleOnChange}
              />
              {error?.descripcion && <p className="error-text">{error.descripcion}</p>}
            </div>

            {/* Video de Presentación */}
            <div className="empresa-info-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
              <div className="empresa-info-content">
                <span className="empresa-info-label">Video Presentación</span>
                <input
              type="text"
              name="videoLink"
              value={empresa.videoLink || ""}
              className="empresa-info-input"
              placeholder="https://youtu.be/abc123"
              onChange={handleOnChange}
            />

                {error?.linkvideo && <p className="error-text">{error.linkvideo}</p>}
              </div>
            </div>

            {/* Botones */}
            <div className="empresa-form-actions">
              <button type="submit" className="empresa-save-button">
                Guardar cambios
              </button>
              <Link to={"/perfil/empresa"} className="empresa-cancel-button">
                Cancelar
              </Link>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditarPerfilEmpresa;