package com.miproyecto.proyecto.repos;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.miproyecto.proyecto.domain.Roles;
import com.miproyecto.proyecto.domain.Usuario;
import com.miproyecto.proyecto.model.FiltroUsuarioDTO;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

public class UsuarioSpecifications {

    public static Specification<Usuario> conFiltros(String rolUsuario, FiltroUsuarioDTO filtro) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filtro por nombre
            if (filtro.getNombre() != null && !filtro.getNombre().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("nombre")),
                    "%" + filtro.getNombre().toLowerCase() + "%"));
            }

            if (filtro.getCorreo() != null && !filtro.getCorreo().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("correo")),
                    "%" + filtro.getCorreo().toLowerCase() + "%"));
            }

            // Filtro por estado de actividad
            if (filtro.getEstado() != null) {
                predicates.add(criteriaBuilder.equal(root.get("isActive"), filtro.getEstado()));
            }

             Join<Usuario, Roles> joinRoles = root.join("roles", JoinType.INNER);

            // Lógica para SUPER_ADMIN
            if ("SUPER_ADMIN".equalsIgnoreCase(rolUsuario)) {
                if (filtro.getRol() == null || filtro.getRol().isEmpty()) {
                    Predicate esCandidato = criteriaBuilder.like(
                        criteriaBuilder.lower(joinRoles.get("rol")), "%candidato%");
                    Predicate esEmpresa = criteriaBuilder.like(
                        criteriaBuilder.lower(joinRoles.get("rol")), "%empresa%");
                    Predicate esAdmin = criteriaBuilder.like(
                        criteriaBuilder.lower(joinRoles.get("rol")), "admin");

                    predicates.add(criteriaBuilder.or(esCandidato, esEmpresa, esAdmin));
                } else {
                    predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(joinRoles.get("rol")), filtro.getRol().toLowerCase()));
                }

            // Lógica para ADMIN
            } else if ("ADMIN".equalsIgnoreCase(rolUsuario)) {
                if (filtro.getRol() == null || filtro.getRol().isEmpty()) {
                    Predicate esCandidato = criteriaBuilder.like(
                        criteriaBuilder.lower(joinRoles.get("rol")), "candidato");
                    Predicate esEmpresa = criteriaBuilder.like(
                        criteriaBuilder.lower(joinRoles.get("rol")), "empresa");
                    predicates.add(criteriaBuilder.or(esCandidato, esEmpresa));
                } else if (!"ADMIN".equalsIgnoreCase(filtro.getRol())) {
                    System.out.println("este es el rol de la sesion actual y su id: " + rolUsuario + " " + filtro.getRol());
                    predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(joinRoles.get("rol")), filtro.getRol().toLowerCase()));
                }
            }

            // 🚨 Protección para evitar mostrar todo si no se aplicaron filtros
            if (predicates.isEmpty()) {
                return criteriaBuilder.disjunction(); // Equivale a "WHERE 1 = 0"
            }

            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}