package com.miproyecto.proyecto.unitarias;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.miproyecto.proyecto.domain.Empresa;
import com.miproyecto.proyecto.domain.Postulado;
import com.miproyecto.proyecto.domain.Roles;
import com.miproyecto.proyecto.domain.Vacante;
import com.miproyecto.proyecto.model.EmpresaDTO;
import com.miproyecto.proyecto.repos.EmpresaRepository;
import com.miproyecto.proyecto.repos.RolesRepository;
import com.miproyecto.proyecto.service.EmpresaService;

/**
 * Pruebas unitarias para la clase EmpresaService.
 * 
 * Estas pruebas verifican el comportamiento de los métodos principales del servicio de empresas,
 * incluyendo la creación, actualización, eliminación, obtención de datos y cálculos relacionados
 * con vacantes y postulaciones.
 */
@ExtendWith(MockitoExtension.class)
class EmpresaServiceTest {

    @Mock
    private EmpresaRepository empresaRepository;

    @Mock
    private RolesRepository rolesRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private EmpresaService empresaService;

    private Roles rolEmpresa;

    @BeforeEach
    void setUp() {
        rolEmpresa = new Roles();
        rolEmpresa.setRol("EMPRESA");
    }

    /**
     * Crea una empresa de prueba completa con todos los campos necesarios
     * para evitar NullPointerException en los tests.
     */
    private Empresa crearEmpresaDePrueba() {
        Empresa empresa = new Empresa();
        empresa.setIdUsuario(1L);
        empresa.setNombre("Empresa Test");
        empresa.setCorreo("test@empresa.com");
        empresa.setContrasena("1234");
        empresa.setSectorEmpresarial("Tecnología");
        empresa.setSitioWeb("www.test.com");
        empresa.setNit("1234567890");
        empresa.setListarVacantes(new HashSet<>());
        empresa.setRoles(new ArrayList<>()); 
        empresa.setVerified(false);
        empresa.setIsActive(true);
        empresa.setComentarioAdmin("");
        return empresa;
    }

    /**
     * Verifica que el método get devuelva un DTO de empresa dado un idUsuario válido.
     * 
     * Caso de prueba: Existe una empresa con el idUsuario proporcionado.
     * Resultado esperado: Se devuelve un DTO con el nombre de la empresa correcto.
     */
    @Test
    void get_ShouldReturnEmpresaDTO_WhenExists() {
        Empresa empresa = crearEmpresaDePrueba();
        when(empresaRepository.findById(1L)).thenReturn(Optional.of(empresa));

        EmpresaDTO result = empresaService.get(1L);

        assertEquals("Empresa Test", result.getNombre());
        assertNotNull(result.getNumeroVacantes());
        assertNotNull(result.getRoles());
    }

    /**
     * Verifica que el método create guarde una empresa con contraseña codificada y rol asignado.
     * 
     * Caso de prueba: Se crea una empresa con DTO válido.
     * Resultado esperado: La empresa guardada tiene la contraseña codificada y el rol "EMPRESA".
     */
    @Test
    void create_ShouldSaveEmpresaWithEncodedPasswordAndRole() {
        EmpresaDTO dto = new EmpresaDTO();
        dto.setNombre("Empresa Test");
        dto.setContrasena("1234");

        when(rolesRepository.findByRol("EMPRESA")).thenReturn(rolEmpresa);
        when(passwordEncoder.encode("1234")).thenReturn("encoded1234");

        empresaService.create(dto);

        ArgumentCaptor<Empresa> captor = ArgumentCaptor.forClass(Empresa.class);
        verify(empresaRepository).save(captor.capture());
        Empresa saved = captor.getValue();

        assertEquals("Empresa Test", saved.getNombre());
        assertEquals("encoded1234", saved.getContrasena());
        assertTrue(saved.getRoles().contains(rolEmpresa));
    }

    /**
     * Verifica que el método update modifique correctamente los datos de una empresa existente.
     * 
     * Caso de prueba: Existe una empresa con el idUsuario proporcionado y se actualiza su nombre.
     * Resultado esperado: La empresa tiene el nombre actualizado y se llama al repositorio para guardar.
     */
    @Test
    void update_ShouldModifyEmpresa_WhenExists() {
        Empresa empresa = crearEmpresaDePrueba();
        EmpresaDTO dto = new EmpresaDTO();
        dto.setNombre("Modificada");

        when(empresaRepository.findById(1L)).thenReturn(Optional.of(empresa));

        empresaService.update(1L, dto);

        assertEquals("Modificada", empresa.getNombre());
        verify(empresaRepository).save(empresa);
    }

    /**
     * Verifica que el método contarVacantesActivas cuente correctamente las vacantes activas.
     * 
     * Caso de prueba: Se proporciona un conjunto de vacantes con diferentes estados.
     * Resultado esperado: Se retorna la cantidad correcta de vacantes activas y activas por empresa.
     */
    @Test
    void contarVacantesActivas_ShouldReturnCorrectCount() {
        Vacante vacante1 = new Vacante();
        vacante1.setIsActive(true);
        vacante1.setActivaPorEmpresa(true);

        Vacante vacante2 = new Vacante();
        vacante2.setIsActive(false);
        vacante2.setActivaPorEmpresa(true);

        int count = empresaService.contarVacantesActivas(Set.of(vacante1, vacante2));
        assertEquals(1, count);
    }

    /**
     * Verifica que el método contarCandidatosAceptados calcule correctamente el número de candidatos
     * aceptados y el porcentaje de aceptación.
     * 
     * Caso de prueba: Una vacante con 4 postulaciones, de las cuales 1 está aceptada.
     * Resultado esperado: El número de candidatos aceptados es 1 y el porcentaje de aceptación es 25%.
     */
    @Test
    void contarCandidatosAceptados_ShouldReturnCorrectValues() {
        Vacante vacante = new Vacante();
        vacante.setTotalpostulaciones(4);
        Postulado p1 = new Postulado();
        p1.setEstado("Aceptada");
        Postulado p2 = new Postulado();
        p2.setEstado("Rechazada");
        vacante.setLitarpostulados(Set.of(p1, p2));

        Map<String, Integer> result = empresaService.contarCandidatosAceptados(Set.of(vacante));

        assertEquals(1, result.get("CandidatosAceptados"));
        assertEquals(25, result.get("PorcentajeAceptacion"));
    }

    /**
     * Verifica que el método nitExists devuelva true si el NIT proporcionado ya existe en la base.
     * 
     * Caso de prueba: El repositorio indica que el NIT existe.
     * Resultado esperado: El método devuelve true.
     */
    @Test
    void nitExists_ShouldReturnTrue_WhenExists() {
        when(empresaRepository.existsByNitIgnoreCase("1234")).thenReturn(true);
        assertTrue(empresaService.nitExists("1234"));
    }

    /**
     * Verifica que el método idUsuarioExists devuelva true si el idUsuario proporcionado ya existe en la base.
     * 
     * Caso de prueba: El repositorio indica que el idUsuario existe.
     * Resultado esperado: El método devuelve true.
     */
    @Test
    void idUsuarioExists_ShouldReturnTrue_WhenExists() {
        when(empresaRepository.existsByIdUsuario(1L)).thenReturn(true);
        assertTrue(empresaService.idUsuarioExists(1L));
    }
}
