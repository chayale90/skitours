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
  hotel: {
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
  skipass: {
    value: false
  },
  skipass_first_date: {
    value: "",
    isValid: true
  },
  skipass_last_date: {
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
    value: '0',
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
  cities: [],
  arrivalDate: null,
  departureDate: null,
  arrivals: [],
  departures: [],
  equipments: [],
  lessonsData: [],
  lessons:[],
  skilllevels: [],
  availabilities: [],
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
        let locale = "he-IL";
        if(localStorage.getItem('locale')){
          locale = localStorage.getItem('locale');
        }
        return {
          ...state,
          cities: action.payload.assets.cities,
          helmets:action.payload.assets.helmets,
          equipmentTypes:action.payload.assets.equipments,
          lessonsData:action.payload.assets.lessons,
          skilllevels: action.payload.assets.skilllevels,
          availabilities: action.payload.assets.availabilities,
          vehicles:action.payload.assets.vehicles,isInitialised:true,
          arrivals:[state.templateTransfers],departures:[state.templateTransfers],
          equipments:[state.templateEquipments],
          lessons:[state.templateLessons],
          translations: action.payload.translations,
          language: {...state.language, locale}
        }
      case 'CHANGE_LOCALE':
        localStorage.setItem('locale',action.payload);
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
          return {...lesson,dates:[...action.payload.lessonDates],name:{...lesson.name,value: action.payload.fullName}};
        })
        const equipments = state.equipments.map((equipment)=>{
          return {...equipment,
            first_date:{...equipment.first_date,value:action.payload.arrDate},
            last_date:{...equipment.last_date,value:action.payload.deptDate},
            skipass_first_date:{...equipment.skipass_first_date,value:action.payload.arrDate},
            skipass_last_date:{...equipment.skipass_last_date,value:action.payload.deptDate}
          }
        })
        return {
          ...state, fullName: action.payload.fullName, 
          arrivalDate: action.payload.arrDate, 
          departureDate: action.payload.deptDate,
          target: action.payload.target,
          arrivals: arrs,
          departures:depts,
          equipments,
          templateLessons: {...state.templateLessons,dates: action.payload.lessonDates},
          lessons
        };
      case 'SAVE_STEP_2':
        if(action.payload.arrivals === null){
          return {...state, departures: action.payload.departures}
        }else if(action.payload.departures === null){
          return {...state, arrivals: action.payload.arrivals}
        }
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
      case "SAVE_STEP_4":
        return {
          ...state,
          lessons: action.payload.lessons
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
    addStepFour: () => Promise.resolve(),
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
      const availabilities = state?.availabilities?.filter((availability)=>{return availability.hours === 2})
      if(dates){
        dates.forEach((date)=>{
          lessonDates.push({
            date : date,
            time: availabilities[0]?.timing,
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

    const addStepFour = async (data) => {
      dispatch({
        type: "SAVE_STEP_4",
        payload: {
          lessons: data.lessons
        }
      })
    }

    useEffect(() => {
        ; (async () => {
            let locale = 'he-IL';
            if(localStorage.getItem('locale')) locale = localStorage.getItem('locale');
            if(locale === 'he-IL'){
              document.dir = "rtl";
            }else{
              document.dir = "ltr";
            }
            try {
                    const response = await axios.get('/api/assets')
                    const { assets } = response.data
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
                addStepFour,
                changeStepVisited,
                changeLocale
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
