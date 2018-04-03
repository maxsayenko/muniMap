import React from 'react';
import PropTypes from 'prop-types';
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
        if (routes && Array.isArray(routes)) {
            return _.map(routes, (route, i) => {
                return (
                    <li
                        key = {i}
                    >
                        <input
                            type = 'checkbox'
                            name = 'route'
                            value = {route.tag}
                            //defaultChecked
                            onClick = {this.handleClick.bind(this)}
                        />
                            <label htmlFor = 'route'>{route.title}</label>
                    </li>
                );
            });
        }

        return null;
    }

    handleClick(e) {
        const { onRoutesChange } = this.props;
        const target = e.target;
        const checkboxes = target.parentElement.parentElement.getElementsByTagName('input');
        const selectedCheckboxes = _.reduce(checkboxes, (res, checkbox) => {
            if (checkbox.checked) {
                res.push(checkbox.value);
            }
            return res;
        }, []);

        onRoutesChange(selectedCheckboxes);
    }

    render() {
        if (!this.state.routes) {
            return (
                <div>Loading routes</div>
            );
        }

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
    onRoutesChange: PropTypes.func.isRequired
};
