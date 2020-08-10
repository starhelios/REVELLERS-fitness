import React, { useReducer, createContext, useState, useEffect } from 'react';

export const GlobalStateContext = createContext();
export const GlobalDispatchContext = createContext();
export const AuthContext = createContext();

const initialState = {
    netlifyLoggedIn: undefined,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'LOG_IN': {
            return {
                ...state,
                netlifyLoggedIn: action.netlify,
                user: action.user,
            };
        }
        
        default:
            throw new Error('Error');
    }
};

const GlobalContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    let lsAuthUser = localStorage.getItem('revel-user');
    console.log("hey", JSON.parse(lsAuthUser))
    const [signupCredential, setSignupCredential] = useState({});
    const [authUser, setAuthUser] = useState({});

    const setAuthUserContext = (user) => {
        localStorage.setItem('revel-user', JSON.stringify(user))
        setAuthUser(user)
    }

    const getAuthUser = async() => {
        let lsAuthUser = await localStorage.getItem('revel-user');
        if (lsAuthUser) setAuthUser(JSON.parse(lsAuthUser));
    }
    useEffect(() => {
        getAuthUser();
    }, [])
    return (
        <GlobalStateContext.Provider value={state}>
            <GlobalDispatchContext.Provider value={dispatch}>
                <AuthContext.Provider value={{
                    signupCredential,
                    setSignupCredential,
                    authUser,
                    setAuthUserContext
                }}>
                    {children}
                </AuthContext.Provider>
            </GlobalDispatchContext.Provider>
        </GlobalStateContext.Provider>
    );
};

export default GlobalContextProvider;
