package com.miproyecto.proyecto.repos;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.miproyecto.proyecto.domain.Empresa;
import com.miproyecto.proyecto.domain.Postulado;
import com.miproyecto.proyecto.domain.Vacante;
import com.miproyecto.proyecto.domain.VacanteFavorita;
import com.miproyecto.proyecto.model.FiltroVacanteDTO;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

public class VacanteSpecifications {
    public static Specification<Vacante> conFiltros(Long idUserAut,  FiltroVacanteDTO filtro) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filtro.getIdUsuario() != null && filtro.getIdUsuario() > 0) {
                Join<Object, Object> empresaJoin = root.join("idUsuario", JoinType.INNER);
                predicates.add(criteriaBuilder.equal(empresaJoin.get("idUsuario"), filtro.getIdUsuario()));   
            }

            if (filtro.getTotalpostulaciones() >= 0){
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("totalpostulaciones"),filtro.getTotalpostulaciones()
                    )
                );
            }

            if (filtro.getNameEmpresa() != null && !filtro.getNameEmpresa().isEmpty()) {
                Join<Vacante, Empresa> empresaJoin = root.join("idUsuario", JoinType.INNER);
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(empresaJoin.get("nombre")),
                        "%" + filtro.getNameEmpresa().toLowerCase() + "%"));
            }
            
           
            if (filtro.getIsActive() != null) {
                predicates.add(criteriaBuilder.equal(root.get("isActive"), filtro.getIsActive()));
            }

            if (filtro.isActivaPorEmpresa() != null) {
                predicates.add(criteriaBuilder.equal(root.get("activaPorEmpresa"), filtro.isActivaPorEmpresa()));
            }


            if (filtro.getTitulo() != null && !filtro.getTitulo().isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("titulo")), "%" + filtro.getTitulo().toLowerCase() + "%"));
            }

            if (filtro.getCargo() != null && !filtro.getCargo().isEmpty()) {
                predicates.add(criteriaBuilder.like(root.get("cargo"), "%" + filtro.getCargo() + "%"));
            }

            if (filtro.getCiudad() != null && !filtro.getCiudad().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("ciudad"), filtro.getCiudad()));
            }

            if (filtro.getExperiencia() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("experiencia"), filtro.getExperiencia()));
            }

            if (filtro.getSueldo() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("sueldo"), filtro.getSueldo()));
            }

            if (filtro.getFechaPublicacion() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("fechaPublicacion"), filtro.getFechaPublicacion()));
            }

            if(filtro.getVideo()){
                predicates.add(criteriaBuilder.isNotNull(root.get("videoLink")));
            }

            if ("todos".equals(filtro.getTipo())) {
                predicates.add(criteriaBuilder.or(
                    criteriaBuilder.equal(root.get("tipo"), "Practica"),
                    criteriaBuilder.equal(root.get("tipo"), "Vacante")
                ));
            } else if (filtro.getTipo() != null) {
                predicates.add(criteriaBuilder.equal(root.get("tipo"), filtro.getTipo()));
            }

            if ("null".equals(filtro.getModalidad())) {
                predicates.add(criteriaBuilder.or(
                    criteriaBuilder.equal(root.get("modalidad"), "Presencial"),
                    criteriaBuilder.equal(root.get("modalidad"), "Remota")
                ));
            } else if (filtro.getModalidad() != null) {
                predicates.add(criteriaBuilder.equal(root.get("modalidad"), filtro.getModalidad()));
            }

            if ("CANDIDATO".equalsIgnoreCase(filtro.getRolUser())
                    && filtro.getEstadoPostulacion() != null
                    && !filtro.getEstadoPostulacion().isEmpty()) {

                if (filtro.getEstadoPostulacion().equals("SinPostulacion") && idUserAut != null) {
                    // Subquery: vacantes donde el candidato actual ya tiene postulación
                    Subquery<Long> subquery = query.subquery(Long.class);
                    Root<Postulado> postuladoRoot = subquery.from(Postulado.class);
                    subquery.select(postuladoRoot.get("vacante").get("nvacantes"))
                            .where(criteriaBuilder.equal(postuladoRoot.get("candidato").get("idUsuario"), idUserAut));

                    // Excluir esas vacantes
                    predicates.add(criteriaBuilder.not(root.get("nvacantes").in(subquery)));
                } else if (filtro.getEstadoPostulacion() != null) {
                    Join<Vacante, Postulado> postuladoJoin = root.join("litarpostulados", JoinType.INNER);
                    if (idUserAut != null) {
                        predicates
                                .add(criteriaBuilder.equal(postuladoJoin.get("candidato").get("idUsuario"), idUserAut));
                    }
                    predicates.add(criteriaBuilder.equal(postuladoJoin.get("estado"), filtro.getEstadoPostulacion()));
                }

                query.distinct(true);

            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<VacanteFavorita> favoritaConFiltros(Long idUsuario, FiltroVacanteDTO filtro) {
        return (root, query, cb) -> {
            query.distinct(true); // evita duplicados
            List<Predicate> predicates = new ArrayList<>();

            // --- Filtrar solo las favoritas del usuario ---
            if (idUsuario != null && idUsuario > 0) {
                predicates.add(cb.equal(root.get("usuarioFavorita").get("idUsuario"), idUsuario));
            }

            // --- Join con Vacante para aplicar filtros ---
            Join<VacanteFavorita, Vacante> vacanteJoin = root.join("vacanteFavorita", JoinType.INNER);

            if (filtro.getIdUsuario() != null && filtro.getIdUsuario() > 0) {
                Join<Vacante, Empresa> empresaJoin = vacanteJoin.join("idUsuario", JoinType.INNER);
                predicates.add(cb.equal(empresaJoin.get("idUsuario"), filtro.getIdUsuario()));
            }

            if(filtro.getVideo()){
                predicates.add(cb.isNotNull(root.get("videoLink")));
            }

            if (filtro.getTotalpostulaciones() >= 0){
                predicates.add(cb.greaterThanOrEqualTo(vacanteJoin.get("totalpostulaciones"), filtro.getTotalpostulaciones()));
            }

            if (filtro.getNameEmpresa() != null && !filtro.getNameEmpresa().isEmpty()) {
                Join<Vacante, Empresa> empresaJoin = vacanteJoin.join("idUsuario", JoinType.INNER);
                predicates.add(cb.like(cb.lower(empresaJoin.get("nombre")), "%" + filtro.getNameEmpresa().toLowerCase() + "%"));
            }

            if (filtro.getIsActive() != null) {
                predicates.add(cb.equal(vacanteJoin.get("isActive"), filtro.getIsActive()));
            }

            if (filtro.isActivaPorEmpresa() != null) {
                predicates.add(cb.equal(vacanteJoin.get("activaPorEmpresa"), filtro.isActivaPorEmpresa()));
            }

            if (filtro.getTitulo() != null && !filtro.getTitulo().isEmpty()) {
                predicates.add(cb.like(cb.lower(vacanteJoin.get("titulo")), "%" + filtro.getTitulo().toLowerCase() + "%"));
            }

            if (filtro.getCargo() != null && !filtro.getCargo().isEmpty()) {
                predicates.add(cb.like(vacanteJoin.get("cargo"), "%" + filtro.getCargo() + "%"));
            }

            if (filtro.getCiudad() != null && !filtro.getCiudad().isEmpty()) {
                predicates.add(cb.equal(vacanteJoin.get("ciudad"), filtro.getCiudad()));
            }

            if (filtro.getExperiencia() != null) {
                predicates.add(cb.greaterThanOrEqualTo(vacanteJoin.get("experiencia"), filtro.getExperiencia()));
            }

            if (filtro.getSueldo() != null) {
                predicates.add(cb.greaterThanOrEqualTo(vacanteJoin.get("sueldo"), filtro.getSueldo()));
            }

            if (filtro.getFechaPublicacion() != null) {
                predicates.add(cb.greaterThanOrEqualTo(vacanteJoin.get("fechaPublicacion"), filtro.getFechaPublicacion()));
            }

            if ("todos".equals(filtro.getTipo())) {
                predicates.add(cb.or(
                    cb.equal(vacanteJoin.get("tipo"), "Practica"),
                    cb.equal(vacanteJoin.get("tipo"), "Vacante")
                ));
            } else if (filtro.getTipo() != null) {
                predicates.add(cb.equal(vacanteJoin.get("tipo"), filtro.getTipo()));
            }

            if ("null".equals(filtro.getModalidad())) {
                predicates.add(cb.or(
                    cb.equal(vacanteJoin.get("modalidad"), "Presencial"),
                    cb.equal(vacanteJoin.get("modalidad"), "Remota")
                ));
            } else if (filtro.getModalidad() != null) {
                predicates.add(cb.equal(vacanteJoin.get("modalidad"), filtro.getModalidad()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
