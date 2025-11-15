package com.miproyecto.proyecto.unitarias;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import com.miproyecto.proyecto.domain.Candidato;
import com.miproyecto.proyecto.domain.Postulado;
import com.miproyecto.proyecto.domain.Vacante;
import com.miproyecto.proyecto.model.CandidatoResumenDTO;
import com.miproyecto.proyecto.model.PostuladoDTO;
import com.miproyecto.proyecto.model.VacanteResumenDTO;
import com.miproyecto.proyecto.repos.CandidatoRepository;
import com.miproyecto.proyecto.repos.PostuladoRepository;
import com.miproyecto.proyecto.repos.VacanteRepository;
import com.miproyecto.proyecto.service.CandidatoService;
import com.miproyecto.proyecto.service.ChatService;
import com.miproyecto.proyecto.service.PostuladoService;
import com.miproyecto.proyecto.service.VacanteService;
import com.miproyecto.proyecto.util.NotFoundException;

@ExtendWith(MockitoExtension.class)
class PostuladoServiceTest {

        @Mock
        private PostuladoRepository postuladoRepository;
        @Mock
        private VacanteRepository vacanteRepository;
        @Mock
        private CandidatoRepository candidatoRepository;
        @Mock
        private VacanteService vacanteService;
        @Mock
        private CandidatoService candidatoService;
        @Mock
        private ChatService chatService; 

        @InjectMocks
        private PostuladoService postuladoService;

        private Postulado postulado;
        private Vacante vacante;
        private Candidato candidato;

        /**
         * Inicializa objetos de dominio usados por múltiples tests.
         * Se ejecuta antes de cada método @Test.
         */
        @BeforeEach
        void setUp() {
                vacante = new Vacante();
                vacante.setNvacantes(10L);
                vacante.setTotalpostulaciones(0);

                candidato = new Candidato();
                candidato.setIdUsuario(20L);

                postulado = new Postulado();
                postulado.setNPostulacion(1L);
                postulado.setFechaPostulacion(LocalDate.now());
                postulado.setEstado("Espera");
                postulado.setActive(true);
                postulado.setVacanteIsActive(true);
                postulado.setVacante(vacante);
                postulado.setCandidato(candidato);
        }

        /**
         * Verifica que findAll() retorne una lista con los DTOs generados
         * correctamente a partir de las entidades obtenidas del repositorio.
         *
         * Caso de prueba:
         * - El repositorio devuelve 1 postulado.
         * - Los servicios de mapeo retornan DTOs mínimos válidos.
         *
         * Resultado esperado:
         * - La lista tiene 1 elemento.
         * - El número de postulación coincide.
         * - Se invoca findAll() exactamente 1 vez.
         */
        @Test
        void listarPostulaciones_DeberiaRetornarListaDeDTOs() {

                when(postuladoRepository.findAll(any(Sort.class))).thenReturn(List.of(postulado));

                when(vacanteService.mapToResumenDTO(any(), any())).thenReturn(new VacanteResumenDTO());

                when(candidatoService.mapToResumenDTO(any(), any())).thenReturn(new CandidatoResumenDTO());

                List<PostuladoDTO> result = postuladoService.findAll();

                assertEquals(1, result.size());
                assertEquals(1L, result.get(0).getnPostulacion());

                verify(postuladoRepository, times(1)).findAll(any(Sort.class));
        }

        /**
         * Verifica que get(id) retorne un DTO válido cuando el postulado existe.
         *
         * Caso de prueba:
         * - El repositorio devuelve una entidad Postulado.
         * - Los servicios de mapeo devuelven DTOs válidos.
         *
         * Resultado esperado:
         * - Se retorna un DTO no nulo.
         * - El número de postulación coincide con el de la entidad.
         */
        @Test
        void obtenerPorId_DeberiaRetornarDTO_SiExiste() {

                when(postuladoRepository.findById(3L)).thenReturn(Optional.of(postulado));

                when(candidatoService.mapToResumenDTO(any(), any())).thenReturn(new CandidatoResumenDTO());

                when(vacanteService.mapToResumenDTO(any(), any())).thenReturn(new VacanteResumenDTO());

                PostuladoDTO result = postuladoService.get(3L);

                assertNotNull(result);
                assertEquals(1L, result.getnPostulacion());
        }

        /**
         * Verifica que get(id) lance NotFoundException cuando el postulado no existe.
         *
         * Caso de prueba:
         * - El repositorio retorna Optional.empty().
         *
         * Resultado esperado:
         * - Se lanza NotFoundException.
         */
        @Test
        void obtenerPorId_DeberiaLanzarExcepcion_SiNoExiste() {

                when(postuladoRepository.findById(99L)).thenReturn(Optional.empty());

                assertThrows(NotFoundException.class,
                                () -> postuladoService.get(99L));
        }

        /**
         * Verifica que create() guarde una nueva postulación y retorne
         * su ID correspondiente.
         *
         * Caso de prueba:
         * - La vacante existe.
         * - El candidato existe.
         * - El servicio de vacantes retorna un resumen válido.
         * - El repositorio guarda correctamente y retorna una entidad con ID = 10.
         *
         * Resultado esperado:
         * - Se retorna 10.
         * - El total de postulaciones de la vacante incrementa en +1.
         * - El estado del DTO queda establecido en "Espera".
         */
        @Test
        void create_DeberiaGuardarPostulacionYRetornarId() {

                VacanteResumenDTO vacanteResumenDTO = new VacanteResumenDTO();
                vacanteResumenDTO.setId(1L);

                when(vacanteService.findVacanteResumenById(1L)).thenReturn(vacanteResumenDTO);

                when(vacanteRepository.findById(1L)).thenReturn(Optional.of(vacante));

                when(candidatoRepository.findById(20L)).thenReturn(Optional.of(candidato));

                Postulado postuladoGuardado = new Postulado();
                postuladoGuardado.setNPostulacion(10L);

                when(postuladoRepository.save(any(Postulado.class))).thenReturn(postuladoGuardado);

                CandidatoResumenDTO candidatoResumenDTO = new CandidatoResumenDTO();
                candidatoResumenDTO.setId(20L);

                PostuladoDTO postuladoDTO = new PostuladoDTO();

                Long result = postuladoService.create(postuladoDTO, candidatoResumenDTO, 1L);

                assertEquals(10L, result);
                assertEquals(1, vacante.getTotalpostulaciones());
                assertEquals("Espera", postuladoDTO.getEstado());
        }

        /**
         * Verifica que create() lance NotFoundException cuando la vacante no existe.
         *
         * Caso de prueba:
         * - vacanteRepository.findById() retorna Optional.empty().
         *
         * Resultado esperado:
         * - Se lanza NotFoundException.
         */
        @Test
        void create_DeberiaLanzarExcepcion_SiVacanteNoExiste() {

                when(vacanteRepository.findById(1L)).thenReturn(Optional.empty());

                PostuladoDTO postuladoDTO = new PostuladoDTO();
                CandidatoResumenDTO candidatoResumenDTO = new CandidatoResumenDTO();

                assertThrows(NotFoundException.class,
                                () -> postuladoService.create(postuladoDTO, candidatoResumenDTO, 1L));
        }
}
