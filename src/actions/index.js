import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import {
  TRAINS_FETCH_SUCCESS,
  STATION_UPDATE
 } from './types';

export const stationUpdate = (stationShortCode) => {
  return {
    type: STATION_UPDATE,
    payload: stationShortCode
  };
};

export const stationSelected = (stationShortCode) => {
  Actions.trains({ title: stationShortCode });
  return {
    type: STATION_UPDATE,
    payload: stationShortCode
  };
};

export const selectTrain = (trainId) => {
  return {
    type: 'select_train',
    payload: trainId
  };
};

export const trainsFetch = (station) => {
  const url = `https://rata.digitraffic.fi/api/v1/live-trains/station/${station}?arrived_trains=0&arriving_trains=0&departed_trains=0&departing_trains=20&include_nonstopping=false`;
  return (dispatch) => {
  axios.get(url)
    .then(response => dispatch({ type: TRAINS_FETCH_SUCCESS, payload: response.data }));
  };
};
