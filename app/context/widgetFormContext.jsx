import React, { createContext, useContext } from "react";

const WidgetFormContext = createContext(null);

export const WidgetFormProvider = ({ children, initialValues }) => {
  return (
    <WidgetFormContext.Provider value={{ initialValues }}>
      {children}
    </WidgetFormContext.Provider>
  );
};

export const useWidgetForm = () => {
  const context = useContext(WidgetFormContext);
  if (!context) {
    throw new Error(
      "useWidgetForm must be used within a WidgetFormProvider"
    );
  }
  return context;
};
