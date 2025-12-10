import {createContext,useState,useContext} from "react";

const AuthContext = createContext();

export function AuthProvider({children}){
    const [user,setUser] = useState(null);
    const [token,setToken] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    return(
      <AuthContext.Provider value ={{user,setUser,token,setToken,isLoading}}>

         {children}
      </AuthContext.Provider>

    )
}

export const useAuth = () => useContext(AuthContext);