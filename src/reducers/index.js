import { combineReducers } from 'redux';
import TrainReducer from './TrainReducer';
import SelectionReducer from './SelectionReducer';
import StationReducer from './StationReducer';
import StationSelectionReducer from './StationSelectionReducer';

export default combineReducers({
  trains: TrainReducer,
  selectedTrainId: SelectionReducer,
  stations: StationReducer,
  station: StationSelectionReducer
});
