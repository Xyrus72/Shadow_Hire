import React, { useState, useEffect } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPopup, updateProfile } from "firebase/auth";
import { auth, googleProvider } from "../../firebase/firebase.init";
import AuthContext from './AuthContext';

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=User&background=00ff41&color=000&bold=true&size=128";

const AuthProvider = ({children}) => {

    const[user,setUser ]=useState(null);
    const[loading,setLoading]= useState(true);
    const[userPhoto, setUserPhoto] = useState(null);

    const createUser = (email, password, displayName = 'User') => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password).then((result) => {
            return updateProfile(result.user, {
                displayName: displayName,
                photoURL: DEFAULT_AVATAR
            }).then(() => result);
        });
    }
    
    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const signInWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }

    const logout = () => {
        setLoading(true);
        return signOut(auth).then(() => {
            // Clear localStorage when logging out
            localStorage.removeItem('authToken');
            localStorage.removeItem('shadowUser');
            localStorage.removeItem('firebaseUser');
        });
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            if(currentUser) {
                setUser(currentUser);
                setUserPhoto(currentUser.photoURL || DEFAULT_AVATAR);
                // Persist user data to localStorage
                localStorage.setItem('firebaseUser', JSON.stringify({
                    uid: currentUser.uid,
                    email: currentUser.email,
                    displayName: currentUser.displayName,
                    photoURL: currentUser.photoURL || DEFAULT_AVATAR
                }));
            } else {
                setUser(null);
                setUserPhoto(null);
                localStorage.removeItem('firebaseUser');
            }
            setLoading(false);
        });
        return () => {
            unsubscribe();
        }
    }, []);

    const authInfo = {
        user,
        userPhoto,
        loading,
        createUser,
        signIn,
        signInWithGoogle,
        logout
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider };
export default AuthProvider;
