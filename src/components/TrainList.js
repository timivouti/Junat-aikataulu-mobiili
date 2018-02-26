import React, { Component } from 'react';
import { ListView } from 'react-native';
import { connect } from 'react-redux';
import { trainsFetch } from '../actions/';
import ListItem from './ListItem';

class TrainList extends Component {
  componentWillMount() {
    const { station } = this.props;
    this.props.trainsFetch(station.station);
    this.createDataSource(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.createDataSource(nextProps);
  }

  createDataSource({ trains }) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(trains);
  }

  renderRow(trains) {
    return <ListItem trains={trains} />;
  }

  render() {
    return (
      <ListView
        dataSource={this.dataSource}
        renderRow={this.renderRow}
      />
    );
  }
}

const mapStateToProps = state => {
  return { trains: state.trains,
    stations: state.stations,
    station: state.station
  };
};

export default connect(mapStateToProps, { trainsFetch })(TrainList);
