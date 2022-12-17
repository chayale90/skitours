import {
  SAVE_STEP_1,
  SAVE_STEP_2,
} from '../actions/StorefrontActions';

const initialState = {
  fullName: '',
  target: '',
  arrivalDate: '',
  departureDate: '',
  arrivals: [],
  departures: [],
  currency:   {
    code: "EUR",
    symbol: "€"
  }
};

const StorefrontReducer = function (state = initialState, action) {
  switch (action.type) {
    case SAVE_STEP_1:
      return {
        ...state, fullName: action.payload.fullName, 
        arrivalDate: action.payload.arrDate, 
        departureDate: action.payload.deptDate,
        target: action.payload.target
      };
    case SAVE_STEP_2:
      return {
          ...state, 
          arrivals: action.payload.arrivals,
          departures: action.payload.departures
      }
    default: {
      return {
        ...state,
      };
    }
  }
};

export default StorefrontReducer;
