import { FETCH_TESTS_REQUEST, FETCH_TESTS_SUCCESS } from '../actionTypes';

const testsReducer = (state = { fetch_status: 'empty', tests: [], sessions: [] }, action) => {

    switch (action.type) {
        case FETCH_TESTS_REQUEST:
            return Object.assign({}, {
                fetch_status: 'fetching',
                tests: state.tests,
                sessions: state.sessions,
            });
        case FETCH_TESTS_SUCCESS:
            return Object.assign({}, {
                fetch_status: 'fetch_success',
                tests: [...action.tests],
                sessions: [...action.sessions]
            });
        default:
            return state;
    }
};

export default testsReducer;