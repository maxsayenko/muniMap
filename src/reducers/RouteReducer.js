import {
    SELECTED_ROUTES_CHANGED
} from '../actions/types';

const INITIAL_STATE = {
    selectedRoutes: ['38']
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SELECTED_ROUTES_CHANGED:
            return { ...INITIAL_STATE, selectedRoutes: action.payload };
        default:
            return state;
    }
};
