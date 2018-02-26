import {
  STATION_UPDATE
} from '../actions/types';

const INITIAL_STATE = {
  station: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case STATION_UPDATE:
      return { ...state, station: action.payload };
    default:
      return state;
  }
};
