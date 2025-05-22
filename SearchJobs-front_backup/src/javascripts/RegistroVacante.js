import { manejarFormulario } from './MensajeErrorFrom.js';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('vacanteForm');
    const endpointUrl = form.dataset.endpointUrl;
    console.log(endpointUrl)
    const metodo = form.dataset.metodo;
    const tipoSelect = document.getElementById('tipo');
    const experienciaInput = document.getElementById('experiencia');

    tipoSelect.addEventListener('change', function () {
        if (this.value === 'Practica') {
            experienciaInput.value = 0;
            experienciaInput.disabled = true;
        } else {
            experienciaInput.disabled = false;
            experienciaInput.value = '';
        }
    });

    const validateForm = () => {
        const requiredFields = [
            'titulo', 'ciudad', 'departamento','tipo', 'experiencia',
            'modalidad', 'cargo', 'descripcion', 'requerimientos','sueldo'
        ];

        for (const id of requiredFields) {
            const input = document.getElementById(id);
            if (!input || !input.value.trim()) {
                 Swal.fire({ text: 'Por favor completa todos los campos requeridos.', icon: 'info' });                return false;
            }
        }

        const sueldo = document.getElementById('sueldo').value.trim();
        if (sueldo && isNaN(sueldo)) {
             Swal.fire({ text: 'El sueldo debe ser un número válido.', icon: 'error' });            return false;
        }

        return true;
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
                console.log({
            titulo: formData.get('titulo'),
            ciudad: formData.get('ciudad'),
            departamento: formData.get('departamento'),
            tipo: formData.get('tipo'),
            modalidad: formData.get('modalidad'),
            sueldo: formData.get('sueldo'),
            cargo: formData.get('cargo'),
            experiencia: formData.get('experiencia' || 0),
            descripcion: formData.get('descripcion'),
            requerimientos: formData.get('requerimientos'),
        })

        manejarFormulario({
            form,
            validateForm,
            buildData: (formData) => ({
                titulo: formData.get('titulo'),
                ciudad: formData.get('ciudad'),
                departamento: formData.get('departamento'),
                tipo: formData.get('tipo'),
                modalidad: formData.get('modalidad'),
                sueldo: formData.get('sueldo'),
                cargo: formData.get('cargo'),
                experiencia: formData.get('experiencia'),
                descripcion: formData.get('descripcion'),
                requerimientos: formData.get('requerimientos'),
            }),
            endpointUrl: endpointUrl,
            redirectUrl: '/empleos/listadoVacantes',
            metodo:metodo
        });
    });
});
