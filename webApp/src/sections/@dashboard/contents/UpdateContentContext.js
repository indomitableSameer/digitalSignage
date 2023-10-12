import { createContext, useState } from 'react';

const UpdateContentContext = createContext();

export const ContentUpdateProvider = ({ children }) => {
  const [update, setUpdate] = useState(0);

  const triggerUpdate = () => {
    setUpdate((prevUpdate) => prevUpdate + 1);
  };

  return <UpdateContentContext.Provider value={triggerUpdate}>{children}</UpdateContentContext.Provider>;
};

export default UpdateContentContext;
