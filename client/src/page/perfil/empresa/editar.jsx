import React, { useEffect, useState } from "react";

import Layout from "../../../layouts/layout";
import "../../../style/invitado/empresa.css";
import { manejarRespuesta } from "../../../services/manejarRespuesta";
import { API_CLIENT_URL, API_URL } from "../../../services/Api";

const EditarPerfilEmpresa = () => {
  const [empresa, setEmpresa] = useState({});
  const [preview, setPreview] = useState(null);

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
    const fetchEmpresa = async () => {
      try {
        const res = await fetch(`${API_URL}/api/empresas/perfil`);
        const data = await manejarRespuesta(res);
        setEmpresa(data.empresa || {});
      } catch (err) {
        console.error("Error cargando empresa:", err);
      }
    };
    fetchEmpresa();
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Layout title={`Editar ${empresa.nombre || "Empresa"} | SearchJobs`}>
      

      <div className="min-h-screen bg-sky-50/60 py-12">
        <form
          id="PerfilForm"
          data-id={empresa.idUsuario}
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
                    ? `${API_CLIENT_URL}/img/${empresa.imagen}`
                    : `${API_CLIENT_URL}/images/imgEmpresa.png`
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
                id="nombre"
                name="nombre"
                defaultValue={empresa.nombre}
                placeholder="Nombre de la empresa"
                className="w-full text-3xl font-semibold bg-transparent border-b-2 border-sky-200 focus:border-sky-500 focus:outline-none"
                required
              />
              <p className="error-text hidden" id="error-nombre"></p>

              <select
                id="sectorEmpresa"
                name="sectorEmpresarial"
                defaultValue={empresa.sectorEmpresarial}
                className="w-full rounded-lg border border-sky-200 bg-sky-50/40 py-2 px-3 focus:ring-2 focus:ring-sky-400"
                required
              >
                {sectores.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <p className="error-text hidden" id="error-sectorEmpresarial"></p>
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
                    type="text"
                    id="nit"
                    name="nit"
                    defaultValue={empresa.nit}
                    className="empresa-info-input"
                    placeholder="NIT de la empresa"
                    required
                  />
                  <p className="error-text hidden" id="error-nit"></p>
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
                    id="correo"
                    name="correo"
                    defaultValue={empresa.correo}
                    className="empresa-info-input"
                    placeholder="Correo electrónico"
                    required
                  />
                  <p className="error-text hidden" id="error-correo"></p>
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
                    type="tel"
                    id="telefono"
                    name="telefono"
                    defaultValue={empresa.telefono || ""}
                    className="empresa-info-input"
                    placeholder="Teléfono de contacto"
                  />
                  <p className="error-text hidden" id="error-telefono"></p>
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
                    id="sitioWeb"
                    name="sitioWeb"
                    defaultValue={empresa.sitioWeb || ""}
                    className="empresa-info-input"
                    placeholder="Sitio web (ejemplo.com)"
                  />
                  <p className="error-text hidden" id="error-sitioWeb"></p>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="empresa-descripcion-section">
              <h2 className="empresa-section-title">Descripción</h2>
              <textarea
                id="descripcion"
                name="descripcion"
                defaultValue={empresa.descripcion || ""}
                className="empresa-descripcion-input"
                placeholder="Describe tu empresa, su misión, visión y valores..."
              />
              <p className="error-text hidden" id="error-descripcion"></p>
            </div>

            {/* Botones */}
            <div className="empresa-form-actions">
              <button type="submit" className="empresa-save-button">
                Guardar cambios
              </button>
              <a href="/perfil/empresa/" className="empresa-cancel-button">
                Cancelar
              </a>
            </div>
          </div>
        </form>
      </div>

      
    </Layout>
  );
};

export default EditarPerfilEmpresa;
