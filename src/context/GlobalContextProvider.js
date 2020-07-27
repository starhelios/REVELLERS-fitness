import React, { useReducer, createContext } from 'react';

export const GlobalStateContext = createContext();
export const GlobalDispatchContext = createContext();

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
    return (
        <GlobalStateContext.Provider value={state}>
            <GlobalDispatchContext.Provider value={dispatch}>
                {children}
            </GlobalDispatchContext.Provider>
        </GlobalStateContext.Provider>
    );
};

export default GlobalContextProvider;
