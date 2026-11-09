import { useEffect, useMemo, useState } from "react";
import { useSendFormV2 } from "../../hooks/useFetch.jsx";
import useFiltro from "../../hooks/useFiltro.jsx";
import ResumenMetricas from "../../components/prediccion/ResumenMetricas.jsx";
import TopCargosChart from "../../components/prediccion/TopCargosChart.jsx";
import DemandaComparativaChart from "../../components/prediccion/DemandaComparativaChart.jsx";
import EvolucionCargosChart from "../../components/prediccion/EvolucionCargosChart.jsx";
import RequisitosRadarChart from "../../components/prediccion/RequisitosRadarChart.jsx";
import Pagination from "../../components/Paginacion.jsx";
import "../../style/candidato/analisis-predictivo.css";
import "../../style/invitado/empleos.css"
import Layout from "../../layouts/layout.jsx";
import { ListSvg } from "../../components/icons.jsx";
import Loading from "../../components/Loading.jsx";

const ENDPOINT = "/api/prediccion/demanda-laboral/simulacion";
const LIMITE = 5;
const INITIAL_FILTERS = { cargo_name: "" };
const NAME_FILTERS = "filtrosPrediccionDemanda";

export default function AnalisisPredictivo() {

  const { send, data:resumen, meta, error, setError, loading: cargando } = useSendFormV2();
  const [currentPage, setCurrentPage] = useState(1);

  const [
    filtrosLocal,
    filtrosAplicados,
    handleOnFilters,
    clearFilters,
    searchFilters
  ] = useFiltro( INITIAL_FILTERS, setCurrentPage, NAME_FILTERS );

  const [cargoSeleccionado, setCargoSeleccionado] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [reload, setReload] = useState(0);


  // =====================================================
  // DATOS
  // =====================================================

  const cargos = resumen?.cargos ?? [];
  const horizonte = resumen?.horizonte_prediccion;
  const pagination = meta?.pagination;
  const totalAnalizados = pagination?.totalElements ?? cargos.length;
  const totalPages = pagination?.totalPage ?? 1;
  const cargosParaGraficos = useMemo( () => cargos.slice(0, LIMITE), [cargos]
  );

  // =====================================================
  // CONSULTAR PREDICCIÓN
  // =====================================================

  useEffect(() => {

    let activo = true;

    const consultarPrediccion = async () => {

      setError(null);

      const params = new URLSearchParams({
        limite: String(LIMITE),

        // El componente de paginación trabaja desde 1.
        // El backend trabaja desde 0.
        pagina: String(currentPage - 1)
      });

      const cargoName = filtrosAplicados.cargo_name?.trim();

      // Si hay un cargo seleccionado, se agrega el filtro.
      // Si está vacío, se consulta el listado general.
      if (cargoName) {
        params.set("cargo_name", cargoName);
      }

      const url = `${ENDPOINT}?${params.toString()}`;

      try {
        await send( url, "GET", undefined, { Accept: "application/json" });
      } catch (err) {
        if (activo) {
          setError(err);
        }
      }
    };

    consultarPrediccion();

    return () => {
      activo = false;
    };

  }, [currentPage, filtrosAplicados, reload]);


  // =====================================================
  // ACTUALIZAR CARGO SELECCIONADO
  // =====================================================

  useEffect(() => {

    if (!resumen?.cargos) {
      return;
    }

    const cargoName = filtrosAplicados.cargo_name?.trim();

    // Cuando se consulta un cargo específico,
    // el backend devuelve ese cargo como primer resultado.
    if (cargoName) {
      setCargoSeleccionado(resumen.cargos[0] ?? null);
      return;
    }

    // Cuando se consulta el listado general,
    // mantenemos el cargo seleccionado si sigue disponible.
    setCargoSeleccionado((actual) => {

      if (actual) {

        const encontrado = resumen.cargos.find(
          (cargo) => cargo.id === actual.id
        );

        if (encontrado) {
          return encontrado;
        }

      }

      return resumen.cargos[0] ?? null;

    });

  }, [resumen, filtrosAplicados.cargo_name]);

  const buscarCargo = (e) => {
    e.preventDefault();
    setBuscando(true);
    setError(null);
    // Cada nueva búsqueda comienza desde la primera página.
    setCurrentPage(1);
    // Aplica el filtro local y provoca la nueva consulta.
    searchFilters();
    setBuscando(false);
  };

  const limpiarBusqueda = () => {
    setCurrentPage(1);
    setError(null);
    clearFilters();
  };


  // =====================================================
  // SELECCIONAR CARGO PARA EL RADAR
  // =====================================================

  const seleccionarCargo = (cargo) => {
    setCargoSeleccionado(cargo);
  };


  // =====================================================
  // CAMBIAR PÁGINA
  // =====================================================

  const cambiarPagina = (pagina) => {
    if (pagina < 1 || pagina > totalPages) {
      return;
    }
    setCurrentPage(pagina);
  };


  // REINTENTAR CONSULTA
  const cargarResumen = () => { setError(null); setReload((prev) => prev + 1); };

  const mensajeError =
    error?.message ||
    error?.mensaje ||
    (typeof error === "string" ? error : null) ||
    "No fue posible consultar la predicción.";


  return (
    <Layout>
      <div className="prediction-page">
        <main className="prediction-container">

          <section className="prediction-intro">
            <h1>Análisis predictivo</h1>
            <p>
              Descubre cómo evolucionará la demanda de los cargos laborales.
            </p>
          </section>


          {/* BUSCADOR */}
          <form
            className="prediction-search"
            onSubmit={buscarCargo}
          >
            <span
              className="prediction-search__icon"
              aria-hidden="true"
            >
              <ListSvg
                name={"lupa"}
                width={20}
                height={20}
              />
            </span>

            <input
              type="text"
              name="cargo_name"
              value={filtrosLocal.cargo_name}
              onChange={handleOnFilters}
              placeholder="Buscar un cargo..."
              aria-label="Buscar un cargo"
              list="prediction-cargos"
            />

            <datalist id="prediction-cargos">
              {cargos.map((cargo) => (
                <option key={cargo.id} value={cargo.nombre}/>
              ))}
            </datalist>

            <button
              type="submit"
              disabled={buscando || cargando}
            >
              {buscando ? "Buscando..." : "Buscar"}
            </button>

            {filtrosLocal.cargo_name && (

              <button
                className="prediction-search__clear"
                type="button"
                aria-label="Limpiar búsqueda"
                onClick={limpiarBusqueda}
              >
                x
              </button>
            )}
          </form>


          {/* ERROR */}
          {error && (

            <div
              className="prediction-alert"
              role="alert"
            >
              <span>{mensajeError}</span>

              <button
                type="button"
                onClick={cargarResumen}
              >
                Reintentar
              </button>
            </div>

          )}


          {/* CONTENIDO */}
          {cargando ? (
            <Loading message="Analizando la demanda laboral..."/>
          ) : (
            <>
              {/* MÉTRICAS */}
              <ResumenMetricas
                cargos={cargos}
                totalAnalizados={totalAnalizados}
                horizonte={horizonte}
              />

              {/* GRÁFICO 1 */}
              <section className="prediction-chart-card">

                <div className="prediction-card-heading">
                  <div>
                    <h2>Top cargos mayor demanda</h2>
                    <p>
                      Estimación al cierre de {horizonte?.fin ?? "—"}
                    </p>
                  </div>
                </div>

                <TopCargosChart cargos={cargosParaGraficos}/>
              </section>

              {/* GRÁFICO 2 */}
              <section className="prediction-chart-card">

                <div className="prediction-card-heading">
                  <div>
                    <h2>Demanda actual vs futura</h2>
                    <p>
                      Comparativa{" "}
                      {Number(horizonte?.fin ?? 2027) - 1}
                      {" "}(Actual) vs.{" "}
                      {horizonte?.fin ?? "—"}
                      {" "}(Predicción)
                    </p>
                  </div>
                </div>

                <DemandaComparativaChart cargos={cargosParaGraficos}/>
              </section>

              {/* GRÁFICO 3 */}
              <section className="prediction-chart-card prediction-chart-card--evolution">
                <div className="prediction-card-heading">
                  <div>
                    <h2>Top 5 cargos — evolución</h2>
                    <p>
                      Histórico y proyección del modelo predictivo
                    </p>
                  </div>
                </div>

                <EvolucionCargosChart cargos={cargosParaGraficos} horizonte={horizonte}/>
              </section>

              {/* RADAR */}
              <section className="prediction-chart-card prediction-chart-card--radar">
                <div className="prediction-card-heading">
                  <div>
                    <h2>Requisitos de un cargo</h2>
                    <p>
                      {cargoSeleccionado?.nombre
                        ? `Demanda de requisitos para ${cargoSeleccionado.nombre}`
                        : "Selecciona un cargo para consultar sus requisitos"
                      }
                    </p>
                  </div>
                </div>

                <RequisitosRadarChart cargo={cargoSeleccionado}/>

                {cargos.length > 0 && (

                  <div
                    className="prediction-cargo-selector"
                    aria-label="Seleccionar cargo para el radar"
                  >
                    {cargos.map((cargo) => (

                      <button
                        type="button"
                        key={cargo.id}
                        className={
                          cargoSeleccionado?.id === cargo.id
                            ? "is-active"
                            : ""
                        }
                        onClick={() => seleccionarCargo(cargo)}
                      >
                        <span className="prediction-selector-dot" />
                        {cargo.nombre}
                      </button>
                    ))}
                  </div>
                )}
              </section>


              {/* PAGINACIÓN */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={cambiarPagina}
                  totalPages={totalPages}
                />
              )}
            </>
          )}

          {/* FOOTER */}
          <footer className="prediction-footer">
            <span>SearchJobs</span>
            <span>
              {resumen?.fecha_generacion
                ? `Última actualización: ${new Date(resumen.fecha_generacion).toLocaleString("es-CO")}`
                : "Resultados generados por el modelo predictivo"
              }
            </span>
          </footer>
        </main>
      </div>
    </Layout>
  );
}
