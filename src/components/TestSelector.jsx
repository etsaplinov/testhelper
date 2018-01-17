import React, {Component} from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import {connect} from 'react-redux';

import * as actionCreators from '../actions';


class TestSelector extends Component {
    componentDidMount() {

        if(this.props.fetch_status!=='fetch_completed'){
            this.props.fetchTestsRequest();
        }
    }


    render(){
       return(
           <div className="text-center">
                <Nav bsStyle="pills">
                    {this.props.tests.map((test, index)=>{
                      return (
                            <NavItem eventKey={index} key={index} onClick={()=>{this.props.fetchTestRequest(test);}}>
                                    {test}
                            </NavItem>
                      );
                    })}
                </Nav>
            </div>
        );
    }
}

function mapStateToProps(state) {

    return {
        fetch_status: state.default.tests.fetch_status,
        tests: state.default.tests.tests
    }
}

export default connect(mapStateToProps, actionCreators)(TestSelector);
