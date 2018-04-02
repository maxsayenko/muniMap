import React from 'react';
import { connect } from 'react-redux';
import MapView from './components/MapView';
import RoutesView from './components/RoutesView';

class Home extends React.Component {
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

const mapStateToProps = (state) => {
    const { selectedRoutes } = state.routes;
    return { selectedRoutes };
};

export default connect(
    mapStateToProps,
    {
    }
)(Home);
