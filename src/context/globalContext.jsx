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

  const [queryType, setQueryType] = useState("numberchange");
  // queryType can take following values.
  // this is also the sheetname in the spreadsheet
  // nameChange
  // batchShift
  // emi
  // refund
  // removeCourseAccess
  // feedback
  // numberchange
  // emailchange
  // contentmissing
  // coursenotvisible
  // UPIpayment
  // grpnotalloted
  // misc

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
