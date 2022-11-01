import React, { useEffect, useReducer, useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Steps from "../components/Steps";
import DatePicker from 'react-datepicker';
import useApp from "front/hooks/useApp";

const reducer = function(state,action){
    switch (action.type) {
        case "ADD_ARRIVAL":
            return  {...state,arrivals:[...state.arrivals, action.payload]};
        case "SET_ARRIVALS":
            return {...state,arrivals:action.payload}
        case "ADD_DEPARTURE":
            return  {...state,departures:[...state.departures, action.payload]};
        case "SET_DEPARTURES":
            return {...state,departures:action.payload}
        case "SAVE_FIELD":{
            let isValid = action.payload.value != '';
            if(action.payload.type === 'arr'){
                let arrivals = state.arrivals.map((arrival,i)=>{
                    return i === action.payload.index ? {...arrival,[action.payload.field]:{isValid,value:action.payload.value}} : arrival;
                });
                return {...state,arrivals};
            }else{
                let departures = state.departures.map((departure,i)=>{
                    return i === action.payload.index ? {...departure,[action.payload.field]:{isValid,value:action.payload.value}} : departure;
                });
                return {...state,departures};     
            }
        }
        case "SET_ISVALID":{
            if(action.payload.type === 'arr'){
                let arrivals = state.arrivals.map((arrival,i)=>{
                    return i === action.payload.index ? {...arrival,[action.payload.field]:{...arrival[action.payload.field],isValid:action.payload.value}} : arrival;
                });
                return {...state,arrivals};
            }else{
                let departures = state.departures.map((departure,i)=>{
                    return i === action.payload.index ? {...departure,[action.payload.field]:{...departure[action.payload.field],isValid:action.payload.value}} : departure;
                });
                return {...state,departures};     
            }
        }
        default:
            return state;
    }
}


export default function Step2Screen(){
    const navigate = useNavigate();
    const {arrivalDate,departureDate,addStepTwo,vehicles,airports,arrivals,departures,templateTransfers} = useApp()
    const [state, dispatch] = useReducer(reducer,{
        arrivals: [],
        departures: []
    });

    const timeSlots = [
        '11:00','11:15','11:30','11:45','12:00','12:15','12:30','12:45','13:00','13:15','13:30','13:45','14:00','14:15','14:30','14:45',
        '15:00','15:15','15:30','15:45','16:00','16:15','16:30','16:45','17:00','17:15','17:30','17:45','18:00','18:15','18:30','18:45',
        '19:00','19:15','19:30','19:45','20:00','20:15','20:30','20:45','21:00','21:15','21:30','21:45','22:00','22:15','22:30','22:45',
        '23:00','23:15','23:30','23:45','24:00','24:15','24:30','24:45','1:00','1:15','1:30','1:45','2:00','2:15','2:30','2:45',
        '3:00','3:15','3:30','3:45','4:00','4:15','4:30','4:45','5:00','5:15','5:30','5:45','6:00','6:15','6:30','6:45',
        '7:00','7:15','7:30','7:45','8:00','8:15','8:30','8:45','9:00','9:15','9:30','9:45','10:00','10:15','10:30','10:45',
    ];

    function setOptions(items){
        let text = [];
        for(let i = items.min; i <= items.max ; i++){
            text.push(<option value={i} key={i}>{i}</option>);
        }
        return text;
    }

    function handleArrivalAdd(e){
        let arrival = templateTransfers;
        arrival.date.value = arrivalDate;
        dispatch({type:"ADD_ARRIVAL",payload:arrival});
    }

    function handleDepartureAdd(e){
        let departure = templateTransfers;
        departure.date.value = departureDate;
        dispatch({type: "ADD_DEPARTURE", payload: departure});
    }

    function handleDateChange(date,index,type){
        dispatch({type:"SAVE_FIELD",payload:{type,index,value:date,field:"date"}});
    }

    function handleFieldChange(e,index,type){
        if(e.target.name == 'vehicle'){
            let vehicle = vehicles.find((v)=>v.id == e.target.value);
            if(vehicle) dispatch({type:"SAVE_FIELD", payload:{type,index, value:vehicle,field:e.target.name}});
            return;
        }
        dispatch({type:"SAVE_FIELD", payload:{type,index, value:e.target.value,field:e.target.name}});
    }

    function handleNext(e){
        e.preventDefault();
        let isValid = true;
        state.arrivals.forEach((item,index)=>{
            let dateIsValid = item.date.value ? true : false;  
            dispatch({type:"SET_ISVALID", payload:{type:"arr",index, value:dateIsValid,field:"date"}});

            let timeIsValid = item.time.value ? true : false;
            dispatch({type:"SET_ISVALID", payload:{type:"arr",index, value:timeIsValid,field:"time"}});

            let vehicleIsValid = item.vehicle.value ? true : false;
            dispatch({type:"SET_ISVALID", payload:{type:"arr",index, value:vehicleIsValid,field:"vehicle"}});

            let peopleIsValid = item.number_of_people.value ? true : false;
            dispatch({type:"SET_ISVALID", payload:{type:"arr",index, value:peopleIsValid,field:"number_of_people"}});

            if(item.date.value == '' || item.date.value == null || item.time.value == '' || item.time.value == null || item.vehicle.value == '' || item.vehicle.value == null || item.number_of_people.value == '' || item.number_of_people.value == null) isValid = false;
        });
        state.departures.forEach((item,index)=>{
            let dateIsValid = item.date.value ? true : false;  
            dispatch({type:"SET_ISVALID", payload:{type:"dept",index, value:dateIsValid,field:"date"}});

            let timeIsValid = item.time.value ? true : false;
            dispatch({type:"SET_ISVALID", payload:{type:"dept",index, value:timeIsValid,field:"time"}});

            let vehicleIsValid = item.vehicle.value ? true : false;
            dispatch({type:"SET_ISVALID", payload:{type:"dept",index, value:vehicleIsValid,field:"vehicle"}});

            let peopleIsValid = item.number_of_people.value ? true : false;
            dispatch({type:"SET_ISVALID", payload:{type:"dept",index, value:peopleIsValid,field:"number_of_people"}});

            if(item.date.value == '' || item.date.value == null || item.time.value == '' || item.time.value == null || item.vehicle.value == '' || item.vehicle.value == null || item.number_of_people.value == '' || item.number_of_people.value == null) isValid = false;
        });
        if(!isValid) {
            alert("Please fill in all required fields");
            return;
        }
        addStepTwo({arrivals: state.arrivals, departures: state.departures})
        navigate('/step3');

    }

    useEffect(async ()=>{
        dispatch({type:"SET_ARRIVALS",payload:arrivals});
        dispatch({type:"SET_DEPARTURES",payload:departures});
    },[]);
    return (<div className="container-sm">
        <Steps step2/>
        <div className="my-4 my-md-2 d-flex flex-column align-items-center">
            <div className="form-container-box small-container w-100">
                <div className="form-text-area py-md-4 px-md-5 position-relative">
                    <h1>Equipment Hire,</h1>
                    <p>Lorem Ipsum Dolor Sit Emmett, Constorer Edificing Alit Colores Monfred Adendum Silkoff, Emotional and Madagh Interchange and in their hearts Sulgak. Brait and lach zurek is blown, in the elements of Magmas.Shrachmadal who gritted.</p>
                    <Button className="floating-btn">Skip step <i className="fa fa-info-circle mx-1"></i></Button>
                </div>
                <div className="py-md-4 px-md-5">
                    <Form>
                        <h1 className="card--title">Arrivals</h1>
                        {state.arrivals.map((arrival,i)=>{
                            return (
                                <div className="transfers" key={i}>
                                    {i > 0 && <hr/>}
                                <Row>
                                    <Col md={6} sm={12}>
                                        <Form.Group className="input-field-custom my-3 react-datepicker-ingroup">
                                            <Form.Label><img src="/images/user-icon.png" style={{'marginRight': '5px'}} /> Date and time of landing</Form.Label>
                                                <InputGroup className="input-field-custom">
                                                    <DatePicker
                                                        className={arrival.date.isValid ? 'py-3 date_picker form-control' : 'py-3 date_picker form-control is-invalid'}
                                                        dateFormat="EEEE d MMMM yyyy"  
                                                        minDate={new Date()}
                                                        placeholderText="Arrival-date"
                                                        onChange={(date)=>handleDateChange(date,i,"arr")}
                                                        selected={arrival.date.value}
                                                    />
                                                    <Form.Select aria-label="Time" name='time' className={arrival.time.isValid ? "py-3 text-center" : "py-3 text-center is-invalid"} onChange={(e)=>handleFieldChange(e,i,"arr")} value={arrival.time.value}  style={{'borderTopRightRadius': '12px', 'borderBottomRightRadius': '12px'}}>
                                                        {timeSlots.map((slot,i)=>{
                                                            return (<option key={i} value={slot}>{slot}</option>)
                                                        })}
                                                    </Form.Select>
                                                    <img src="/images/time.png" className="time-icon" />
                                                </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} sm={12}>
                                        <Row className="align-items-end">
                                          <Col md={6} sm={12}>
                                            <Form.Group className="input-field-custom my-3" style={{'whiteSpace':'nowrap'}}>
                                                <Form.Label><img src="/images/flight.png" style={{'marginRight': '5px'}} /> Airport and flight number</Form.Label>
                                                <Form.Select aria-label="Skipass" className="py-3" name="airport" value={arrival.airport.value} onChange={(e)=>handleFieldChange(e,i,"arr")}>
                                                    <option value="" disabled>Select City</option>
                                                    {airports.length > 0 && airports.map((item,i)=>{
                                                        return <option key={item.id} value={item.name}>{item.name}</option>
                                                    })}
                                                </Form.Select>
                                            </Form.Group>
                                            </Col>
                                            <Col md={6} sm={12}>
                                            <Form.Group className="input-field-custom my-3">
                                                <Form.Control className="py-3" name="flight_number" type="text" value={arrival.flight_number.value} placeholder="Flight number" onChange={(e)=>handleFieldChange(e,i,"arr")} />
                                            </Form.Group>
                                          </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} sm={12}>
                                            <Form.Group className="input-field-custom my-3">
                                                <Form.Label><img src="/images/vehicle.png" style={{'marginRight': '5px'}} /> Vehicle Type</Form.Label>
                                                <Form.Select aria-label="Vehicle" className={arrival.vehicle.isValid ? "py-3" : "py-3 is-invalid"} value={arrival.vehicle.value.id} name="vehicle" onChange={(e)=>handleFieldChange(e,i,"arr")}>
                                                    <option value="" hidden disabled>Select Vehicle</option>
                                                    {vehicles.map((item)=>{
                                                        return <option key={item.id} value={item.id}>{item.name}</option>
                                                    })}
                                                </Form.Select>
                                            </Form.Group>
                                    </Col>
                                    <Col md={6} sm={12}>
                                        <Row className="align-items-end">
                                            <Col md={6} sm={12}>
                                                <Form.Group controlId="date" className="input-field-custom my-3">
                                                    <Form.Label><img src="/images/user-icon.png" style={{'marginRight': '5px'}} /> Number of people</Form.Label>
                                                    <Form.Select aria-label="Skipass" className={arrival.number_of_people.isValid ? "py-3" : "py-3 is-invalid"} name="number_of_people" value={arrival.number_of_people.value} onChange={(e)=>handleFieldChange(e,i,"arr")}>
                                                        <option value="" hidden disabled>Number of Passengers</option>
                                                        {arrival.vehicle.value && setOptions(arrival.vehicle.value.passengers)}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} sm={12}>
                                                <Form.Group controlId="complimentary-highchair" className="input-field-custom my-3">
                                                    <Form.Select aria-label="Skipass" className="py-3" name="number_of_child" value={arrival.number_of_child.value} onChange={(e)=>handleFieldChange(e,i,"arr")}>
                                                        <option value="" hidden disabled>Child Seats(Free)</option>
                                                        {arrival.vehicle.value && setOptions(arrival.vehicle.value.childs)}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <Form.Group controldId="comment" className="input-field-custom my-3">
                                            <Form.Label>Leave a message to the driver</Form.Label>
                                            <Form.Control as="textarea" rows="4" className="py-3" name='message' value={arrival.message.value} onChange={(e)=>handleFieldChange(e,i,"arr")} style={{'resize': 'none'}}></Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                </div>
                            )
                        })}
                    </Form>
                </div>
            </div>
            <div className="form-container-box small-container w-100" style={{marginTop:"3rem"}}>
                <div className="py-md-4 px-md-5">
                <Form>
                    <h1 className="card--title">Departures</h1>
                        {state.departures.map((departure,i)=>{
                            return (
                                <div className="transfers" key={i}>
                                    {i > 0 && <hr/>}
                                <Row>
                                    <Col md={6} sm={12}>
                                        <Form.Group className="input-field-custom my-3 react-datepicker-ingroup">
                                            <Form.Label><img src="/images/user-icon.png" style={{'marginRight': '5px'}} /> Date and time of landing</Form.Label>
                                                <InputGroup className="input-field-custom">
                                                    <DatePicker
                                                        className={departure.date.isValid ? 'py-3 date_picker form-control' : 'py-3 date_picker form-control is-invalid'}
                                                        dateFormat="EEEE d MMMM yyyy"  
                                                        minDate={new Date()}
                                                        placeholderText="Departure-date"
                                                        onChange={(date)=>handleDateChange(date,i,"dept")}
                                                        selected={departure.date.value}
                                                    />
                                                    <Form.Select aria-label="Time" className={departure.time.isValid ? "py-3 text-center" : "py-3 text-center is-invalid"} name="time" onChange={(e)=>handleFieldChange(e,i,"dept")} value={departure.time.value}  style={{'borderTopRightRadius': '12px', 'borderBottomRightRadius': '12px'}}>
                                                        {timeSlots.map((slot,i)=>{
                                                            return (<option key={i} value={slot}>{slot}</option>)
                                                        })}
                                                    </Form.Select>
                                                    <img src="/images/time.png" className="time-icon" />
                                                </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} sm={12}>
                                        <Row className="align-items-end">
                                          <Col md={6} sm={12}>
                                            <Form.Group className="input-field-custom my-3" style={{'whiteSpace':'nowrap'}}>
                                                <Form.Label><img src="/images/flight.png" style={{'marginRight': '5px'}} />Airport and flight number</Form.Label>
                                                <Form.Select aria-label="Skipass" className="py-3" name="airport" value={departure.airport.value} onChange={(e)=>handleFieldChange(e,i,"dept")}>
                                                    <option value="" disabled>Select City</option>
                                                    {airports.map((item,i)=>{
                                                        return <option key={item.id} value={item.name}>{item.name}</option>
                                                    })}
                                                </Form.Select>
                                            </Form.Group>
                                            </Col>
                                            <Col md={6} sm={12}>
                                            <Form.Group className="input-field-custom my-3">
                                                <Form.Control className="py-3"  type="text" placeholder="Flight number" value={departure.flight_number.value} name="flight_number" onChange={(e)=>handleFieldChange(e,i,"dept")} />
                                            </Form.Group>
                                          </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} sm={12}>
                                            <Form.Group className="input-field-custom my-3">
                                                <Form.Label><img src="/images/vehicle.png" style={{'marginRight': '5px'}} /> Vehicle Type</Form.Label>
                                                <Form.Select aria-label="Vehicle" className={departure.vehicle.isValid ? "py-3" : "py-3 is-invalid"} value={departure.vehicle.value.id} name="vehicle" onChange={(e)=>handleFieldChange(e,i,"dept")}>
                                                    <option value="" hidden disabled>Select Vehicle</option>
                                                    {vehicles.map((item)=>{
                                                        return <option key={item.id} value={item.id}>{item.name}</option>
                                                    })}
                                                </Form.Select>
                                            </Form.Group>
                                    </Col>
                                    <Col md={6} sm={12}>
                                        <Row className="align-items-end">
                                            <Col md={6} sm={12}>
                                                <Form.Group controlId="date" className="input-field-custom my-3">
                                                    <Form.Label><img src="/images/user-icon.png" style={{'marginRight': '5px'}} /> Number of people</Form.Label>
                                                    <Form.Select aria-label="Skipass" className={departure.number_of_people.isValid ? "py-3" : "py-3 is-invalid"}  name="number_of_people" value={departure.number_of_people.value} onChange={(e)=>handleFieldChange(e,i,"dept")}>
                                                        <option value="" hidden disabled>Number of Passengers</option>
                                                        {departure.vehicle.value && setOptions(departure.vehicle.value.passengers)}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} sm={12}>
                                                <Form.Group controlId="complimentary-highchair" className="input-field-custom my-3">
                                                    <Form.Select aria-label="Skipass" className="py-3" name="number_of_child" value={departure.number_of_child.value} onChange={(e)=>handleFieldChange(e,i,"dept")}>
                                                        <option value="" hidden disabled>Child Seats(Free)</option>
                                                        {departure.vehicle.value && setOptions(departure.vehicle.value.childs)}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <Form.Group controldId="comment" className="input-field-custom my-3">
                                            <Form.Label>Leave a message to the driver</Form.Label>
                                            <Form.Control as="textarea" rows="4" className="py-3" name="message" value={departure.message.value} onChange={(e)=>handleFieldChange(e,i,"dept")} style={{'resize': 'none'}}></Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                </div>
                            )
                        })}
                    </Form>   
                </div>
            </div>
        </div>
        <div className="my-4 my-md-2 d-flex justify-content-center">
            <div className="my-5 small-container w-100">
                <Row className="d-flex justify-content-between">
                    <Col md={8} xs={6}>
                        <Button className="btn--add py-3 px-3" onClick={handleArrivalAdd} style={{marginRight:"2rem"}}>Add Arrival <i className="fa fa-plus" style={{'marginLeft': '7px'}}></i></Button>
                        <Button className="btn--add py-3 px-3" onClick={handleDepartureAdd}>Add Departure <i className="fa fa-plus"></i></Button>
                    </Col>
                    <Col md={4} xs={6} style={{'textAlign': 'right'}}>
                        <Button className="btn--next py-3 px-5" onClick={handleNext}>Next step <i className="fa fa-chevron-right"></i></Button>
                    </Col>
                </Row>
            </div>
        </div>
    </div>);
}