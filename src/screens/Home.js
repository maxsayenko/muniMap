import React from 'react';

import MapView from './components/MapView';
import RoutesView from './components/RoutesView';

export default class Home extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className = 'map'>
                <RoutesView />
                <MapView />
            </div>
        );
    }
}
