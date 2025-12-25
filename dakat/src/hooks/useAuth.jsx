import React, { useContext } from 'react';
import AuthContext from '../contexts/authcontext/AuthContext';


const useAuth = () => {
    const authInfo = useContext(AuthContext);
    return authInfo;
}

export default useAuth
