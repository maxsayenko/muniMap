import {
    SELECTED_ROUTES_CHANGED
} from './types';

export const selectedRoutesChanged = (selectedRoutes) => {
    return { type: SELECTED_ROUTES_CHANGED, payload: selectedRoutes };
};
