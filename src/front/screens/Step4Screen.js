import useApp from "front/hooks/useApp";
import React, { useEffect, useReducer, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Steps from "../components/Steps";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { FormattedMessage, useIntl } from "react-intl";
import { getPeopleArray } from "front/utils";
import Swal from 'sweetalert2';

const reducer = function(state,action){
    switch (action.type) {
        case "SET_LESSONS":
            return {...state,lessons:action.payload};
        case "SET_PEOPLE":
            return {...state,people:action.payload};
        case "ADD_LESSON":
            return  {...state,lessons:[...state.lessons, action.payload]};
        case "SAVE_FIELD":{
            let isValid = action.payload.value != '';
            let lessons = state.lessons.map((lesson,i)=>{
                return i === action.payload.index ? {...lesson,[action.payload.field]:{isValid,value:action.payload.value}} : lesson;
            });
            return {...state,lessons};
        }
        case 'SET_DATE_HOUR': {
            let lessons = state.lessons.map((lesson,i)=>{
                if(action.payload.index === i){
                    let dates = lesson.dates.map((date)=>{
                        if(new Date(date.date).getTime() === new Date(action.payload.date).getTime()){
                            return {...date, hours: action.payload.value};
                        }else{
                            return date;
                        }
                    })
                    return {...lesson,dates};
                }else{
                    return lesson;
                }
            })
            return {...state,lessons};
        }
        case "SET_DATE_CHECK": {
            let lessons = state.lessons.map((lesson,i)=>{
                if(action.payload.index === i){
                    let dates = lesson.dates.map((date)=>{
                        if(new Date(date.date).getTime() === new Date(action.payload.date).getTime()){
                            console.log("Is selected",action.payload.value,new Date(date.date),new Date(action.payload.date))
                            return {...date, isSelected: action.payload.value};
                        }else{
                            return date;
                        }
                    })
                    return {...lesson, dates};
                }else{
                    return lesson;
                }
            })

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
    const Intl = useIntl();
    const {templateLessons,lessons,lessonsData,arrivalDate,departureDate,changeStepVisited} = useApp();
    const [state,dispatch] = useReducer(reducer,{
        lessons:[],
        people:[]
    })

    const handleLessonAdd = (e) => {
        e.preventDefault();
        dispatch({type:"ADD_LESSON",payload:templateLessons});
    }

    function handleFieldChange(e,index){
        let  data = e.target.value;
        dispatch({type:"SAVE_FIELD", payload:{index, value:data,field:e.target.name}});
    }

    function handleHourChange(value,index,date){
        dispatch({type:"SET_DATE_HOUR", payload:{index,value,date}});
    }

    function handleSkipStep(){
        changeStepVisited('step5');
        navigate('/step5');
    }

    function handleDateCheck(e,index,date){
        if(e.target.checked && new Date(arrivalDate).getTime() === new Date(date).getTime()){
            Swal.fire({
                icon:'warning',
                iconColor: '#2B4159',
                title: 'Are you sure?',
                text: "This is your arrival date",
                confirmButtonText: 'Ok',
                showCancelButton: true,
                cancelButtonColor: '#2B4159',
                confirmButtonColor: '#2B4159',
            }).then((result)=>{
                if(result.isConfirmed){
                    console.log("is confirmed")
                    dispatch({type:"SET_DATE_CHECK",  payload:{index,value:true,date}});
                }
            })
        }else if(e.target.checked && new Date(departureDate).getTime() === new Date(date).getTime()){
            Swal.fire({
                icon:'warning',
                iconColor: '#2B4159',
                title: 'Are you sure?',
                text: "This is your departure date",
                confirmButtonText: 'Ok',
                showCancelButton: true,
                cancelButtonColor: '#2B4159',
                confirmButtonColor: '#2B4159',
            }).then((result)=>{
                if(result.isConfirmed){
                    dispatch({type:"SET_DATE_CHECK",  payload:{index,value:true,date}});
                }
            })
        }else{
            dispatch({type:"SET_DATE_CHECK",  payload:{index,value:e.target.checked,date}});
        }
        
    }

    function handleNextStep(){
        console.log("Lessons>>",state.lessons);
    }

    useEffect(()=>{
        dispatch({type:"SET_PEOPLE",payload:getPeopleArray(lessonsData)});
        dispatch({type:"SET_LESSONS",payload:lessons});
    },[])

    return (<div className="container-sm">
        <Steps step4/>
        <div className="my-4 my-md-2 d-flex justify-content-center">
            <div className="form-container-box small-container w-100">
                <div className="form-text-area py-md-4 px-md-5 position-relative">
                    <h1><FormattedMessage id="step4_desc_title"/></h1>
                    <p><FormattedMessage id="step4_desc_text"/></p>
                    <Button className="floating-btn" onClick={()=>handleSkipStep()}><FormattedMessage id="btn_skip_text"/> <i className="fa fa-info-circle mx-1"></i></Button>
                </div>
                <div className="py-md-4 px-md-5">
                    {state.lessons.map((lesson,i)=>{
                        return (
                        <>
                        <Form key={i}>
                            <Row>
                                <Col md={7} sm={12}>
                                    <Row>
                                        <Col md={5} sm={12}>
                                            <Form.Group className="input-field-custom my-3">
                                            <Form.Label><FormattedMessage id="step4_training_type_title"/></Form.Label>
                                                <div className="btn-group d-flex" data-toggle="buttons">
                                                    <label className={lesson.training_type.value === 'group' ? 'btn active p-3' : 'btn p-3'}>
                                                        <input onClick={(e)=>{handleFieldChange(e,i)}} type="radio" value="group" name="training_type" id="option2" autoComplete="off" chacked={lesson.training_type.value === 'group'} />
                                                        <FormattedMessage id="step4_training_type_option_1"/>
                                                    </label>
                                                    <label className={lesson.training_type.value === 'private' ? 'btn active p-3' : 'btn p-3'}>
                                                        <input onClick={(e)=>{handleFieldChange(e,i)}} type="radio" value="private" name="training_type" id="option2" autoComplete="off" chacked={lesson.training_type.value === 'private'}/>
                                                        <FormattedMessage id="step4_training_type_option_2"/>
                                                    </label>
                                                </div>
                                            </Form.Group>
                                        </Col>
                                        <Col md={7} sm={12}>
                                            <Form.Group className="input-field-custom my-3">
                                                <Form.Label><FormattedMessage id="step4_number_people_title"/></Form.Label>
                                                <Form.Select aria-label="Skipass" name="number_of_people" onChange={(e) => {handleFieldChange(e,i)}} value={lesson.number_of_people.value} defaultValue={state.people[0]} className="py-3" disabled={lesson.training_type.value === 'group'}>
                                                    {state.people.map((item,i)=>{
                                                        return <option key={i} value={item}>{item}</option>
                                                    })}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={5} sm={12}>
                                    <Form.Group className="input-field-custom my-3">
                                        <Form.Label><FormattedMessage id="step4_browsing_level_title"/></Form.Label>
                                        <Form.Select aria-label="Skipass" name="skill_level" onChange={(e) => {handleFieldChange(e,i)}} className="py-3">
                                            <option value="0" selected disabled hidden>{Intl.formatMessage({id:'step4_browsing_level_placeholder'})}</option>
                                            <option style={{fontSize:'20px',fontWeight:'bold'}} disabled>Skiing</option>
                                            <option value="1">Surfing level 1 - I didn't surf</option>
                                            <option value="2">One</option>
                                            <option style={{fontSize:'20px',fontWeight:'bold'}} disabled>Snwoboarding</option>
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
                                                <Form.Label><FormattedMessage id="step4_full_name_title"/></Form.Label>
                                                <Form.Control className="py-3" type="text" name="name" onChange={(e) => {handleFieldChange(e,i)}} placeholder={Intl.formatMessage({id:"step4_full_name_placeholder"})}/>
                                            </Form.Group>
                                        </Col>
                                        <Col md={7} sm={12}>
                                            <Form.Group className="input-field-custom my-3">
                                            <Form.Label><FormattedMessage id="step4_lesson_type_title"/></Form.Label>
                                                <div className="btn-group d-flex" data-toggle="buttons">
                                                    <label className={lesson.lesson_type.value === 'ski' ? 'btn active p-3' : 'btn p-3'}>
                                                        <input onClick={(e)=>{handleFieldChange(e,i)}} type="radio" value="ski" name="lesson_type" id="option2" autoComplete="off" chacked={lesson.lesson_type.value === 'ski'} />
                                                        <FormattedMessage id="step4_lesson_type_option_1"/>
                                                    </label>
                                                    <label className={lesson.lesson_type.value === 'snowboarding' ? 'btn active p-3' : 'btn p-3'}>
                                                        <input onClick={(e)=>{handleFieldChange(e,i)}} type="radio" value="snowboarding" name="lesson_type" id="option2" autoComplete="off" chacked={lesson.lesson_type.value === 'snowboarding'}  />
                                                        <FormattedMessage id="step4_lesson_type_option_1"/>
                                                    </label>
                                                </div>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={5} sm={12}>
                                    <Form.Group className="input-field-custom my-3">
                                        <div className="btn-group d-flex" data-toggle="buttons">
                                            <label className={lesson.age_type.value === 'adult' ? 'btn active p-3' : 'btn p-3'}>
                                                <input onClick={(e)=>{handleFieldChange(e,i)}} type="radio" value="adult" name="age_type" id="option2" autoComplete="off" chacked={lesson.age_type.value === 'adult'} />
                                                <FormattedMessage id="step4_age_type_option_1"/>
                                            </label>
                                            <label className={lesson.age_type.value === 'child' ? 'btn active p-3' : 'btn p-3'}>
                                                <input onClick={(e)=>{handleFieldChange(e,i)}} type="radio" value="child" name="age_type" id="option2" autoComplete="off" chacked={lesson.age_type.value === 'child'} />
                                                <FormattedMessage id="step4_age_type_option_2"/>
                                            </label>
                                        </div>
                                    </Form.Group>
                                </Col>                            
                            </Row>
                            {lesson.dates.map((date,inner_index)=>{
                                return (
                                    <>
                                    <hr className="d-md-none"/>
                                    <Row className="align-items-end">
                                    <Col md={5} sm={12}>
                                        <Form.Group className="input-field-custom my-3">
                                        {inner_index === 0 && <Form.Label>Training date</Form.Label>}
                                        <div className="d-flex align-items-center">
                                        <Form.Check  type="checkbox" onChange={(e)=>{handleDateCheck(e,i,date.date)}} className="checkbox-field-custom" checked={date.isSelected}/>
                                        <Form.Control className={date.isSelected ? 'py-3 active date_picker' : 'py-3 date_picker'} disabled={!date.isSelected} type="text" style={{cursor:'auto'}} readOnly placeholder={Intl.formatDate(date.date,{
                                            year: 'numeric',
                                            weekday: 'short',
                                            month:'long',
                                            day: '2-digit'
                                        })} />
                                        </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={5} sm={12}>
                                        <Row>
                                            <Col md={6} xs={6}>
                                                <Form.Group controlId="date" className="input-field-custom my-3">
                                                    <Button className={date.isSelected ? (date.hours == '2' ? 'btn--check py-3 px-3 w-100 active' : 'btn--check py-3 px-3 w-100') : 'btn--check py-3 px-3 w-100'} disabled={!date.isSelected} onClick={(e)=>handleHourChange('2',i,date.date)}>Two-hour lesson</Button>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} xs={6}>
                                                <Form.Group controlId="date" className="input-field-custom my-3">
                                                    <Button className={date.isSelected ? (date.hours == '4' ? 'btn--check py-3 px-3 w-100 active' : 'btn--check py-3 px-3 w-100') : 'btn--check py-3 px-3 w-100'} disabled={!date.isSelected} onClick={(e)=>handleHourChange('4',i,date.date)}>Four-hour lesson</Button>
                                                </Form.Group>
        
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md={2} sm={12}>
                                    <Form.Group className="input-field-custom my-3">
                                        <Form.Select aria-label="Skipass" disabled={!date.isSelected} className={date.isSelected ? 'py-3 active' : 'py-3'}>
                                            <option>09:00 - 11:00</option>
                                            <option value="1">11:00 - 13-00</option>
                                        </Form.Select>
                                    </Form.Group>
                                    </Col>
                                </Row>
                                </>
                                )
                            })}
                        </Form>
                        {(state.lessons.length !== i + 1) && <hr style={{margin:'2rem 0'}}/>}
                        </>
                        )
                    })}
                </div>
            </div>
        </div>
        <div className="my-4 my-md-2 d-flex justify-content-center">
            <div className="my-5 small-container w-100">
                <Row className="d-flex justify-content-between">
                    <Col md={8} xs={6} className="btn--others-wrapper">
                        <Button className="btn--save py-3 px-5 d-none d-md-inline-block"><FormattedMessage id="btn_save_text"/></Button>
                        <Button className="btn--add py-3 px-3" onClick={handleLessonAdd}><FormattedMessage id="step4_add_lesson_btn"/> <i className="fa fa-plus" style={{'marginLeft': '7px'}}></i></Button>
                    </Col>
                    <Col md={4} xs={6} className="btn--next-wrapper">
                        <Button className="btn--next py-3 px-5" onClick={()=>handleNextStep()}><FormattedMessage id="btn_next_step_text"/> <KeyboardArrowRightIcon style={{width:'1.4em',height:'1.4em'}}/></Button>
                    </Col>
                </Row>
            </div>
        </div>
    </div>);
}