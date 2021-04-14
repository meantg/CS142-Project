import React from 'react';

const GlobalStateContext = React.createContext();
const GlobalDispatchContext = React.createContext();

function globalReducer(state, action) {
    switch (action.type) {
        case 'set-user':
            return {
                ...state,
                loginUser: action.value,
            };
        case 'set-users':
            return {
                ...state,
                users: action.value,
            };
        default:
            return state;
    }
}

const initialState = {
    loginUser: undefined,
    users: []
};


function GlobalProvider({ children }) {
    const [state, dispatch] = React.useReducer(globalReducer, initialState);
    console.log(GlobalStateContext.Provider);
    return (
        <GlobalStateContext.Provider value={state}>
            <GlobalDispatchContext.Provider value={dispatch}>
                {children}
            </GlobalDispatchContext.Provider>
        </GlobalStateContext.Provider>
    )
}

function useGlobalState() {
    const context = React.useContext(GlobalStateContext);
    if (context === undefined) {
        throw new Error('useGlobalState must be used within a GlobalProvider');
    }
    return context;
}

function useGlobalDispatch() {
    const context = React.useContext(GlobalDispatchContext);
    if (context === undefined) {
        throw new Error('useGlobalDispatch must be used within a GlobalProvider');
    }
    return context;
}

function useGlobalFunctions() {
    const dispatch = useGlobalDispatch();
    return {
        updateUser: user => {
            dispatch({ type: 'set-user', value: user });
        },
        updateUsers: users => {
            dispatch({ type: 'set-users', value: users });
        }
    }
}


export {
    GlobalProvider,
    useGlobalState,
    useGlobalDispatch,
    useGlobalFunctions
}