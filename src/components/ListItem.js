import React, { Component } from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  View,
  UIManager,
  LayoutAnimation,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import { CardSection } from './common';
import * as actions from '../actions';

class ListItem extends Component {
  componentWillUpdate() {
    LayoutAnimation.spring();
  }

  stationFullName(stationShortCode, commuterLineID) {
    const { stations, station } = this.props;
    const pLineStopsBeforeAirport = [
    'HKI', 'PSL', 'ILA', 'HPL', 'POH', 'KAN',
    'MLO', 'MYR', 'LOH', 'MRL',
    'VKS', 'VEH', 'KTÖ', 'AVP'];

    const iLineStopsBeforeAirport = [
    'HKI', 'PSL', 'KÄP', 'OLK', 'PMK', 'ML',
    'TNA', 'PLA', 'TKL', 'HKH', 'LNÄ'];
    if (commuterLineID === 'P' || commuterLineID === 'I') {
      if (commuterLineID === 'P') {
        for (let i = 0; i < pLineStopsBeforeAirport.length; i++) {
          if (station.station === pLineStopsBeforeAirport[i]) {
            return 'Lentoasema';
          }
        }
        return 'Helsinki';
      }

      if (commuterLineID === 'I') {
        for (let i = 0; i < iLineStopsBeforeAirport.length; i++) {
          if (station.station === iLineStopsBeforeAirport[i]) {
            return 'Lentoasema';
          }
        }
        return 'Helsinki';
      }
    } else {
      for (let i = 0; i < stations.length; i++) {
        if (stations[i].stationShortCode === stationShortCode) {
          return stations[i].stationName;
        }
      }
    }
  }

  parseTime(time) {
    if (!time) {
      return null;
    }
    const newTime = new Date(time);
    newTime.setHours(newTime.getHours() + 2);
    const newTimeISO = newTime.toISOString();
    return newTimeISO.substring(11, 16);
  }

  findWhichStationForTime() {
    const { timeTableRows } = this.props.trains;
    const { station } = this.props;
    let result = 0;

    for (let i = 0; i < timeTableRows.length; i++) {
      if (timeTableRows[i].stationShortCode === station.station) {
        result = i;
        if (timeTableRows[i].type === 'DEPARTURE') {
          return result;
        }
      }
    }
    return result;
  }

  renderEstimate(timeTableRows, notTitle) {
    const renderScheduledTime = this.parseTime(timeTableRows.scheduledTime);
    const renderEstimateTime = this.parseTime(timeTableRows.liveEstimateTime);
    const dayTime = new Date();
    const dayTimeISO = dayTime.toISOString();

    if (timeTableRows.liveEstimateTime && (renderScheduledTime !== renderEstimateTime)) {
      if (notTitle) {
        if (dayTimeISO >= timeTableRows.scheduledTime) {
          return (
          <View style={{ flex: 1.7 }}>
            <Text style={styles.titleTimeHappenedEstimateStyle}>
              {renderEstimateTime}
            </Text>
          </View>
          );
        }
        return (
          <View style={{ flex: 1.7 }}>
            <Text style={styles.titleTimeLateStyle}>
              {renderScheduledTime}
            </Text>
            <Text style={styles.titleTimeEstimateStyle}>
              {renderEstimateTime}
            </Text>
          </View>
        );
      }

      return (
        <View style={{ flex: 1.15 }}>
          <Text style={styles.titleTimeLateStyle}>
            {renderScheduledTime}
          </Text>
          <Text style={styles.titleTimeEstimateStyle}>
            {renderEstimateTime}
          </Text>
        </View>
      );
    }

    if (notTitle) {
      if (dayTimeISO >= timeTableRows.scheduledTime) {
        return (
          <Text style={styles.timeHappenedStyle}>
            {renderScheduledTime}
          </Text>
        );
      }
      return (
        <Text style={styles.timeStyle}>
          {renderScheduledTime}
        </Text>
      );
    }

    return (
      <Text style={styles.titleTimeStyle}>
        {renderScheduledTime}
      </Text>
    );
  }

  renderDescription() {
    const lastCommercialTrack = [];
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental
      && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    const { trains, expanded } = this.props;
    const { timeTableRows } = trains;
    const { stationStyle, lineStyle } = styles;

    if (expanded) {
        return timeTableRows.map((stoppingTrains, i) => {
          const { scheduledTime,
            stationShortCode,
            type,
            trainStopping,
            commercialTrack
          } = stoppingTrains;

          if (trainStopping && type === 'DEPARTURE') {
            let commercialTrackRender = commercialTrack;
            if (!commercialTrack) {
              commercialTrackRender = lastCommercialTrack[lastCommercialTrack.length - 1];
            }

            return (
              <CardSection key={stationShortCode + scheduledTime}>
                {this.renderEstimate(stoppingTrains, true)}
                <Text style={stationStyle}>{this.stationFullName(stationShortCode)}</Text>
                <Text style={lineStyle}>{commercialTrackRender}</Text>
              </CardSection>
              );
          } else if (timeTableRows.length === i + 1) {
            return (
              <CardSection key={stationShortCode}>
                {this.renderEstimate(stoppingTrains, true)}
                <Text style={stationStyle}>{this.stationFullName(stationShortCode)}</Text>
                <Text style={lineStyle}>{commercialTrack}</Text>
              </CardSection>
            );
          }

          if (trainStopping && type === 'ARRIVAL') {
            lastCommercialTrack.push(commercialTrack);
          }
        return null;
        });
    }
  }

  render() {
    const { trainNumber, commuterLineID, timeTableRows } = this.props.trains;
    const { titleStyle, titleLineStyle } = styles;

  return (
    <TouchableWithoutFeedback
      onPress={() => this.props.selectTrain(trainNumber)}
    >
      <View>
        <CardSection>
            {this.renderEstimate(timeTableRows[this.findWhichStationForTime()], false)}
          <Text style={titleLineStyle} key={commuterLineID}>
            {commuterLineID}
          </Text>
          <Text style={titleStyle}>
            {this.stationFullName(
              timeTableRows[timeTableRows.length - 1].stationShortCode,
              commuterLineID
            )}
          </Text>
          <Text style={titleLineStyle}>
            {timeTableRows[0].commercialTrack}
          </Text>
        </CardSection>
          {this.renderDescription()}
      </View>
    </TouchableWithoutFeedback>
  );
  }
}

const styles = {
  titleStyle: {
    flex: 2,
    fontSize: 22
  },
  titleTimeStyle: {
    flex: 1,
    fontSize: 22,
    paddingLeft: 15
  },
  titleLineStyle: {
    flex: 0.5,
    fontSize: 22
  },
  timeStyle: {
    flex: 1.5,
    fontSize: 16,
    paddingLeft: 15
  },
  timeHappenedStyle: {
    flex: 1.5,
    fontSize: 16,
    paddingLeft: 15,
    textDecorationLine: 'line-through'
  },
  stationStyle: {
    flex: 2,
    fontSize: 16
  },
  lineStyle: {
    flex: 0.5,
    fontSize: 16
  },
  titleTimeEstimateStyle: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 15,
    color: 'green'
  },
  titleTimeHappenedEstimateStyle: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 15,
    color: 'red',
    textDecorationLine: 'line-through'
  },
  titleTimeLateStyle: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 15,
    textDecorationLine: 'line-through',
    color: 'green'
  }
};

const mapStateToProps = (state, ownProps) => {
  const expanded = state.selectedTrainId === ownProps.trains.trainNumber;
  const { stations, station } = state;

  return { expanded, stations, station };
};

export default connect(mapStateToProps, actions)(ListItem);
