import React, { createContext, useState, useContext } from "react";

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);

  return (
    <TeamContext.Provider value={{ selectedTeam, setSelectedTeam }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => useContext(TeamContext);
