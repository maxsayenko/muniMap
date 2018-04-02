import React from 'react';
import _ from 'lodash';
import { Map } from 'react-d3-map';

import MapView from './components/MapView';

export default class Home extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className = 'map'>
                <MapView />
            </div>
        );
    }
}
