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

    getRoutesItems(routes) {
//         tag
// :
// "MBUS"
// title
// :
// "MBUS-M Oceanview Bus"
        if (routes && Array.isArray(routes)) {
            return _.map(routes, (route, i) => {
                return (
                    <li
                        key = {i}
                    >
                        <input type = 'checkbox' name = 'route' value = {route.tag} />
                            <label htmlFor = 'route'>{route.title}</label>
                    </li>
                );
            });
        }

        return null;
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
                <ul>
                    {this.getRoutesItems(this.state.routes)}
                </ul>
            </div>
        );
    }
}

RoutesView.propTypes = {
};
