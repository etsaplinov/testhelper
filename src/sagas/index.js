// import { delay } from 'redux-saga';
import { put, takeEvery, all } from 'redux-saga/effects';
import {
    FETCH_TEST_REQUEST,
    FETCH_TESTS_REQUEST,
    CHANGE_ANSWER_CORRECT_STATE,
    CHANGE_I_AM_SURE_IN_ANSWER_STATE
} from '../actionTypes';
import { fetchTestSuccess, fetchTestsSuccess } from '../actions';

const domain = 'http://localhost:3004';

// Our worker Saga: will perform the async increment task
function* loadTestAsync(action) {
    var tests = yield fetch(domain + '/api/questions/' + action.testName).then(response => {
        return response.json();
    }).then(tests => {
        return tests;
    });

    yield put(fetchTestSuccess(tests, action.testName));

}

function* loadTestsAsync(action) {
    var tests = yield fetch(domain + '/api/tests').then(response => {
        return response.json();
    }).then(tests => {
        return tests;
    });

    yield put(fetchTestsSuccess(tests.tests, tests.sessions));

}


function* changeAnswerCorrectStateAsync(action) {


    var payload = {
        questionKey: action.questionKey,
        answerKey: action.answerKey,
        isCorrect: action.isCorrect,
        testName: action.testName
    };

    var data = new FormData();
    data.append("json", JSON.stringify(payload));


    yield fetch(domain + '/api/changecorrectstate', { method: "POST", body: data }).then(response => {
        return response.json();
    }).then(result => {
        console.log(result);
    });
}

function* changeIAmSureInAnswerStateAsync(action) {


    var payload = {
        questionKey: action.questionKey,
        iAmSureInAnswer: action.iAmSureInAnswer,
        testName: action.testName
    };

    var data = new FormData();
    data.append("json", JSON.stringify(payload));


    yield fetch(domain + '/api/changeimsurestate', { method: "POST", body: data }).then(response => {
        return response.json();
    }).then(result => {
        console.log(result);
    });
}




// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
function* watchLoadTestAsync() {
    yield takeEvery(FETCH_TEST_REQUEST, loadTestAsync);
}

// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
function* watchLoadTestsAsync() {
    yield takeEvery(FETCH_TESTS_REQUEST, loadTestsAsync);
}

// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
function* watchChangeAnswerCorrectStateAsync() {
    yield takeEvery(CHANGE_ANSWER_CORRECT_STATE, changeAnswerCorrectStateAsync);
}

// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
function* watchChangeiAmSureInAnswerStateAsync() {
    yield takeEvery(CHANGE_I_AM_SURE_IN_ANSWER_STATE, changeIAmSureInAnswerStateAsync);
}




export default function* rootSaga() {
    yield all([
        watchLoadTestAsync(),
        watchLoadTestsAsync(),
        watchChangeAnswerCorrectStateAsync(),
        watchChangeiAmSureInAnswerStateAsync()
    ]);
}