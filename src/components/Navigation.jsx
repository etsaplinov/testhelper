import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Navbar, Nav, NavDropdown, MenuItem} from 'react-bootstrap';
import * as actionCreators from '../actions';

class Navigation extends Component {
    componentDidMount() {

        if(this.props.fetch_status!=='fetch_completed'){
            this.props.fetchTestsRequest();
        }
    }

    render(){
        return(
            <Navbar>
                <Nav>
                    <NavDropdown eventKey={1} title="Tests" id="basic-nav-dropdown">
                        {this.props.tests.map((testname, index)=>{
                            return(
                                <MenuItem key={index} onClick={()=>{this.props.fetchTestRequest(testname);}}>{testname}</MenuItem>
                            );
                        })}
                    </NavDropdown>
                    <NavDropdown eventKey={2} title="Sessions" id="basic-nav-dropdown">
                        {this.props.sessions.map((sessionname, index)=>{
                            return(
                                <MenuItem key={index} onClick={()=>{this.props.fetchTestRequest(sessionname);}}>{sessionname}</MenuItem>
                            );
                        })}
                    </NavDropdown>
                </Nav>
            </Navbar>
        );
    }
}

function mapStateToProps(state) {

    return {
        test_name: state.default.questions.test_name,
        fetch_status: state.default.tests.fetch_status,
        tests: state.default.tests.tests,
        sessions: state.default.tests.sessions
    }
}

export default connect(mapStateToProps, actionCreators)(Navigation);