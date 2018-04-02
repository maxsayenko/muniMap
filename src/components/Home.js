import React from 'react';
import _ from 'lodash';
import { Map, LineGroup, MarkerGroup } from 'react-d3-map';

export default class Home extends React.Component {
    constructor() {
        super();
        this.mapWidth = 2000;
        this.mapHeight = 1800;
        this.mapScale = 1 << 22;
        this.mapScaleExtent = [1 << 20, 1 << 24];
        this.mapCenter = [-122.44, 37.76];
        this.state = {
            freewaysData: null,
            neighborhoodsData: null,
            streetsData: null,
            arteriesData: null,
            muniData: null
        };
    }

    convertNextbusDataToGeoJSON(nextbusVehicles) {
        // [
        //     {
        //       "id": "6657",
        //       "lon": "-122.443657",
        //       "routeTag": "38R",
        //       "predictable": "true",
        //       "speedKmHr": "42",
        //       "dirTag": "38R__I_F00",
        //       "heading": "75",
        //       "lat": "37.782684",
        //       "secsSinceReport": "24"
        //     }
        //   ]
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
                    "coordinates": [ -122.443657, 37.782684]
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

    componentDidMount() {
        // fetch(`http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni&r=38R&t=${(new Date).getTime()}`)
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log(data);
        //         // this.setState({
        //         //     muniData: data
        //         // });
        //     });
        //
        //
        fetch('http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni&r=38R')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    muniData: this.convertNextbusDataToGeoJSON(data.vehicle)
                });
            });

        fetch('/assets/sfmaps/freeways.json')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    freewaysData: data
                });
            });

        fetch('/assets/sfmaps/neighborhoods.json')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    neighborhoodsData: data
                });
            });

        fetch('/assets/sfmaps/streets.json')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    streetsData: data
                });
            });

        fetch('/assets/sfmaps/arteries.json')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    arteriesData: data
                });
            });

        fetch('/assets/sfmaps/arteries.json')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    arteriesData: data
                });
            });
    }

    getFreeways(freewaysData) {
        if(!freewaysData) {
            return null;
        }

        return (
            <g className = 'freeways-g'>
                  <LineGroup
                      key = {'line-test'}
                      data = {freewaysData}
                      meshClass = {'freeways'}
                  />
            </g>
        );
    }

    getNeigborhoods(neighborhoodsData) {
        if(!neighborhoodsData) {
            return null;
        }

        return (
            <g className = 'neighborhoods-g'>
                  <LineGroup
                      key = {'line-test'}
                      data = {neighborhoodsData}
                      meshClass = {'neighborhoods'}
                  />
            </g>
        );
    }

    getStreets(streetsData) {
        if(!streetsData) {
            return null;
        }

        return (
            <g className = 'streets-g'>
                  <LineGroup
                      key = {'line-test'}
                      data = {streetsData}
                      meshClass = {'streets'}
                  />
            </g>
        );
    }

    getArteries(arteriesData) {
        if(!arteriesData) {
            return null;
        }

        return (
            <g className = 'arteries-g'>
                  <LineGroup
                      key = {'line-test'}
                      data = {arteriesData}
                      meshClass = {'arteries'}
                  />
            </g>
        );
    }

    getPoints(muniData) {
        if(!muniData) {
            return null;
        }

        return (
            <g className = 'points-g'>
                <MarkerGroup
                  key = {'polygon-test'}
                  data = {muniData}
                  markerClass = {'your-marker-css-class'}
                />
            </g>
        );
    }

    render() {
        if (!this.state.freewaysData) {
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
                  {this.getFreeways(this.state.freewaysData)}
                  {this.getNeigborhoods(this.state.neighborhoodsData)}
                  {this.getStreets(this.state.streetsData)}
                  {this.getArteries(this.state.arteriesData)}
                  {this.getPoints(this.state.muniData)}
              </Map>
        );
    }
}
