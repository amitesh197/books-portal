import { createContext, useContext, useState } from "react";

const globalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    isAdmin: false,
    userName: "",
    token: "",
  });
    //get query from local storage
    const query = localStorage.getItem("queryType");
  const [queryType, setQueryType] = useState(query || "nameChange");
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
