import Swal from 'sweetalert2'
// type: success, error, info
// icon: warning

export function Modal({message, type}){
    return(
        Swal.fire({ text: {message}, icon: {type} })
    )
}

export function QuestionModal({title, icon}){
    return(
        Swal.fire({
            title: {title},
            icon: {icon},
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar',
        })
    )
}
