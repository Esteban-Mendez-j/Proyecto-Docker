import { useState } from "react"

export default function useDataChange(initialData){
    
    const [dataForm, setDataForm] = useState( initialData );
    
    const handleOnChange = (e) => {
        const {name , value} = e.target;
        setDataForm( (prev) =>({
            ...prev,
            [name]:value
        }))
    }

    const clearDataForm = () => {setDataForm(initialData)};

    return [ dataForm , handleOnChange, clearDataForm, setDataForm]
}