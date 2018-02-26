import React, { Component } from 'react';
import { Text, Picker } from 'react-native';
import { connect } from 'react-redux';
import { Card, CardSection, Button } from './common';
import { stationUpdate, stationSelected } from '../actions/';

class StationSearch extends Component {
  onButtonPress() {
    this.props.stationSelected(this.props.station.station || 'AIN');
  }

  render() {
    const { stations } = this.props;
    const filteredStations = [];
      for (let i = 0; i < stations.length; i++) {
        if (stations[i].passengerTraffic) {
          filteredStations.push(stations[i]);
        }
      }

    const stationsItems = filteredStations.map((newStation) => {
        return (
          <Picker.Item
            label={newStation.stationName}
            value={newStation.stationShortCode}
            key={newStation.stationShortCode}
          />
        );
    });

    return (
      <Card>
        <CardSection>
          <Text style={styles.pickerTextStyle}>Asema</Text>
          <Picker
            style={{ flex: 2 }}
            selectedValue={this.props.station.station}
            onValueChange={value => this.props.stationUpdate(value)}
          >
            {stationsItems}
          </Picker>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this)}>
            Etsi
          </Button>
        </CardSection>
        </Card>
    );
  }
}

const styles = {
  pickerTextStyle: {
    fontSize: 18,
    paddingLeft: 20,
    alignSelf: 'center',
    flex: 1
  }
};

const mapStateToProps = (state) => {
  return { station: state.station, stations: state.stations };
};

export default connect(mapStateToProps, { stationUpdate, stationSelected })(StationSearch);
