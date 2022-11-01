import React, {  useReducer } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import Steps from "../components/Steps";
import useApp from 'front/hooks/useApp';

const reducer = function(state,action){
    switch (action.type) {
        case 'FULLNAME_SAVE':
            return {...state, fullName:{...state.fullName, value: action.payload}};
        case 'FULLNAME_ISVALID':
            return {...state, fullName:{...state.fullName, isValid: action.payload}};
        case 'TARGET_SAVE':
            return {...state, target:{...state.target, value: action.payload}};
        case 'TARGET_ISVALID':
            return {...state, target:{...state.target, isValid: action.payload}};
        case 'ARRDATE_SAVE':
            return {...state, arrDate:{...state.arrDate, value: action.payload}};
        case 'ARRDATE_ISVALID':
            return {...state, arrDate:{...state.arrDate, isValid: action.payload}};
        case 'DEPTDATE_SAVE':
            return {...state, deptDate:{...state.deptDate, value: action.payload}};
        case 'DEPTDATE_ISVALID':
            return {...state, deptDate:{...state.deptDate, isValid: action.payload}};
        default:
            return state;
    }
}

export default function Step1Screen(){
    const navigate = useNavigate();
    const {addStepOne,fullName,target,departureDate,arrivalDate} = useApp();

    const [state, dispatch] = useReducer(reducer,{
        fullName: {
            value: fullName,
            isValid: true
        },
        target: {
            value: target,
            isValid: true
        },
        deptDate: {
            value: departureDate,
            isValid: true
        },
        arrDate: {
            value: arrivalDate,
            isValid: true
        }
    });

    function handleArrDateChange(date){
        dispatch({type:"ARRDATE_SAVE", payload:date});
        console.log("arr>>",date);
        let a = new Date(date).getTime();
        if(state.deptDate.value){
            let b = new Date(state.deptDate.value).getTime();
            console.log("a>>",a,"b>>",b);
            if(b < a){
                console.log("is greater than");
                dispatch({type:"DEPTDATE_SAVE",payload:date});
            }

        }
    }

    function handleNext(e){
        e.preventDefault();
        if(state.fullName.value == ''){
            dispatch({type:'FULLNAME_ISVALID', payload: false});
        }else{
            dispatch({type:'FULLNAME_ISVALID', payload: true});
        }
        if(state.target.value == ''){
            dispatch({type:"TARGET_ISVALID", payload: false});
        }else{
            dispatch({type:"TARGET_ISVALID", payload: true});
        }
        if(state.arrDate.value == null){
            dispatch({type:"ARRDATE_ISVALID", payload: false});
        }else{
            dispatch({type:"ARRDATE_ISVALID", payload: true});
        }
        if(state.deptDate.value == null){
            dispatch({type:"DEPTDATE_ISVALID", payload: false});
        }else{
            dispatch({type:"DEPTDATE_ISVALID", payload: true});
        }

        if(state.fullName.value !== '' && state.target.value !== '' && state.arrDate.value !== null && state.deptDate.value !== null){
            addStepOne({
                fullName: state.fullName.value,
                target: state.target.value,
                arrDate: state.arrDate.value,
                deptDate: state.deptDate.value
            });
            navigate('/step2');
        }

    }


    return (<div className="container-sm">
        <Steps step1/>
        <div className="my-4 my-md-2 d-flex justify-content-center">
            <div className="form-container-box small-container w-100">
                <div className="form-text-area py-md-4 px-md-5 position-relative">
                    <h1>Hello Surfer,</h1>
                    <p>Lorem Ipsum Dolor Sit Emmett, Constorer Edificing Alit Colores Monfred Adendum Silkoff, Emotional and Madagh Interchange and in their hearts Sulgak. Brait and lach zurek is blown, in the elements of Magmas.Shrachmadal who gritted.</p>
                    <Button className="floating-btn">Skip step <i className="fa fa-info-circle mx-1"></i></Button>
                </div>
                <div className="py-md-4 px-md-5">
                    <Form>
                        <Row>
                            <Col md={6} sm={12}>
                                <Form.Group controlId="userName" className="input-field-custom my-3">
                                    <Form.Label><img src="/images/user-icon.png" style={{'marginRight': '5px'}}/> Full Name</Form.Label>
                                    <Form.Control className={state.fullName.isValid ? 'py-3' : 'py-3 is-invalid'} type="text" value={state.fullName.value} placeholder="Doron Israel Shlomo" onChange={(e)=>dispatch({type:"FULLNAME_SAVE",payload:e.target.value})}/>
                                </Form.Group>
                            </Col>
                            <Col md={6} sm={12}>
                                <Form.Group controlId="userName" className="input-field-custom my-3">
                                    <Form.Label><img src="images/snow-mountain.png" style={{'marginRight': '5px'}} />Where do you fly to?</Form.Label>
                                    <Form.Control className={state.target.isValid ? 'py-3' : 'py-3 is-invalid'} value={state.target.value} type="text" placeholder="target" onChange={(e)=>dispatch({type:"TARGET_SAVE",payload:e.target.value})}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Row className="align-items-end">
                            <Col md={6} sm={12}>
                                <Form.Group controlId="date" className="input-field-custom my-3">
                                <Form.Label><img src="images/calander.png" style={{'marginRight':'5px'}}/> Arrival and departure times from the area</Form.Label>
                                <DatePicker
                                    className={state.arrDate.isValid ? 'py-3 date_picker form-control' : 'py-3 is-invalid date_picker form-control'}
                                    onChange={ handleArrDateChange }  
                                    dateFormat="EEEE d MMMM yyyy"  
                                    minDate={new Date()}
                                    placeholderText="Arrival-date"
                                    selected={state.arrDate.value}
                                />
                                </Form.Group>
                            </Col>
                            <Col md={6} sm={12}>
                                <Form.Group controlId="toDate" className="input-field-custom my-3">
                                <DatePicker
                                    className={state.deptDate.isValid ? 'py-3 date_picker form-control' : 'py-3 is-invalid date_picker form-control'}
                                    onChange={ (date) => dispatch({type:"DEPTDATE_SAVE",payload:date})}  
                                    dateFormat="EEEE d MMMM yyyy"  
                                    minDate={state.arrDate.value ? state.arrDate.value : new Date()}
                                    placeholderText="Departure-date"
                                    selected={state.deptDate.value}
                                />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </div>
        <div className="my-4 my-md-2 d-flex justify-content-center">
            <div className="my-5 small-container w-100">
                <Row className="d-flex justify-content-between">
                    <Col md={12} style={{'textAlign': 'right'}}>
                        <Link to="/step2">
                        <Button className="btn--next py-3 px-5" onClick={handleNext}>Next step <i className="fa fa-chevron-right"></i></Button>
                        </Link>
                    </Col>
                </Row>
            </div>
        </div>
    </div>);
}