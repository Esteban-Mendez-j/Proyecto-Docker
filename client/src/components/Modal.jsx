import Swal from 'sweetalert2'
import { useEffect, useState } from 'react';

// type puede ser: success, error, info, warning
// icon: warning

export function Modal({ message, type, initialVisible = false }) {
  const [visible, setVisible] = useState(initialVisible);

  useEffect(() => {
    if (visible) {
      Swal.fire({
        text: message,
        icon: type,
        confirmButtonText: "OK",
      }).then(() => {
        setVisible(false); 
      });
    }
  }, [visible, message, type]);

  return null; 
}

export function QuestionModal({title, icon}) {
  return Swal.fire({
    title: title, 
    icon: icon,
    showCancelButton: true,
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar',
  })
}
