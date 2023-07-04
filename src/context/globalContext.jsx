import { createContext, useContext, useState } from "react";

const globalContext = createContext({
  userInfo: {
    queryType: "",
    setQueryType: "",
    email: "",
    isAdmin: false,
  },
  setUserInfo: () => {},
});

export const GlobalContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    isAdmin: false,
  });

  // can take following values.
  // this is also the sheetname in the spreadsheet
  // numberchange
  // emailchange
  // contentmissing
  // coursenotvisible
  // UPIpayment
  // grpnotalloted
  // misc
  const [queryType, setQueryType] = useState("numberchange");
  return (
    <globalContext.Provider
      value={{
        userInfo,
        setUserInfo,
        queryType,
        setQueryType,
      }}
    >
      {children}
    </globalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(globalContext);
