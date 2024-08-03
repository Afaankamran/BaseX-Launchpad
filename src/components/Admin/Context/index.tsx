import { createContext, useContext, useState } from "react";

type AdminContext = {
  admin: boolean;
  updateAdmin: (admin: boolean) => void;
};
const context = createContext<AdminContext>({
  admin: false,
  updateAdmin: () => {},
});

export default function AdminProvider({ children }) {
  const [admin, setAdmin] = useState<boolean>(false);
  function updateAdmin(value: boolean) {
    setAdmin(value);
  }
  return (
    <context.Provider value={{ admin, updateAdmin }}>
      {children}
    </context.Provider>
  );
}

export function useAdmin() {
  return useContext(context);
}
