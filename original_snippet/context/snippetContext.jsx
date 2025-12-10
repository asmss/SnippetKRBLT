import {createContext, useState, useContext, useEffect} from "react";
import { useAuth } from "./authContext";


const snippetContext = createContext();

export function SnippetProvider({children}){
    const [snippets,setSnippets] = useState([]);
    const [loading,setLoading] = useState(true);
    const { user ,token} = useAuth(); 
 const fetchSnippets = async()=>{
            try {

                const res = await fetch(`https://snippetkrblt.onrender.com/api/snippets/${user._id}`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}` 
                    },
                    body: JSON.stringify({
                        userId:user._id,
                    }),
                });
                
                const data = await res.json(); 

                    setSnippets(data.snippets);


            } catch (error) {
                console.error("Snippet'lar çekilemedi:", error);
            } finally {
                setLoading(false); 
            }
        };
    useEffect(()=>{
        if (!user || !user._id || !token) {

            setLoading(false); 
            return;
        }

       

        fetchSnippets();

    },[user?._id, token]); 
    
    return(
      <snippetContext.Provider value ={{snippets,setSnippets,loading,fetchSnippets}}>
         {children}
      </snippetContext.Provider>

    )
}

export const useSnippets = () => useContext(snippetContext);