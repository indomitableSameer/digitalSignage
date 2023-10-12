import { createContext, useState } from 'react';

const UpdateLocationContext = createContext();

export const LocationUpdateProvider = ({ children }) => {
  const [update, setUpdate] = useState(0);

  const triggerUpdate = () => {
    console.log('called trigger in - main');
    setUpdate((prevUpdate) => prevUpdate + 1);
  };

  return <UpdateLocationContext.Provider value={triggerUpdate}>{children}</UpdateLocationContext.Provider>;
};

export default UpdateLocationContext;
