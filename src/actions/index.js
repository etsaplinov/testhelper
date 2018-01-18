import {
    FETCH_TEST_REQUEST,
    FETCH_TESTS_REQUEST,
    FETCH_TEST_SUCCESS,
    FETCH_TESTS_SUCCESS,
    CHANGE_ANSWER_CORRECT_STATE,
    CHANGE_I_AM_SURE_IN_ANSWER_STATE
} from '../actionTypes';

export let fetchTestRequest = (testName) => {
    return {
        type: FETCH_TEST_REQUEST,
        testName: testName
    };
};
export let fetchTestSuccess = (questions, testName) => {
    return {
        type: FETCH_TEST_SUCCESS,
        payload: questions,
        testName
    };
};

export let changeAnswerCorrectState = (questionKey, answerKey, isCorrect, testName) => {
    return {
        type: CHANGE_ANSWER_CORRECT_STATE,
        questionKey,
        answerKey,
        isCorrect,
        testName
    };
};

export let changeIAmSureInAnswerState = (questionKey, iAmSureInAnswer, testName) => {
    return {
        type: CHANGE_I_AM_SURE_IN_ANSWER_STATE,
        questionKey,
        iAmSureInAnswer,
        testName
    };
};


export let fetchTestsRequest = () => {
    return {
        type: FETCH_TESTS_REQUEST
    };
};
export let fetchTestsSuccess = (tests, sessions) => {
    return {
        type: FETCH_TESTS_SUCCESS,
        tests,
        sessions
    };
};