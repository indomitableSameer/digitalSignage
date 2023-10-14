import { createContext, useState } from 'react';

const UpdateDeviceContext = createContext();

export const DeviceUpdateProvider = ({ children }) => {
  const [update, setUpdate] = useState(0);

  const triggerUpdate = () => {
    console.log('called trigger in - UpdateDeviceContext');
    setUpdate((prevUpdate) => prevUpdate + 1);
  };

  return <UpdateDeviceContext.Provider value={triggerUpdate}>{children}</UpdateDeviceContext.Provider>;
};

export default UpdateDeviceContext;
