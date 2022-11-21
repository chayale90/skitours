import React, { createContext, useReducer } from 'react'
import axios from 'axios.js'

const initialState = {
    lessons: null
}


const reducer = (state, action) => {
    switch (action.type) {
        case 'INIT': {
          return {...state}
        }
        default: {
            return { ...state }
        }
    }
}

const AppContext = createContext({
    ...initialState,
    deleteLesson: () => {},
})

export const AdminAppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const deleteLesson = (id)=>{
      console.log("Id",id);
    }

    return (
        <AppContext.Provider
            value={{
                ...state,
                deleteLesson,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
