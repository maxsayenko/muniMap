import React from 'react';
import _ from 'lodash';
import { Map } from 'react-d3-map';

import MapComponent from './MapComponent';

export default class Home extends React.Component {
    constructor() {
        super();
        this.updateInterval = 15000;
        this.mapWidth = 2000;
        this.mapHeight = 1800;
        this.mapScale = 1 << 22;
        this.mapScaleExtent = [1 << 20, 1 << 24];
        this.mapCenter = [-122.44, 37.76];
        this.state = {
            interval: null,
            freewaysData: null,
            neighborhoodsData: null,
            streetsData: null,
            arteriesData: null,
            muniData: null
        };
    }

    convertNextbusDataToGeoJSON(nextbusVehicles) {
        if(nextbusVehicles && Array.isArray(nextbusVehicles)) {
            const geoJson = {
                "type": "FeatureCollection",
                "features": []
            };
            let feature = {
                "type": "Feature",
                "properties": { },
                "geometry": {
                    "type": "Point",
                    "coordinates": []
                }
            }

            _.each(nextbusVehicles, (vehicleInfo) => {
                let featureClone = _.cloneDeep(feature);
                featureClone.geometry.coordinates = [vehicleInfo.lon, vehicleInfo.lat];
                geoJson.features.push(featureClone);
            });

            return geoJson;
        }

        throw new Error('Nextbus vehicles array is missing');
    }

    fetchGeoJsonFiles(filesToFetch) {
        if(!filesToFetch || !Array.isArray(filesToFetch)) {
            throw new Error('Geo Files needs to be an Array');
        }

        _.each(filesToFetch, (fileObj) => {
            fetch(fileObj.name)
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        [fileObj.stateName]: data
                    });
                });
        });
    }

    getNextBusFeed() {
        fetch('http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni&r=38R')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    muniData: this.convertNextbusDataToGeoJSON(data.vehicle)
                });
            });
    }

    componentDidMount() {
        const interval = window.setInterval(() => this.getNextBusFeed(), this.updateInterval);
        this.setState({ interval });

        this.getNextBusFeed();

        this.fetchGeoJsonFiles([
            {
                name: '/assets/sfmaps/freeways.json',
                stateName: 'freewaysData'
            },
            {
                name: '/assets/sfmaps/neighborhoods.json',
                stateName: 'neighborhoodsData'
            },
            {
                name: '/assets/sfmaps/streets.json',
                stateName: 'streetsData'
            },
            {
                name: '/assets/sfmaps/arteries.json',
                stateName: 'arteriesData'
            }
        ]);
    }

    render() {
        if (!this.state.muniData) {
            return (
                <div>Loading</div>
            );
        }

        return (
            <Map
                width = {this.mapWidth}
                height = {this.mapHeight}
                scale = {this.mapScale}
                scaleExtent = {this.mapScaleExtent}
                center = {this.mapCenter}
            >
                  <MapComponent
                      type = 'line'
                      name = 'freeways'
                      data = {this.state.freewaysData}
                  />
                  <MapComponent
                      type = 'line'
                      name = 'neighborhoods'
                      data = {this.state.neighborhoodsData}
                  />
                  <MapComponent
                      type = 'line'
                      name = 'streets'
                      data = {this.state.streetsData}
                  />
                  <MapComponent
                      type = 'line'
                      name = 'arteries'
                      data = {this.state.arteriesData}
                  />
                  <MapComponent
                      type = 'point'
                      name = 'points'
                      data = {this.state.muniData}
                  />
              </Map>
        );
    }
}
