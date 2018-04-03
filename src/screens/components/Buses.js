import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import MapComponent from './MapComponent';

class Buses extends React.Component {
    constructor() {
        super();
        this.updateInterval = 15000;
        this.state = {
            muniData: null
        };
    }

    componentDidMount() {
        const interval = window.setInterval(() => this.getNextBusFeed(), this.updateInterval);
        this.setState({ interval });

        this.getNextBusFeed();
    }

    componentWillReceiveProps(nextProps) {
        console.log('Buses componentWillReceiveProps', nextProps);
        //this.getNextBusFeed();
    }

    getNextBusFeed() {
        fetch('http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    muniData: this.convertNextbusDataToGeoJSON(data.vehicle)
                });
            });
    }

    convertNextbusDataToGeoJSON(nextbusVehicles) {
        const { selectedRoutes } = this.props;
        if (nextbusVehicles && Array.isArray(nextbusVehicles)) {
            const geoJson = {
                type: 'FeatureCollection',
                features: []
            };
            const feature = {
                type: 'Feature',
                properties: {
                    routeTag: null
                },
                geometry: {
                    type: 'Point',
                    coordinates: []
                }
            };

            _.each(nextbusVehicles, (vehicleInfo) => {
                //if (!_.includes(selectedRoutes, vehicleInfo.routeTag)) return true;
                const featureClone = _.cloneDeep(feature);
                featureClone.geometry.coordinates = [vehicleInfo.lon, vehicleInfo.lat];
                featureClone.properties.routeTag = vehicleInfo.routeTag;
                geoJson.features.push(featureClone);
            });

            return geoJson;
        }

        throw new Error('Nextbus vehicles array is missing');
    }

    render() {
        console.log('Buses Render');
        if (!this.state.muniData) {
            return (
                <div>Loading Buses</div>
            );
        }

        const { selectedRoutes } = this.props;
        console.log('Buses selectedRoutes', selectedRoutes);
        console.log('Buses muniData', this.state.muniData);

        const busesToShow = _.reduce(this.state.muniData.features, (result, busGeoData) => {
            if (_.includes(selectedRoutes, busGeoData.properties.routeTag)) {
                result.push(busGeoData);
            }
            return result;
        }, []);

        const geoJson = {
            type: 'FeatureCollection',
            features: []
        };
        geoJson.features = busesToShow;

        console.log('busesToShow', busesToShow);

        return (
              <MapComponent
                  type = 'point'
                  name = 'points'
                  data = {geoJson}
              />
        );
    }
}

const mapStateToProps = (state) => {
    const { selectedRoutes } = state.routes;
    console.log('Buses', selectedRoutes);
    return { selectedRoutes };
};

export default connect(
    mapStateToProps,
    null
)(Buses);

Buses.propTypes = {
    //selectedRoutes: PropTypes.array.isRequired
};
