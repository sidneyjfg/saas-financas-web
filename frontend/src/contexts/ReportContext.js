import React, { createContext, useContext, useState } from "react";

const ReportContext = createContext();

export const useReport = () => useContext(ReportContext);

export const ReportProvider = ({ children }) => {
  const [shouldReload, setShouldReload] = useState(false);

  const triggerReload = () => {
    setShouldReload(true);
  };
  
  const resetReload = () => {
    setShouldReload(false);
  };

  return (
    <ReportContext.Provider value={{ shouldReload, triggerReload, resetReload }}>
      {children}
    </ReportContext.Provider>
  );
};
