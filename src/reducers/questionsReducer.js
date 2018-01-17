import {
    FETCH_TEST_REQUEST,
    FETCH_TEST_SUCCESS,
    CHANGE_ANSWER_CORRECT_STATE,
    CHANGE_I_AM_SURE_IN_ANSWER_STATE
} from '../actionTypes';

const questionsReducer = (state = { test_name: 'questions_bootstrap.json', fetch_status: 'empty', items: [] }, action) => {

    let changeCorrectState = (state, questionKey, answerKey, isCorrect) => {

        var newItems = new Map(state.items)
        var question = newItems.get(questionKey);

        for (let a of question.answers) {
            if (a.md5 === answerKey) {
                a.isCorrect = isCorrect;
                break;
            }
        }

        newItems.set(questionKey, question);


        return Object.assign({}, {
            fetch_status: state.fetch_status,
            test_name: state.test_name,
            items: newItems
        });

    }

    let changeIAmSureInAnswerState = (state, questionKey, iAmSureInAnswer) => {

        var newItems = new Map(state.items)
        var question = newItems.get(questionKey);

        question.iAmSureInAnswer = iAmSureInAnswer;
        newItems.set(questionKey, question);


        return Object.assign({}, {
            fetch_status: state.fetch_status,
            test_name: state.test_name,
            items: newItems
        });

    }

    switch (action.type) {
        case FETCH_TEST_REQUEST:
            return Object.assign({}, {
                test_name: action.testName,
                fetch_status: 'fetching',
                items: state.items
            });
        case FETCH_TEST_SUCCESS:
            return Object.assign({}, {
                fetch_status: 'fetch_success',
                test_name: state.test_name,
                items: new Map(action.payload)
            });
        case CHANGE_I_AM_SURE_IN_ANSWER_STATE:
            return changeIAmSureInAnswerState(state, action.questionKey, action.iAmSureInAnswer);
        case CHANGE_ANSWER_CORRECT_STATE:
            return changeCorrectState(state, action.questionKey, action.answerKey, action.isCorrect);
        default:
            return state;
    }
};

export default questionsReducer;