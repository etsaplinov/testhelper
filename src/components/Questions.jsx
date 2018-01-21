import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Checkbox, Panel, Row, Col} from 'react-bootstrap';

import Question from './Question';

import * as actionCreators from '../actions';

class Questions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onlyUnanswered: false
        };
    }

    componentDidMount() {

        if (this.props.fetch_status !== 'fetch_completed') {
            this.props.fetchTestRequest(this.props.test_name);
        }
    }

    handleInputChange = (event) =>  {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        
        console.log(event);
        this.setState({
          [name]: value
        });

        // console.log(this);
      }

    handleAnswerChange = (questionKey, answer) => {

        console.log("changeCorrectState fired");
        this.props.changeAnswerCorrectState(questionKey, answer.md5, !answer.isCorrect, this.props.test_name);
    }

   handleIAmSureInAnswerChange = (questionKey, IAmSureInAnswer) => {

        console.log("IAmSureInAnswer fired");
        this.props.changeIAmSureInAnswerState(questionKey, IAmSureInAnswer, this.props.test_name);
    }

    render() {
        let filteredQuestions =  this.props.questions.filter((test)=>{
            return (!this.state.onlyUnanswered || !test[1].answers.filter((answer) => {return answer.isCorrect}).length > 0 )
        });

        let unansweredQuestions = this.props.questions.filter((test)=>{
            return (!test[1].answers.filter((answer) => {return answer.isCorrect}).length > 0 )
        });

        let totalCount = this.props.questions.length;
        let unansweredCount = unansweredQuestions.length;
        let iAmNotSureCount = this.props.questions.filter((q)=> !q[1].iAmSureInAnswer).length;
        return (
            <div>
                {this.props.fetch_status === "fetching" ? <div className="loading"><div></div></div> :

               
                    <div className='container-fluid'>
                        <h3>Loaded file <strong>{this.props.test_name}</strong></h3>
                        <br />
                        <br />
                        <Panel>
                            <Panel.Body>
                                <Row>
                                    <Col sm={6}>
                                        <Form inline>
                                            <Checkbox name="onlyUnanswered" onClick={this.handleInputChange} checked={this.onlyUnanswered}> Only unanswered</Checkbox>
                                        </Form>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="text-right">Total count: {totalCount}</div>
                                        <div className="text-right">Unanswered count: {unansweredCount}</div>
                                        <div className="text-right">I am not sure count: {iAmNotSureCount}</div>
                                    </Col>
                                </Row>  
                            </Panel.Body>
                        </Panel>
                        
                        <div>
                            {(this.state.onlyUnanswered ? unansweredQuestions : this.props.questions).map((test, index) => {
                                return <Question
                                            num={index + 1}
                                            testName={this.props.test_name}
                                            question={test[1].question}
                                            iAmSureInAnswer={test[1].iAmSureInAnswer}
                                            md5={test[0]}
                                            answers={test[1].answers}
                                            note={test[1].note}
                                            handleAnswerChange={this.handleAnswerChange}
                                            handleIAmSureInAnswerChange={this.handleIAmSureInAnswerChange}
                                            key={test[0]} />
                            })}
                        </div>

                    </div>}
            </div>
        );
    }
}

function mapStateToProps(state) {
    let questions = [];
    for (let question of state.default.questions.items) {
        questions.push(question);
    }

    return {
        fetch_status: state.default.questions.fetch_status,
        questions,
        test_name: state.default.questions.test_name
    }
}

export default connect(mapStateToProps, actionCreators)(Questions)
