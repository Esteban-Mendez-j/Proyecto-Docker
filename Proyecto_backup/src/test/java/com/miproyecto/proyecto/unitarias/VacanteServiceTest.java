package com.miproyecto.proyecto.unitarias;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.miproyecto.proyecto.aptitudes.service.AptitudesService;
import com.miproyecto.proyecto.empresa.model.Empresa;
import com.miproyecto.proyecto.empresa.repository.EmpresaRepository;
import com.miproyecto.proyecto.postulacion.repository.PostuladoRepository;
import com.miproyecto.proyecto.util.NotFoundException;
import com.miproyecto.proyecto.vacante.dto.VacanteDTO;
import com.miproyecto.proyecto.vacante.model.Vacante;
import com.miproyecto.proyecto.vacante.repository.VacanteRepository;
import com.miproyecto.proyecto.vacante.service.VacanteService;

/**
 * Pruebas unitarias para la clase VacanteService.
 * 
 * Estas pruebas verifican el comportamiento de los métodos principales del servicio
 * utilizando Mockito para simular las dependencias del repositorio.
 */
@ExtendWith(MockitoExtension.class)
class VacanteServiceTest {

    @Mock
    private VacanteRepository vacanteRepository;
    @Mock
    private EmpresaRepository empresaRepository;
    @Mock
    private PostuladoRepository postuladoRepository;
    @Mock
    private AptitudesService aptitudesService;

    @InjectMocks
    private VacanteService vacanteService;

    /**
     * Verifica que incrementarVisitas aumente el número de visitas
     * y guarde la vacante actualizada.
     *
     * Caso de prueba: La vacante existe en la base de datos.
     * Resultado esperado: Se llama a save() con la vacante actualizada.
     */
    @Test
    void testIncrementarVisitas_debeIncrementarYGuardar() {
        Vacante vacante = mock(Vacante.class);
        when(vacanteRepository.findById(1L)).thenReturn(Optional.of(vacante));

        vacanteService.incrementarVisitas(1L);

        verify(vacante).incrementarVisitas();
        verify(vacanteRepository).save(vacante);
    }

    /**
     * Verifica que incrementarVisitas lance NotFoundException
     * si la vacante no existe.
     */
    @Test
    void testIncrementarVisitas_debeLanzarExcepcionSiNoExiste() {
        when(vacanteRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> vacanteService.incrementarVisitas(1L));
    }

    /**
     * Verifica que findAllByEstado devuelva un mapa con los elementos paginados.
     *
     * Caso de prueba: Hay dos vacantes activas.
     * Resultado esperado: El mapa contiene la lista y metadatos de paginación.
     */
    
    @Test
    void testFindAllByEstado_debeRetornarMapaDeVacantes() {
        Vacante vacante1 = new Vacante();
        Vacante vacante2 = new Vacante();
        vacante1.setIsActive(true);
        vacante2.setIsActive(true);
        vacante1.setTitulo("Desarrollador Java");
        vacante2.setTitulo("Analista QA");

        List<Vacante> lista = List.of(vacante1, vacante2);
        Page<Vacante> pagina = new PageImpl<>(lista);

        when(vacanteRepository.findByIsActiveOrderByFechaPublicacionDesc(eq(true), any(Pageable.class)))
                .thenReturn(pagina);

        Map<String, Object> resultado = vacanteService.findAllByEstado(true, PageRequest.of(0, 5), "vacantes");

        assertTrue(resultado.containsKey("vacantes"));
        assertEquals(2, ((List<?>) resultado.get("vacantes")).size());
        verify(vacanteRepository).findByIsActiveOrderByFechaPublicacionDesc(eq(true), any(Pageable.class));
    }


    /**
     * Verifica que findByIdUsuario devuelva las vacantes relacionadas con una empresa.
     *
     * Caso de prueba: La empresa existe y tiene vacantes asociadas.
     * Resultado esperado: Se devuelve un mapa con la lista de vacantesDTO.
     */
    @Test
    void testFindByIdUsuario_debeRetornarVacantesDeEmpresa() {
        Empresa empresa = new Empresa();
        empresa.setIdUsuario(1L);

        Vacante vacante = new Vacante();
        vacante.setIdUsuario(empresa);

        Page<Vacante> pagina = new PageImpl<>(List.of(vacante));

        when(empresaRepository.findById(1L)).thenReturn(Optional.of(empresa));
        when(vacanteRepository.findByIdUsuario(eq(empresa), any(Pageable.class))).thenReturn(pagina);

        Map<String, Object> resultado = vacanteService.findByIdUsuario(1L, PageRequest.of(0, 5));

        assertTrue(resultado.containsKey("vacantes"));
        verify(empresaRepository).findById(1L);
        verify(vacanteRepository).findByIdUsuario(eq(empresa), any(Pageable.class));
    }

    /**
     * Verifica que create cree una nueva vacante con los valores por defecto.
     *
     * Caso de prueba: El DTO es válido.
     * Resultado esperado: Se llama a save() con una entidad mapeada.
     */
    @Test
    void testCreate_debeGuardarVacante() {
        VacanteDTO dto = new VacanteDTO();
        dto.setTitulo("Desarrollador Java");
        dto.setIdUsuario(1L); 

        when(aptitudesService.mapToListEntity(any())).thenReturn(Collections.emptyList());
        when(empresaRepository.findById(1L)).thenReturn(Optional.of(new Empresa()));

        vacanteService.create(dto);

        verify(vacanteRepository).save(any(Vacante.class));
    }


    /**
     * Verifica que update lance una excepción si la vacante no existe.
     */
    @Test
    void testUpdate_debeLanzarExcepcionSiNoExiste() {
        when(vacanteRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> vacanteService.update(99L, new VacanteDTO()));
    }

    /**
     * Verifica que cambiarEstado actualice correctamente el estado de la vacante.
     *
     * Caso de prueba: La vacante existe.
     * Resultado esperado: Se actualiza el campo activaPorEmpresa y se guarda.
     */
    @Test
    void testCambiarEstado_debeActualizarEstadoYGuardar() {
        Vacante vacante = new Vacante();
        when(vacanteRepository.findById(1L)).thenReturn(Optional.of(vacante));

        vacanteService.cambiarEstado(1L, false);

        assertFalse(vacante.isActivaPorEmpresa());
        verify(vacanteRepository).save(vacante);
    }

    /**
     * Verifica que get lance una excepción si la vacante no se encuentra.
     */
    @Test
    void testGet_debeLanzarExcepcionSiNoExiste() {
        when(vacanteRepository.findById(5L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> vacanteService.get(1L, 5L));
    }
}