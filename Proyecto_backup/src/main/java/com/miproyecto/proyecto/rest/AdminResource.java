package com.miproyecto.proyecto.rest;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.miproyecto.proyecto.model.FiltroVacanteDTO;
import com.miproyecto.proyecto.service.AdminService;
import com.miproyecto.proyecto.service.PostuladoService;
import com.miproyecto.proyecto.service.UsuarioService;
import com.miproyecto.proyecto.service.VacanteService;
import com.miproyecto.proyecto.util.JwtUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/admin")  
public class AdminResource {
    
    @Autowired
    private PostuladoService postuladoService;
    @Autowired
    private AdminService adminService;
    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private VacanteService vacanteService;
    @Autowired
    private JwtUtils jwtUtils ;

    @Operation(
        summary = "Lista usuarios filtrados",
        description = "Devuelve un listado de usuarios aplicando filtros opcionales como nombre, rol y estado."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Listado obtenido correctamente"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    
    @GetMapping("/listar/filtrados")
    public ResponseEntity<Map<String, Object>> listarUsuariosFiltrados(
            HttpSession session,
            @PageableDefault(page = 0, size = 10) Pageable pageable,
            @Parameter(description = "Nombre del usuario a filtrar") @RequestParam(name = "nombre", required = false) String nombre,
            @Parameter(description = "Rol principal a filtrar") @RequestParam(name = "rolPrinciapl", required = false) String rol,
            @Parameter(description = "Estado activo/inactivo") @RequestParam(name = "estado", required = false) Boolean estado) {

        String jwtToken = (String) session.getAttribute("jwtToken");
        DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);
        Long idUsuario = Long.parseLong(jwtUtils.extractUsername(decodedJWT));
        String rolUsuario = decodedJWT.getClaim("rolPrincipal").asString();

        Map<String, Object> response = usuarioService.buscarUsuariosConFiltros(idUsuario, rolUsuario, nombre, rol,
                estado, pageable);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Lista vacantes con filtros",
        description = "Obtiene las vacantes disponibles aplicando los filtros enviados en el cuerpo de la petición."
    )
    @PostMapping("/listar/filtrovacantes")
    public ResponseEntity<Map<String, Object>> listarVacantes(
        HttpSession session, @PageableDefault(page = 0, size = 10) Pageable pageable,
        @RequestBody FiltroVacanteDTO filtro) {
        Long idCadidato= 0L;
        Map<String, Object> response = vacanteService.buscarVacantesConFiltros(idCadidato, filtro, pageable);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Lista vacantes desactivadas",
        description = "Devuelve un listado paginado de todas las vacantes desactivadas."
    )
    @GetMapping("/listVacantes/desactivadas")
    public ResponseEntity<Map<String, Object>> getInactiveVacancies(
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Map<String, Object> response = vacanteService
                .findAllByEstado(false, pageable, "vacantesDesactivadas");
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Agrega rol de administrador",
        description = "Asigna o activa el rol de administrador a un usuario existente."
    )
    @PostMapping("/agregarRol")
    public ResponseEntity<Map<String, String>> addAdminRole(@RequestParam("idUsuario") Long idUsuario, @RequestParam("estado") boolean estado) {
        adminService.modificarRoles(idUsuario, estado);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Rol de admin agregado exitosamente");
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Remueve rol de administrador",
        description = "Elimina o desactiva el rol de administrador de un usuario."
    )
    @PostMapping("/removerRol")
    public ResponseEntity<Map<String, String>> removeAdminRole(@RequestParam("idUsuario") Long idUsuario) {
        adminService.modificarRoles(idUsuario, false);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Rol de admin removido exitosamente");
        return ResponseEntity.ok(response);
    }

     @Operation(
        summary = "Cambia el estado de un usuario",
        description = "Activa o desactiva un usuario y actualiza sus postulaciones asociadas."
    )
    @PostMapping("/cambiar-estado/usuario")
    public ResponseEntity<Map<String, String>> changeUserStatus(
            @RequestParam("idUsuario") Long idUsuario,
            @RequestParam("estado") boolean estado,
            @RequestParam("comentario") String comentario) {

        if (estado == usuarioService.get(idUsuario).getIsActive()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "El usuario ya se encuentra en ese estado");
            return ResponseEntity.badRequest().body(errorResponse);
            
        }
        postuladoService.cambiarEstadoPorUsuario(idUsuario, estado);
        adminService.cambiarIsActive(idUsuario, estado, comentario);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Estado de usuario actualizado");
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Cambia el estado de una vacante",
        description = "Habilita o deshabilita una vacante según el estado enviado."
    )
    @PostMapping("/cambiar-estado/vacantes")
    public ResponseEntity<Map<String, String>> changeVacancyStatus(
            @RequestParam("nvacante") Long nvacante,
            @RequestParam("estado") boolean estado,
            @RequestParam("comentario") String comentario) {

        if (estado == vacanteService.get(0L,nvacante).isActive()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "La vacante ya está " + estado);
            return ResponseEntity.badRequest().body(errorResponse);
        }

        adminService.cambiarEstadoVacantes(nvacante, estado, comentario);
        postuladoService.cambiarEstadoVacantes(nvacante, estado);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Estado de vacante actualizado");
        return ResponseEntity.ok(response);
    }
}
