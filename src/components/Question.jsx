import React from 'react';
import {Panel, ListGroup, ListGroupItem, Form, FormGroup, Checkbox, Grid, Row, Col, Label, Button} from 'react-bootstrap';

const Test = (props) => {
    let hasAnswer = false;
    let correctAnswers = props.answers.filter((a)=>{
        return a.isCorrect;
    }).length;
    hasAnswer = correctAnswers>0;

    var bsStyle = !hasAnswer ? 'danger' : props.iAmSureInAnswer ? 'success' : 'default';
     var iAmSureText = props.iAmSureInAnswer ? 'I\'m not sure': 'I\'m sure Sure';
     var iAmSureBtn = props.iAmSureInAnswer ? 'warning': 'success';

    return(
        <Panel bsStyle={bsStyle}>
            <Panel.Heading>
                <Panel.Title componentClass="h3">
                    <Grid fluid>
                        <Row>
                            <Col md={10}>{props.num}. {props.question}</Col>
                            <Col md={2} className="text-right">
                                <Button 
                                    bsStyle={iAmSureBtn} 
                                    bsSize="small" 
                                    onClick={()=>{ props.handleIAmSureInAnswerChange(props.md5,!props.iAmSureInAnswer); }}>
                                        {iAmSureText}
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
                </Panel.Title>
            </Panel.Heading>
			<Panel.Body>
                { props.note!=null?(<Label bsStyle="primary">{props.note}</Label> ):""}
                
                <ListGroup>
                    {props.answers.map((answer, index)=>{
                        return  <ListGroupItem  className={answer.isCorrect?'active':''} key={index}>
                                    <Grid fluid>
                                        <Row>
                                            <Col md={1}>{index+1}</Col>
                                            <Col md={10}>{answer.answer}</Col>
                                            <Col md={1}>
                                                <Form inline>
                                                    <FormGroup>
                                                        <Checkbox
                                                            type="checkbox"
                                                            checked={answer.isCorrect}
                                                            md5={answer.md5}
                                                            onChange={()=>{props.handleAnswerChange(props.md5,answer)}}
                                                        />
                                                    </FormGroup>
                                                </Form>
                                            </Col>
                                        </Row>
                                    </Grid>
                                    
                                    
                                </ListGroupItem>
                    })}
                </ListGroup>
            </Panel.Body>
		</Panel>
    );
}


export default Test;