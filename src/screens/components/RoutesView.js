import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

class RoutesView extends React.Component {
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
        const { selectedRoutes } = this.props;
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
                            defaultChecked = {_.includes(selectedRoutes, route.tag)}
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

const mapStateToProps = (state) => {
    const { selectedRoutes } = state.routes;
    return { selectedRoutes };
};

export default connect(
    mapStateToProps,
    null
)(RoutesView);

RoutesView.propTypes = {
    onRoutesChange: PropTypes.func.isRequired
};
