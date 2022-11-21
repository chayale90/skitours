import useApp from "front/hooks/useApp";
import React, { useEffect, useReducer, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Steps from "../components/Steps";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const reducer = function(state,action){
    switch (action.type) {
        case "SET_LESSONS":
            return {...state,lessons:action.payload};
        case "SAVE_FIELD":{
            let isValid = action.payload.value != '';
            let lessons = state.lessons.map((lesson,i)=>{
                return i === action.payload.index ? {...lesson,[action.payload.field]:{isValid,value:action.payload.value}} : lesson;
            });
            return {...state,lessons};
        }
        case "SET_ISVALID":{
            let lessons = state.lessons.map((lesson,i)=>{
                return i === action.payload.index ? {...lesson,[action.payload.field]:{...lesson[action.payload.field],isValid:action.payload.value}} : lesson;
            });
            return {...state,lessons};     
        }
        default:
            return {...state}
    }
}

export default function Step4Screen(){
    const navigate = useNavigate();
    const {templateLessons,lessons} = useApp();
    const [state,dispatch] = useReducer(reducer,{
        lessons:[]
    })
    const [lessonType, setLessonType] = useState('ski');
    const [trainingType, setTrainingType] = useState('group');
    const [ageGroup, setAgeGroup] = useState('adult');
    const handleLessonType = (e) => {
        setLessonType(e.target.value);
    }
    const handleTrainingType = (e) => {
        setTrainingType(e.target.value);
    }

    const handleAgeGroup = (e) => {
        setAgeGroup(e.target.value);
    }

    function handleFieldChange(e,index){
        let  data = e.target.value;
        dispatch({type:"SAVE_FIELD", payload:{index, value:data,field:e.target.name}});
    }

    useEffect(()=>{
        dispatch({type:"SET_LESSONS",payload:lessons});
    },[])

    return (<div className="container-sm">
        <Steps step4/>
        <div className="my-4 my-md-2 d-flex justify-content-center">
            <div className="form-container-box small-container w-100">
                <div className="form-text-area py-md-4 px-md-5 position-relative">
                    <h1>Equipment Hire,</h1>
                    <p>Lorem Ipsum Dolor Sit Emmett, Constorer Edificing Alit Colores Monfred Adendum Silkoff, Emotional and Madagh Interchange and in their hearts Sulgak. Brait and lach zurek is blown, in the elements of Magmas.Shrachmadal who gritted.</p>
                    <Button className="floating-btn" onClick={()=>navigate('/step5')}>Skip step <i className="fa fa-info-circle mx-1"></i></Button>
                </div>
                <div className="py-md-4 px-md-5">
                    {state.lessons.map((lesson,i)=>{
                        return (
                        <Form key={i}>
                            <Row>
                                <Col md={7} sm={12}>
                                    <Row>
                                        <Col md={5} sm={12}>
                                            <Form.Group className="input-field-custom my-3">
                                            <Form.Label>Training type</Form.Label>
                                                <div className="btn-group d-flex" data-toggle="buttons">
                                                    <label className={lesson.training_type.value === 'group' ? 'btn active p-3' : 'btn p-3'}>
                                                        <input onClick={(e)=>{handleFieldChange(e,i)}} type="radio" value="group" name="training_type" id="option2" autoComplete="off" chacked={lesson.training_type.value === 'group'} />
                                                            Group
                                                    </label>
                                                    <label className={lesson.training_type.value === 'private' ? 'btn active p-3' : 'btn p-3'}>
                                                        <input onClick={(e)=>{handleFieldChange(e,i)}} type="radio" value="private" name="training_type" id="option2" autoComplete="off" chacked={lesson.training_type.value === 'private'}/>
                                                            Private
                                                    </label>
                                                </div>
                                            </Form.Group>
                                        </Col>
                                        <Col md={7} sm={12}>
                                            <Form.Group className="input-field-custom my-3">
                                                <Form.Label>Number of people</Form.Label>
                                                <Form.Select aria-label="Skipass" className="py-3">
                                                    <option value="1">Private lesson for one</option>
                                                    <option value="2">One</option>
                                                    <option value="3">two</option>
                                                    <option value="4">three</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={5} sm={12}>
                                    <Form.Group className="input-field-custom my-3">
                                        <Form.Label>Browsing level</Form.Label>
                                        <Form.Select aria-label="Skipass" className="py-3">
                                            <option value="1">Surfing level 1 - I didn't surf</option>
                                            <option value="2">One</option>
                                            <option value="3">two</option>
                                            <option value="4">three</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Row className="align-items-end">
                                <Col md={7} sm={12}>
                                    <Row>
                                        <Col md={5} sm={12}>
                                            <Form.Group controlId="date" className="input-field-custom my-3">
                                                <Form.Label>Full Name</Form.Label>
                                                <Form.Control className="py-3" type="text" placeholder="Doron Israel"/>
                                            </Form.Group>
                                        </Col>
                                        <Col md={7} sm={12}>
                                            <Form.Group className="input-field-custom my-3">
                                            <Form.Label>Lesson type</Form.Label>
                                                <div className="btn-group d-flex" data-toggle="buttons">
                                                    <label className={lessonType === 'ski' ? 'btn active p-3' : 'btn p-3'}>
                                                        <input onClick={(e)=>{handleLessonType(e)}} type="radio" value="ski" name="options" id="option2" autoComplete="off" chacked="true" />
                                                        Ski
                                                    </label>
                                                    <label className={lessonType === 'snowboarding' ? 'btn active p-3' : 'btn p-3'}>
                                                        <input onClick={(e)=>{handleLessonType(e)}} type="radio" value="snowboarding" name="options" id="option2" autoComplete="off" />
                                                        Snowboarding
                                                    </label>
                                                </div>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={5} sm={12}>
                                    <Form.Group className="input-field-custom my-3">
                                        <div className="btn-group d-flex" data-toggle="buttons">
                                            <label className={ageGroup === 'adult' ? 'btn active p-3' : 'btn p-3'}>
                                                <input onClick={(e)=>{handleAgeGroup(e)}} type="radio" value="adult" name="options" id="option2" autoComplete="off" chacked="true" />
                                                Adult
                                            </label>
                                            <label className={ageGroup === 'child' ? 'btn active p-3' : 'btn p-3'}>
                                                <input onClick={(e)=>{handleAgeGroup(e)}} type="radio" value="child" name="options" id="option2" autoComplete="off" />
                                                Child
                                            </label>
                                        </div>
                                    </Form.Group>
                                </Col>                            
                            </Row>
                            <hr className="d-md-none"/>
                            <Row className="align-items-end">
                                <Col md={5} sm={12}>
                                    <Form.Group className="input-field-custom my-3">
                                    <Form.Label>Training date</Form.Label>
                                    <div className="d-flex align-items-center">
                                    <Form.Check  type="checkbox" style={{'marginRight': '1rem'}} checked="true"/>
                                    <Form.Control className="py-3 active" type="date" />
                                    </div>
                                    </Form.Group>
                                </Col>
                                <Col md={5} sm={12}>
                                    <Row>
                                        <Col md={6} xs={6}>
                                            <Form.Group controlId="date" className="input-field-custom my-3">
                                                <Button className="btn--check py-3 px-3 w-100 active">Two-hour lesson</Button>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6} xs={6}>
                                            <Form.Group controlId="date" className="input-field-custom my-3">
                                                <Button className="btn--check py-3 px-3 w-100">Four-hour lesson</Button>
                                            </Form.Group>
    
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={2} sm={12}>
                                <Form.Group className="input-field-custom my-3">
                                    <Form.Select aria-label="Skipass" className="py-3 active">
                                        <option>09:00 - 11:00</option>
                                        <option value="1">11:00 - 13-00</option>
                                    </Form.Select>
                                </Form.Group>
                                </Col>
                            </Row>
                            <hr className="d-md-none"/>
                            <Row className="align-items-end">
                                <Col md={5} sm={12}>
                                    <Form.Group className="input-field-custom my-3">
                                    <div className="d-flex align-items-center">
                                    <Form.Check  type="checkbox" style={{'marginRight': '1rem'}}/>
                                    <Form.Control className="py-3" type="date" />
                                    </div>
                                    </Form.Group>
                                </Col>
                                <Col md={5} sm={12}>
                                    <Row>
                                        <Col md={6} xs={6}>
                                            <Form.Group controlId="date" className="input-field-custom my-3">
                                                <Button className="btn--check py-3 px-3 w-100">Two-hour lesson</Button>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6} xs={6}>
                                            <Form.Group controlId="date" className="input-field-custom my-3">
                                                <Button className="btn--check py-3 px-3 w-100">Four-hour lesson</Button>
                                            </Form.Group>
    
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={2} sm={12}>
                                <Form.Group className="input-field-custom my-3">
                                    <Form.Select aria-label="Skipass" className="py-3">
                                        <option>09:00 - 11:00</option>
                                        <option value="1">11:00 - 13-00</option>
                                    </Form.Select>
                                </Form.Group>
                                </Col>
                            </Row>
                            <hr className="d-md-none"/>
                            <Row className="align-items-end">
                                <Col md={5} sm={12}>
                                    <Form.Group className="input-field-custom my-3">
                                    <div className="d-flex align-items-center">
                                    <Form.Check  type="checkbox" style={{'marginRight': '1rem'}}/>
                                    <Form.Control className="py-3" type="date" />
                                    </div>
                                    </Form.Group>
                                </Col>
                                <Col md={5} sm={12}>
                                    <Row>
                                        <Col md={6} xs={6}>
                                            <Form.Group controlId="date" className="input-field-custom my-3">
                                                <Button className="btn--check py-3 px-3 w-100">Two-hour lesson</Button>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6} xs={6}>
                                            <Form.Group controlId="date" className="input-field-custom my-3">
                                                <Button className="btn--check py-3 px-3 w-100">Four-hour lesson</Button>
                                            </Form.Group>
    
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={2} sm={12}>
                                <Form.Group className="input-field-custom my-3">
                                    <Form.Select aria-label="Skipass" className="py-3">
                                        <option>09:00 - 11:00</option>
                                        <option value="1">11:00 - 13-00</option>
                                    </Form.Select>
                                </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                        )
                    })}
                </div>
            </div>
        </div>
        <div className="my-4 my-md-2 d-flex justify-content-center">
            <div className="my-5 small-container w-100">
                <Row className="d-flex justify-content-between">
                    <Col md={8} xs={6}>
                        <Button className="btn--save py-3 px-5 d-none d-md-inline-block">Save</Button>
                        <Button className="btn--add py-3 px-3">Add equipment <i className="fa fa-plus" style={{'marginLeft': '7px'}}></i></Button>
                    </Col>
                    <Col md={4} xs={6} style={{'textAlign': 'right'}}>
                        <Button className="btn--next py-3 px-5">Next step <KeyboardArrowRightIcon style={{width:'1.4em',height:'1.4em'}}/></Button>
                    </Col>
                </Row>
            </div>
        </div>
    </div>);
}