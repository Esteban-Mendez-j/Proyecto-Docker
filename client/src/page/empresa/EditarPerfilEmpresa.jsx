import { useEffect, useRef, useState } from "react";

import Layout from "../../layouts/Layout";
import { URL_IMAGEN } from "../../services/Api";
import "../../style/invitado/empresa.css";
import { Link, useNavigate } from "react-router-dom";
import { useFetch, useSendForm } from "../../hooks/useFetch";
import InputForm from "../../components/InputForm";
import { modalResponse } from "../../services/Modal";
import {sectores} from "../../services/data";
import { formRulesEmpresaEditar, validateForm } from "../../services/validacionForm";
import { ListSvg } from "../../components/Icons";

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
  const [submitted, setSubmitted] = useState(false);
  const [empresa, setEmpresa] = useState(initialData);
  const [preview, setPreview] = useState(null);
  const {data} = useFetch("/api/empresas/perfil", "GET");
  const { send , error, setError} = useSendForm();
  const fotoRef = useRef(null);
  const maxImgSize = 500

  useEffect(() => {
    if(!data){return}
    setEmpresa(data.empresa);
  }, [data]);

  const handleLogoChange = (e) => {
    
    const file = e.target.files[0];

    if (!file) {
      setPreview(null);
      return;
    }

    if (file.size >( maxImgSize * 1024)) {
      setError(prev => ({
        ...prev,
        img: `La imagen es demasiado pesada. Debe ser menor a ${maxImgSize}KB`
      }));
      e.target.value = "";
      setPreview(null);
      return;
    }
    
    setError(prev => ({
      ...prev,
      img: null
    }));
    const url = URL.createObjectURL(file);
    setPreview(url);
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

    setSubmitted(true)
    const newErrors = validateForm(empresa, formRulesEmpresaEditar);

    if (Object.keys(newErrors).length > 0) {
      console.log(newErrors)
      setError(newErrors);

      // Foco en el primer campo con error
      const firstErrorField = Object.keys(newErrors)[0];
      const el = document.getElementById(firstErrorField);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      }

      return; // detener envío o acción
    }
    setError(null);

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
          <div className="flex flex-col md:flex-row items-center gap-4">

            {/* Logo con botones arriba */}
            <div className="relative shrink-0 pb-6 px-12">

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
                className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md object-cover ring-4 ring-sky-200"
              />

              {/* BOTÓN EDITAR ENCIMA */}
              <label
                htmlFor="logo-upload"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2
             bg-sky-600 hover:bg-sky-700 text-white text-sm
             px-4 py-1.5 rounded-md cursor-pointer shadow-md flex items-center gap-1"
              >
                <ListSvg name={"editar"} width={18} height={18} nameClass="fill-none"/>
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

              <input type="hidden" name="imagen" value={empresa.imagen} />

              {/* Mensaje fijo */}
              <div className="h-5 mt-2">
                {!error?.img && (
                  <p className="text-ms text-gray-600 text-center">
                    Máx. <strong>{maxImgSize}KB</strong>
                  </p>
                )}
                {error?.img && (
                  <p
                    className="text-sm text-red-500 text-center font-medium  decoration-dotted cursor-help"
                    title={error.img}
                  >
                    Imagen muy Pesada
                  </p>

                )}
              </div>

            </div>

            {/* Inputs */}
            <div className="flex-1 w-full space-y-3">

              <InputForm
                type="text"
                name="nombre"
                value={empresa.nombre}
                placeholder="Nombre de la empresa"
                error={error}
                submitted={submitted}
                rules={formRulesEmpresaEditar}
                className="w-full text-2xl font-semibold bg-transparent border-b-2 border-sky-200 
                 focus:border-sky-500 focus:outline-none pb-1"
                handleOnChange={handleOnChange}
              />

              <InputForm
                as="select"
                name="sectorEmpresarial"
                value={empresa.sectorEmpresarial}
                handleOnChange={handleOnChange}
                error={error}
                submitted={submitted}
                rules={formRulesEmpresaEditar}
                className="form-control text-base px-3 py-2"
              >
                <option value="" disabled>Selecciona tu sector</option>
                {sectores.map((sector, index) => (
                  <option key={index} value={sector}>{sector}</option>
                ))}
              </InputForm>

            </div>

          </div>



          {/* Contenido del perfil */}
          <div className="empresa-perfil-content">
            {/* Información de contacto */}
            <div className="empresa-info-grid">
              {/* NIT */}
              <div className="empresa-info-item">
                <ListSvg name={"calendario"} height={16} width={16} />
                <div className="empresa-info-content">
                  <span className="empresa-info-label">NIT</span>
                  <InputForm
                    type="number"
                    name="nit"
                    value={empresa.nit || ""}
                    className="empresa-info-input"
                    placeholder="NIT de la empresa"
                    handleOnChange={handleOnChange}
                    minLength="9"
                    error={error}
                    submitted={submitted}
                    rules={formRulesEmpresaEditar}
                  />
                </div>
              </div>

              {/* Correo */}
              <div className="empresa-info-item">
                <ListSvg name={"correo"} height={16} width={16} />
                <div className="empresa-info-content">
                  <span className="empresa-info-label">Correo</span>
                  <InputForm
                    type="email"
                    name="correo"
                    value={empresa.correo || ""}
                    className="empresa-info-input"
                    placeholder="Correo electrónico"
                    handleOnChange={handleOnChange}
                    error={error}
                    submitted={submitted}
                    rules={formRulesEmpresaEditar}
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div className="empresa-info-item">
                <ListSvg name={"telefono"} height={16} width={16} />
                <div className="empresa-info-content">
                  <span className="empresa-info-label">Teléfono</span>
                  <InputForm
                    type="number"
                    name="telefono"
                    value={empresa.telefono || ""}
                    className="empresa-info-input"
                    placeholder="Teléfono de contacto"
                    handleOnChange={handleOnChange}
                    minLength="10"
                    error={error}
                    submitted={submitted}
                    rules={formRulesEmpresaEditar}
                  />
                </div>
              </div>

              {/* Sitio Web */}
              <div className="empresa-info-item">
                <ListSvg name={"mundoInternet"} height={16} width={16} />
                <div className="empresa-info-content">
                  <span className="empresa-info-label">Sitio Web</span>
                  <InputForm
                    type="url"
                    name="sitioWeb"
                    value={empresa.sitioWeb || ""}
                    className="empresa-info-input"
                    placeholder="Sitio web (ejemplo.com)"
                    handleOnChange={handleOnChange}
                    error={error}
                    submitted={submitted}
                    rules={formRulesEmpresaEditar}
                  />
                </div>
              </div>
            </div>

            {/* Video de Presentación */}
            <div className="empresa-info-item">
              <ListSvg name={"video"} height={16} width={16} />
              <div className="empresa-info-content">
                <span className="empresa-info-label">Video Presentación</span>
                <InputForm
                  type="text"
                  name="videoLink"
                  value={empresa.videoLink || ""}
                  className="empresa-info-input"
                  placeholder="https://youtu.be/abc123"
                  handleOnChange={handleOnChange}
                  error={error}
                  submitted={submitted}
                  rules={formRulesEmpresaEditar}
                />
              </div>
            </div>


            {/* Descripción */}
            <div className="empresa-descripcion-section">
              <h2 className="empresa-section-title">Descripción</h2>
              <InputForm
                as="textarea"
                rules={formRulesEmpresaEditar}
                submitted={submitted}
                name="descripcion"
                value={empresa.descripcion}
                error={error}
                className={`empresa-descripcion-input ${error?.descripcion ? "error-input" : ""}`}
                placeholder="Describe tu empresa, su misión, visión y valores..."
                handleOnChange={handleOnChange}
              />
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