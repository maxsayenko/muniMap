import React from 'react';
import _ from 'lodash';

export default class RoutesView extends React.Component {
    constructor() {
        super();
        this.state = {
            routes: null
        };
    }

    componentDidMount() {
        fetch('http://webservices.nextbus.com/service/publicJSONFeed?command=routeList&a=sf-muni')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    routes: data.route
                });
            });
    }

    render() {
        if (!this.state.routes) {
            return (
                <div>Loading routes</div>
            );
        }

        console.log(this.state.routes);

        return (
            <div className = 'routes'>
                Routes
            </div>
        );
    }
}

RoutesView.propTypes = {
};
