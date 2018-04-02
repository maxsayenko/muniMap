import React from "react";
import PropTypes from 'prop-types';
import { LineGroup, MarkerGroup } from 'react-d3-map';

export default class MapComponent extends React.Component {
    getGroup(type, name, data) {
        switch(type) {
            case 'line':
                return (
                    <g className = {`${name}-g`}>
                          <LineGroup
                              key = {`line-${name}`}
                              data = {data}
                              meshClass = {name}
                          />
                    </g>
                );
            case 'point':
                return (
                    <g className = {`${name}-g`}>
                        <MarkerGroup
                            key = {'point-${name}'}
                            data = {data}
                            markerClass = {name}
                        />
                    </g>
                );
            default:
                return null;
        }
    }

    render() {
        const { type, name, data } = this.props;
        if (!data) {
            return null;
        }
        return this.getGroup(type, name, data);
    }
}

MapComponent.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    data: PropTypes.object
};
