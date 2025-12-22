import Swal from 'sweetalert2';
// type puede ser: success, error, info, warning
// icon: warning

// para mostrar un modal normal 
export async function modal(message, type) {
  Swal.fire({
    text: message,
    icon: type,
    confirmButtonText: "OK",
  })
}

// para mostrar un modal y luego de la respues realizar una accion
export async function modalResponse(message, type) {
  const sweetalertResponse = await Swal.fire({
    text: message,
    icon: type,
    confirmButtonText: "OK",
  })

  return sweetalertResponse.isConfirmed;
}

// para mostrar un modal con pregunta 
export async function QuestionModal(title, icon = "question") {
  const sweetalertResponse = await Swal.fire({
    title: title,
    icon: icon,
    showCancelButton: true,
    confirmButtonText: "Sí, confirmar",
    cancelButtonText: "Cancelar",
  });

  return sweetalertResponse.isConfirmed;
}

export function modalTime(message, type="success") {
 
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
  Toast.fire({
    icon: type ,
    title: message
  });
  return Toast;
}