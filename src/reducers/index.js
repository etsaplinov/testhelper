import { combineReducers } from 'redux';

import { default as testsReducer } from './testsReducer';
import { default as questionsReducer } from './questionsReducer';




export default combineReducers({
    tests: testsReducer,
    questions: questionsReducer
});