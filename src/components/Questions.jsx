import React, {Component} from 'react';
import {connect} from 'react-redux';

import Question from './Question';

import * as actionCreators from '../actions';

class Questions extends Component {
    componentDidMount() {

        if(this.props.fetch_status!=='fetch_completed'){
            this.props.fetchTestRequest(this.props.test_name);
        }
    }

    handleAnswerChange = (questionKey, answer) =>{

        console.log("changeCorrectState fired");
         this.props.changeAnswerCorrectState(questionKey, answer.md5, !answer.isCorrect);
    }

    handleIAmSureInAnswerChange = (questionKey, IAmSureInAnswer) =>{

        console.log("IAmSureInAnswer fired");
         this.props.changeIAmSureInAnswerState(questionKey, IAmSureInAnswer);
    }

    render() {
        return (
            <div>
                {this.props.fetch_status === "fetching" ? <div className="loading"><div></div></div> :
                <div  className='container-fluid'> 
                    <h3>Loaded file <strong>{this.props.test_name}</strong></h3>
                    <br />
                    <br />
                    <div>
                        {this.props.questions.map((test, index)=>{
                            return <Question 
                                        num={index+1}
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
        test_name:state.default.questions.test_name
    }
}

export default connect(mapStateToProps, actionCreators)(Questions)
