import { useState } from "react";

export default function useVisible(){
    const [visible, setVisible] = useState(false);

    const handleOnClick = () => setVisible(!visible);

    return[handleOnClick, visible]
}