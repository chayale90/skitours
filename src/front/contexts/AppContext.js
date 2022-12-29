import React, { createContext, useEffect, useReducer } from 'react'
import axios from 'axios.js'
import MatxLoading from '../components/MatxLoading';
import { getDateArray } from 'front/utils';

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
    value: 'One',
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
  dates: []
}

const initialState = {
  steps: [
    {title: 'step1',visited: true},
    {title: 'step2',visited: false},
    {title: 'step3',visited: false},
    {title: 'step4',visited: false},
    {title: 'step5',visited: false}
  ],
  isInitialised: false,
  templateTransfers,
  templateEquipments,
  templateLessons,
  vehicles: [],
  equipmentTypes: [],
  helmets: [],
  fullName: '',
  target: '',
  arrivalDate: null,
  departureDate: null,
  arrivals: [],
  departures: [],
  equipments: [],
  lessonsData: [],
  lessons:[],
  translations: {},
  language: {
    locale: 'he-IL',
    defaultLocale : 'he-IL'
  },
  currency:   {
    code: "EUR",
    symbol: "€"
  }
}

const reducer = (state, action) => {
    switch (action.type) {
      case 'INIT':
        return {
          ...state,
          helmets:action.payload.assets.helmets,
          equipmentTypes:action.payload.assets.equipments,
          lessonsData:action.payload.assets.lessons,
          vehicles:action.payload.assets.vehicles,isInitialised:true,
          arrivals:[state.templateTransfers],departures:[state.templateTransfers],
          equipments:[state.templateEquipments],
          lessons:[state.templateLessons],
          translations: action.payload.translations
        }
      case 'CHANGE_LOCALE':
        return {...state, language: {...state.language, locale: action.payload}};
      case 'CHANGE_STEP_VISITED':
        const steps = state.steps.map((step)=>{
          if(step.title === action.payload){
            return {...step,visited:true}
          }else{
            return step
          }
        })
        return {...state, steps}
      case 'SAVE_STEP_1':
        const arrs = state.arrivals.map((item)=>{
          return {...item,date:{...item.date,value:action.payload.arrDate}};
        })
        const depts = state.departures.map((item)=>{
          return {...item,date:{...item.date,value:action.payload.deptDate}};
        })
        const lessons = state.lessons.map((lesson)=>{
          return {...lesson,dates:[...action.payload.lessonDates]};
        })
        return {
          ...state, fullName: action.payload.fullName, 
          arrivalDate: action.payload.arrDate, 
          departureDate: action.payload.deptDate,
          target: action.payload.target,
          arrivals: arrs,
          departures:depts,
          templateLessons: {...state.templateLessons,dates: action.payload.lessonDates},
          lessons
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
    addStepThree: () => Promise.resolve(),
    changeStepVisited: () => {},
    changeLocale: () => {}
})

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const changeLocale = (locale) => {
      dispatch({
        type: "CHANGE_LOCALE",
        payload: locale
      })
    }

    const changeStepVisited = (title) => {
      dispatch({
        type: "CHANGE_STEP_VISITED",
        payload:title
      })
    }

    const addStepOne = async (data) => {

      //Set dates for Lessons
      var lessonDates = [];
      const dates = getDateArray(data.arrDate,data.deptDate);
      if(dates){
        dates.forEach((date)=>{
          lessonDates.push({
            date : date,
            time: '09:00 - 11:00',
            hours: '2',
            isSelected: false
          })
        })
      }
      dispatch({
        type: "SAVE_STEP_1",
        payload: {
          fullName: data.fullName, 
          arrDate: data.arrDate, 
          deptDate: data.deptDate,
          target: data.target,
          lessonDates
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
            document.dir = "rtl";
            try {
                    const response = await axios.get('/api/assets')
                    const { assets } = response.data
                    console.log("LessonsData",assets.lessons);
                    const transResponse = await axios.get('/api/translations');
                    const {translations} = transResponse.data;
                    dispatch({
                        type: 'INIT',
                        payload: {assets,translations},
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
                addStepThree,
                changeStepVisited,
                changeLocale
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
