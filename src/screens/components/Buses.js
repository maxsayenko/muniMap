import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import MapComponent from './MapComponent';

class Buses extends React.Component {
    constructor() {
        super();
        this.buses = {
            type: 'FeatureCollection',
            features: []
        };
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
        const { selectedRoutes } = this.props;
        if (!this.state.muniData) {
            return (
                <div>Loading Buses</div>
            );
        }

        const busesToShow = _.reduce(this.state.muniData.features, (result, busGeoData) => {
            if (_.includes(selectedRoutes, busGeoData.properties.routeTag)) {
                result.push(busGeoData);
            }
            return result;
        }, []);
        this.buses.features = busesToShow;

        return (
              <MapComponent
                  type = 'point'
                  name = 'points'
                  data = {this.buses}
              />
        );
    }
}

const mapStateToProps = (state) => {
    const { selectedRoutes } = state.routes;
    return { selectedRoutes };
};

export default connect(
    mapStateToProps,
    null
)(Buses);

Buses.propTypes = {
    selectedRoutes: PropTypes.array.isRequired
};
