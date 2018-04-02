import React from 'react';
import { connect } from 'react-redux';
import MapView from './components/MapView';
import RoutesView from './components/RoutesView';

import { selectedRoutesChanged } from './../actions/RoutesActions';

class Home extends React.Component {
    constructor() {
        super();
    }

    render() {
        const { selectedRoutesChanged, selectedRoutes } = this.props;
        return (
            <div className = 'map'>
                <RoutesView
                    onRoutesChange = {selectedRoutesChanged}
                />
                <MapView
                    selectedRoutes = {selectedRoutes}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { selectedRoutes } = state.routes;
    return { selectedRoutes };
};

export default connect(
    mapStateToProps,
    {
        selectedRoutesChanged
    }
)(Home);
