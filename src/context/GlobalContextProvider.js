import React, { useReducer, createContext, useState } from 'react';

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
    const [signupCredential, setSignupCredential] = useState({});
    return (
        <GlobalStateContext.Provider value={state}>
            <GlobalDispatchContext.Provider value={dispatch}>
                <AuthContext.Provider value={{
                    signupCredential,
                    setSignupCredential
                }}>
                    {children}
                </AuthContext.Provider>
            </GlobalDispatchContext.Provider>
        </GlobalStateContext.Provider>
    );
};

export default GlobalContextProvider;
