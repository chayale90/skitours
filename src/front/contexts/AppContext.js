import React, { createContext, useEffect, useReducer } from 'react'
import axios from 'axios.js'
import MatxLoading from '../components/MatxLoading';

const templateTransfers = {
  date: {
      value: null,
      isValid: true
  },
  time: {
      value: '11:00',
      isValid: true
  },
  airport: {
      value: ''
  },
  flight_number: {
      value: '',
  },
  vehicle: {
      value: '',
      isValid: true
  },
  number_of_people: {
      value: '',
      isValid: true
  },
  number_of_child: {
      value: ''
  },
  message: {
      value: ''
  }
};

const templateEquipments = {
  name: {
      value: "",
      isValid: true
  },
  first_date: {
      value: "",
      isValid: true
  },
  last_date: {
      value: "",
      isValid: true
  },
  equipment_type: {
      value: "",
      isValid: true
  },
  helmet: {
      value: "",
      isValid: true
  },
  age_type: {
      value: "child",
      isValid: true
  }
};

const templateLessons = {
  training_type: {
    value: "private",
    isValid: true
  },
  number_of_people: {
    value: '',
    isValid: true
  },
  skill_level: {
    value: '',
    isValid: true
  },
  name: {
    value: '',
    isValid: true
  },
  lesson_type: {
    value: "ski",
    isValid: true
  },
  age_type: {
    value: "adult",
    isValid: true
  },
  dates: [
    {
      date: Date.now(),
      time: "09:00 - 11:00"
    },
    {
      date: Date.now(),
      time: "09:00 - 11:00"
    },
    {
      date: Date.now(),
      time: "09:00 - 11:00"
    }
  ]
}

const initialState = {
  isInitialised: false,
  templateTransfers,
  templateEquipments,
  templateLessons,
  vehicles: [],
  airports: [],
  equipmentTypes: [],
  helmets: [],
  fullName: '',
  target: '',
  arrivalDate: null,
  departureDate: null,
  arrivals: [],
  departures: [],
  equipments: [],
  lessons:[],
  currency:   {
    code: "EUR",
    symbol: "€"
  }
}

const reducer = (state, action) => {
    switch (action.type) {
      case 'INIT':
        return {
          ...state,airports:action.payload.assets.airports,
          helmets:action.payload.assets.helmets,
          equipmentTypes:action.payload.assets.equipments, 
          vehicles:action.payload.assets.vehicles,isInitialised:true,
          arrivals:[state.templateTransfers],departures:[state.templateTransfers],
          equipments:[state.templateEquipments],
          lessons:[state.templateLessons]
        }
      case 'SAVE_STEP_1':
        const arrs = state.arrivals.map((item)=>{
          return {...item,date:{...item.date,value:action.payload.arrDate}};
        })
        const depts = state.departures.map((item)=>{
          return {...item,date:{...item.date,value:action.payload.deptDate}};
        })
        return {
          ...state, fullName: action.payload.fullName, 
          arrivalDate: action.payload.arrDate, 
          departureDate: action.payload.deptDate,
          target: action.payload.target,
          arrivals: arrs,
          departures:depts
        };
      case 'SAVE_STEP_2':
        return {
            ...state, 
            arrivals: action.payload.arrivals,
            departures: action.payload.departures
        }
      case "SAVE_STEP_3":
        return {
          ...state,
          equipments: action.payload.equipments
        }
      default: {
          return { ...state }
      }
    }
}

const AppContext = createContext({
    ...initialState,
    addStepOne: () => Promise.resolve(),
    addStepTwo: () => Promise.resolve(),
    addStepThree: () => Promise.resolve()
})

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const addStepOne = async (data) => {
      dispatch({
        type: "SAVE_STEP_1",
        payload: {
          fullName: data.fullName, 
          arrDate: data.arrDate, 
          deptDate: data.deptDate,
          target: data.target
        }
      })
    }

    const addStepTwo = async (data) => {
      dispatch({
        type: "SAVE_STEP_2",
        payload: {
          arrivals: data.arrivals,
          departures: data.departures
        }
      })
    }

    const addStepThree = async  (data) => {
      dispatch({
        type: "SAVE_STEP_3",
        payload: {
          equipments: data.equipments
        }
      })
    }

    useEffect(() => {
        ; (async () => {
            try {
                    const response = await axios.get('/api/assets')
                    const { assets } = response.data
                    dispatch({
                        type: 'INIT',
                        payload: {assets},
                    })
            } catch (err) {
                dispatch({type: 'INIT'})
            }
        })()
    }, [])

    if (!state.isInitialised) {
        return <MatxLoading />
    }

    return (
        <AppContext.Provider
            value={{
                ...state,
                // login
                addStepOne,
                addStepTwo,
                addStepThree
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
