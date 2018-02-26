import React from 'react';
import { Actions, Scene, Router } from 'react-native-router-flux';
import TrainList from './components/TrainList';
import StationSearch from './components/StationSearch';

const RouterComponent = () => {
  return (
    <Router>
      <Scene key="main">
        <Scene
          sceneStyle={{ paddingTop: 56 }}
          key="trains"
          component={TrainList}
          title="Junat"
          titleStyle={{ alignSelf: 'center' }}
          rightTitle="Päivitä"
          onRight={() => Actions.refresh({ key: Actions.currentScene })}
        />
        <Scene
          sceneStyle={{ paddingTop: 56 }}
          key="stations"
          component={StationSearch}
          title="Asemahaku"
          titleStyle={{ alignSelf: 'center' }}
          initial
        />
      </Scene>
    </Router>
  );
};

export default RouterComponent;
