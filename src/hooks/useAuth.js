import { useEffect, useState } from "react";
import { fetchAPI } from "../utils/api";

export const useUser = () =>{
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const getUser = async () => {
        try{
            // setLoading(true)
            const response = await fetchAPI('/auth/me')

            if (!response.ok) throw new Error("Gagal mengambil data user")
            
            const data = await response.json()
            setUser(data)
        }catch(err){
            setError(true)
            setUser(null)
    }finally{
        setLoading(false)
    }
    }

    useEffect(() => {
    getUser();
    }, []);


    return {user, loading, error, refreshUser:getUser}
}
