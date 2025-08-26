import { createContext, useState } from "react";

export const RoleContext = createContext(null);

export function RoleSesion({ children }) {
    const [rol, setRol] = useState("ROLE_INVITADO");

    return (
        <RoleContext.Provider value={{ rol, setRol }}>
            {children}
        </RoleContext.Provider>
    );
}
