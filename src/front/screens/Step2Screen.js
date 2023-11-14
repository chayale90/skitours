import React, { useEffect, useReducer, useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Steps from "../components/Steps";
import DatePicker from 'react-datepicker';
import useApp from "front/hooks/useApp";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeftSharp';
import InfoIcon from '@mui/icons-material/Info';
import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import { FormattedMessage, useIntl } from "react-intl";
import axios from "../../axios.js";

const reducer = function(state,action){
    switch (action.type) {
        case "ADD_ARRIVAL":
            return  {...state,arrivals:[...state.arrivals, action.payload]};
        case "SET_ARRIVALS":
            return {...state,arrivals:action.payload}
        case "REMOVE_ARRIVAL":{
            let currentArrivals = state.arrivals;
            if (action.payload > -1) {
                currentArrivals.splice(action.payload, 1);
            }
            return {...state,arrivals: currentArrivals}
        }
        case "ADD_DEPARTURE":
            return  {...state,departures:[...state.departures, action.payload]};
        case "SET_DEPARTURES":
            return {...state,departures:action.payload}
        case "REMOVE_DEPARTURE":
            let currentDepartures = state.departures;
            if (action.payload > -1) {
                currentDepartures.splice(action.payload, 1);
            }
            return {...state,departures:currentDepartures}
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
    const intl = useIntl();
    const navigate = useNavigate();
    const {target,arrivalDate,departureDate,addStepTwo,vehicles,arrivals,departures,templateTransfers,changeStepVisited,language} = useApp()
    const [state, dispatch] = useReducer(reducer,{
        arrivals: [],
        departures: [],
    });
    const [arrivalSaved, setArrivalSaved] = useState(false);
    const [departureSaved, setDepartureSaved] = useState(false);
    const [airports,setAirports] = useState([]);

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
    const [isHotelBlueBorder, setIsHotelBlueBorder] = useState(false);
    const [isflightNumbereBlueBorder, setIsflightNumbereBlueBorder] = useState(false);

    function handleFieldChange(e,index,type){
        if(e.target.name == 'vehicle'){
            let vehicle = vehicles.find((v)=>v.id == e.target.value);
            if(vehicle) dispatch({type:"SAVE_FIELD", payload:{type,index, value:vehicle,field:e.target.name}});
            return;
        }
        if (e.target.name === 'hotel') {
            setIsHotelBlueBorder(e.target.value.trim() !== '');
        }   
        if (e.target.name === 'flight_number') {
            setIsflightNumbereBlueBorder(e.target.value !== '');   
        }
        dispatch({type:"SAVE_FIELD", payload:{type,index, value:e.target.value,field:e.target.name}});
    }
  

 

    function handleRemoveTransfer(type,i){
        if(type === 'arrival'){
            dispatch({type: "REMOVE_ARRIVAL", payload: i});
        }else if(type === 'departure'){
            dispatch({type: "REMOVE_DEPARTURE", payload: i});
        }
    }

    function handleSkipStep(){
        changeStepVisited('step3');
        navigate('/step3');
    }

    function validateArrival(){
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
        return isValid;
    }

    function validateDeparture(){
        let isValid = true;
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
        return isValid;
    }

    function validator(){
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
        return isValid;
    }

    function handleDepartureSave(){
        if(!validateDeparture()) {
            alert("Please fill in all required fields");
            return;
        }
        let departures = state.departures.map((departure)=>{
            return {isAdded:true, ...departure};
        })
        addStepTwo({arrivals:null, departures})
        setDepartureSaved(true);
    }

    function handleArrivalSave(){
        if(!validateArrival()) {
            alert("Please fill in all required fields");
            return;
        }
        let arrivals = state.arrivals.map((arrival)=>{
            return {isAdded:true,...arrival};
        })
        addStepTwo({arrivals, departures: null})
        setArrivalSaved(true);
    }

    function handleNext(e){
        e.preventDefault();

        if(!validator()) {
            alert("Please fill in all required fields");
            return;
        }
        let arrivals = state.arrivals.map((arrival)=>{
            return {isAdded:true,...arrival};
        })
        let departures = state.departures.map((departure)=>{
            return {isAdded:true, ...departure};
        })
        addStepTwo({arrivals, departures})
        navigate('/step3');
        changeStepVisited('step3');

    }

    function handleBackStep(e){
        e.preventDefault();
        navigate('/');
    }

    useEffect(async ()=>{
        console.log("Target",target);
        if(!target) return;
        axios.get(`/api/airports/${target}`).then((res)=>{
            
            console.log("Airports",res.data.airports)
            setAirports(res.data.airports)
        })
    },[target])

    useEffect(async ()=>{
        dispatch({type:"SET_ARRIVALS",payload:arrivals});
        dispatch({type:"SET_DEPARTURES",payload:departures});
        dispatch({type:"SAVE_FIELD", payload:{type:'dept',index:0, value:vehicles[0],field:'vehicle'}})
        dispatch({type:"SAVE_FIELD", payload:{type:'arr',index:0, value:vehicles[0],field:'vehicle'}})
    },[]);
    return (<div className="container-sm step2">
        <Steps step2/>
        <div className="my-4 my-md-2 d-flex flex-column align-items-center">
            <div className="form-container-box small-container w-100">
                <div className="form-text-area py-md-4 px-md-5 position-relative">
                    <h1><FormattedMessage id="step2_arrival_desc_title"/></h1>
                    <p><FormattedMessage id="step2_arrival_desc_text"/></p>
                    <div className="floating-btns">
                        <Button className="floating-btn--back d-none d-sm-inline-flex" onClick={(e)=>handleBackStep(e)}><KeyboardArrowLeftIcon/><FormattedMessage id="btn_back_text"/></Button>
                        <Button className="floating-btn" onClick={()=>handleSkipStep()}><InfoIcon /><FormattedMessage id="btn_skip_text"/></Button>                    
                    </div>
                </div>
                <div className="py-md-4 px-md-5">
                    <Form>
                        {/* <h1 className="card--title"><FormattedMessage id="step2_arrivals_heading" /></h1> */}
                        {state.arrivals.map((arrival,i)=>{
                            return (
                                <div className="transfers" style={{position:'relative'}} key={i}>
                                    {i > 0 && <hr/>}
                                    {i > 0 && <CancelIcon className="cancel-btn" onClick={(e)=>handleRemoveTransfer('arrival',i)}/>}
                                <Row>
                                    <Col md={6} sm={12}>
                                        <Form.Group className="input-field-custom my-3 react-datepicker-ingroup">
                                            <Form.Label><img src="/images/user-icon-light.png" className="field-title-icon" alt="user-icon-light" /> <FormattedMessage id="step2_date_time_landing_title" /></Form.Label>
                                                <InputGroup className="input-field-custom">
                                                    <DatePicker
                                                        className={arrival.date.isValid ? 'py-3 date_picker form-control' : 'py-3 date_picker form-control is-invalid'}
                                                        dateFormat="EEEE d MMMM yyyy"
                                                        locale={language.locale}
                                                        minDate={new Date()}
                                                        placeholderText={intl.formatMessage({id:"step2_arrival_date_placeholder"})}
                                                        onChange={(date)=>handleDateChange(date,i,"arr")}
                                                        selected={arrival.date.value}
                                                    />
                                                    <div className="sep"></div>
                                                    <Form.Select aria-label="Time" name='time' className={`${!arrival.time.isValid && 'is-invalid'} py-3 text-center time-picker ${!arrival.time.value && 'empty'}`} onChange={(e)=>handleFieldChange(e,i,"arr")} value={arrival.time.value}  >
                                                        {timeSlots.map((slot,i)=>{
                                                            return (<option key={i} value={slot}>{slot}</option>)
                                                        })}
                                                    </Form.Select>
                                                    <img src="/images/time.png" className="time-icon" alt="time-icon" />
                                                </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} sm={12}>
                                        <Row className="align-items-end">
                                          <Col md={6} sm={12}>
                                            <Form.Group className="input-field-custom my-3" style={{'whiteSpace':'nowrap'}}>
                                                <Form.Label><img src="/images/flight.png" className="field-title-icon" /><FormattedMessage id="step2_airport_flight_number_heading" /></Form.Label>
                                                <Form.Select aria-label="Skipass" className={`py-3 ${!arrival.airport.value && 'empty'}`} name="airport" value={arrival.airport.value} onChange={(e)=>handleFieldChange(e,i,"arr")}>
                                                    <option value="" disabled>{intl.formatMessage({id:"step2_select_city_placeholder"})}</option>
                                                    {airports.length > 0 && airports?.map((item,i)=>{
                                                        return <option key={i} value={item?.name}>{intl.formatMessage({id:'airport.'+item?.name,defaultMessage:item?.name})}</option>
                                                    })}
                                                </Form.Select>
                                            </Form.Group>
                                            </Col>
                                            <Col md={6} sm={12}>
                                                <Form.Group className="input-field-custom my-3">
                                                    <Form.Control className={isflightNumbereBlueBorder?"blue-border py-3":"py-3"} name="flight_number" type="text" value={arrival.flight_number.value} placeholder={intl.formatMessage({id:"step2_flight_number_placeholder"})} onChange={(e)=>{  handleFieldChange(e,i,"arr")}} />
                                                </Form.Group>
                                          </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} sm={12}>
                                        <Row className="align-items-end">
                                            <Col md={6} sm={12}>
                                            <Form.Group className="input-field-custom my-3">
                                                <Form.Label><img src="/images/vehicle.png" className="field-title-icon" /><FormattedMessage id="step2_vehicle_type_title"/></Form.Label>
                                                <Form.Select aria-label="Vehicle" className={`${!arrival.vehicle.isValid && 'is-invalid'} py-3 ${!arrival.vehicle.value.id && 'empty'}`} value={arrival.vehicle.value.id} name="vehicle" onChange={(e)=>handleFieldChange(e,i,"arr")}>
                                                    <option value="" hidden disabled>Select Vehicle</option>
                                                    {vehicles.map((item)=>{
                                                        return <option key={item.id} value={item.id}>{item.name}</option>
                                                    })}
                                                </Form.Select>
                                            </Form.Group>
                                            </Col>
                                            <Col md={6} sm={12}>
                                                <Form.Group className="input-field-custom my-3">
                                                    <Form.Label><FormattedMessage id="step2_hotel_title" /></Form.Label>
                                                    <Form.Control className={isHotelBlueBorder ? 'blue-border py-3':'py-3'} type="text" placeholder={intl.formatMessage({id:'step2_hotel_placeholder'})} value={arrival.hotel.value} name="hotel" onChange={(e)=>handleFieldChange(e,i,"arr")} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md={6} sm={12}>
                                        <Row className="align-items-end">
                                            <Col md={6} sm={12}>
                                                <Form.Group controlId="date" className="input-field-custom my-3">
                                                    <Form.Label><img src="/images/user-icon-light.png" className="field-title-icon" /><FormattedMessage id="step2_number_of_people_title"/></Form.Label>
                                                    <Form.Select aria-label="Skipass" className={`${!arrival.number_of_people.isValid && 'is-invalid'} py-3 ${!arrival.number_of_people.value && 'empty'}`} name="number_of_people" value={arrival.number_of_people.value} onChange={(e)=>handleFieldChange(e,i,"arr")}>
                                                        <option value="" hidden disabled>{intl.formatMessage({id:'step2_number_of_people_placeholder'})}</option>
                                                        {arrival.vehicle.value && setOptions(arrival.vehicle.value.passengers)}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} sm={12}>
                                                <Form.Group controlId="complimentary-highchair" className="input-field-custom my-3">
                                                    <Form.Select aria-label="Skipass" className={`py-3 ${!arrival.number_of_child.value && 'empty'}`} name="number_of_child" value={arrival.number_of_child.value} onChange={(e)=>handleFieldChange(e,i,"arr")}>
                                                        <option value="" hidden disabled>{intl.formatMessage({id:'step2_number_of_child_placeholder'})}</option>
                                                        {arrival.vehicle.value && setOptions(arrival.vehicle.value.childs)}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md={12} sm={12}>
                                        <Row className="align-items-end">
                                        <Form.Group className="mb-3">
                                            <Form.Label>השאר הודעה לנהג</Form.Label>
                                            <Form.Control as="textarea" rows={5} className="driverMsg" />
                                        </Form.Group>
                                        </Row>
                                    </Col>
                                </Row>
                                {/* <Row>
                                    <Col md={12}>
                                        <Form.Group controlId="comment" className="input-field-custom my-3">
                                            <Form.Label><FormattedMessage id="step2_leave_message_title"/></Form.Label>
                                            <Form.Control as="textarea" rows="4" className="py-3" name='message' value={arrival.message.value} onChange={(e)=>handleFieldChange(e,i,"arr")} style={{'resize': 'none'}}></Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row> */}
                                </div>
                            )
                        })}
                    </Form>
                </div>
                <div className="d-flex justify-content-center px-md-5 pb-0 pb-sm-4 mt-3 mt-sm-0">
                    <div className="my-5 small-container w-100">
                        <Row>
                            <Col md={12} xs={12} className="btn--others-wrapper d-flex justify-content-sm-start mb-4">
                                <Button className="btn--save py-2 px-5 py-sm-3" onClick={handleArrivalSave}><FormattedMessage id="btn_save_text"/></Button>
                                <Button className="btn--add py-2 px-3 py-sm-3" onClick={handleArrivalAdd}><p><AddIcon/><FormattedMessage id="step2_add_arrival_btn" /></p></Button>
                            </Col>
                            {arrivalSaved && <div className="save--message">
                                    <p><CheckCircleIcon style={{fill:'#5CC3D2'}}/><span><FormattedMessage id="save--message" defaultMessage="הפרטים נשמרו בהצלחה"/></span></p>
                                </div>}
                        </Row>
                    </div>
                </div>
            </div>

            <div className="form-container-box small-container w-100" style={{marginTop:"3rem"}}>
                <div className="form-text-area py-md-4 px-md-5 position-relative">
                    <h1><FormattedMessage id="step2_departure_desc_title"/></h1>
                    <p><FormattedMessage id="step2_departure_desc_text"/></p>
                    <div className="floating-btns">
                        <Button className="floating-btn--back d-none d-sm-inline-flex" onClick={(e)=>handleBackStep(e)}><KeyboardArrowLeftIcon/><FormattedMessage id="btn_back_text"/></Button>
                        <Button className="floating-btn" onClick={()=>handleSkipStep()}><InfoIcon /><FormattedMessage id="btn_skip_text"/></Button>                    
                    </div>
                </div>
                <div className="py-md-4 px-md-5">
                <Form>
                    {/* <h1 className="card--title"><FormattedMessage id="step2_departures_heading" /></h1> */}
                        {state.departures.map((departure,i)=>{
                            return (
                                <div className="transfers" style={{position:'relative'}} key={i}>
                                    {i > 0 && <hr/>}
                                    {i > 0 && <CancelIcon className="cancel-btn" onClick={(e)=>handleRemoveTransfer('arrival',i)}/>}
                                <Row>
                                    <Col md={6} sm={12}>
                                        <Form.Group className="input-field-custom my-3 react-datepicker-ingroup">
                                            <Form.Label><img src="/images/user-icon-light.png" className="field-title-icon" alt="light-icon" /> <FormattedMessage id="step2_date_time_landing_title" /></Form.Label>
                                                <InputGroup className="input-field-custom">
                                                    <DatePicker
                                                        className={departure.date.isValid ? 'py-3 date_picker form-control' : 'py-3 date_picker form-control is-invalid'}
                                                        dateFormat="EEEE d MMMM yyyy"
                                                        minDate={new Date()}
                                                        locale={language.locale}
                                                        placeholderText={intl.formatMessage({id:"step2_departure_date_placeholder"})}
                                                        onChange={(date)=>handleDateChange(date,i,"dept")}
                                                        selected={departure.date.value}
                                                    />
                                                    <div className="sep"></div>
                                                    <Form.Select aria-label="Time" className={`${!departure.time.isValid && 'is-invalid'} py-3 text-center time-picker ${!departure.time.value && 'empty'}`} name="time" onChange={(e)=>handleFieldChange(e,i,"dept")} value={departure.time.value} >
                                                        {timeSlots.map((slot,i)=>{
                                                            return (<option key={i} value={slot}>{slot}</option>)
                                                        })}
                                                    </Form.Select>
                                                    <img src="/images/time.png" className="time-icon" alt="time"/>
                                                </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} sm={12}>
                                        <Row className="align-items-end">
                                          <Col md={6} sm={12}>
                                            <Form.Group className="input-field-custom my-3" style={{'whiteSpace':'nowrap'}}>
                                                <Form.Label><img src="/images/flight.png" className="field-title-icon" alt="flight" /><FormattedMessage id="step2_airport_flight_number_heading" /></Form.Label>
                                                <Form.Select aria-label="Skipass" className={`py-3 ${!departure.airport.value && 'empty'}`} name="airport" value={departure.airport.value} onChange={(e)=>handleFieldChange(e,i,"dept")}>
                                                    <option value="" disabled>{intl.formatMessage({id:"step2_select_city_placeholder"})}</option>
                                                    {airports.length > 0 && airports?.map((item,i)=>{
                                                        return <option key={i} value={item?.name}>{intl.formatMessage({id:'airport.'+item?.name,defaultMessage:item?.name})}</option>
                                                    })}
                                                </Form.Select>
                                            </Form.Group>
                                            </Col>
                                            <Col md={6} sm={12}>
                                                <Form.Group className="input-field-custom my-3">
                                                <Form.Control className="py-3"  type="text" placeholder={intl.formatMessage({id:"step2_flight_number_placeholder"})} value={departure.flight_number.value} name="flight_number" onChange={(e)=>handleFieldChange(e,i,"dept")} />
                                                </Form.Group>
                                          </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} sm={12}>
                                        <Row className="align-items-end">
                                            <Col md={6} sm={12}>
                                            <Form.Group className="input-field-custom my-3">
                                                <Form.Label><img src="/images/vehicle.png" className="field-title-icon" /><FormattedMessage id="step2_vehicle_type_title"/></Form.Label>
                                                <Form.Select aria-label="Vehicle" className={`${!departure.vehicle.isValid && 'is-invalid'} py-3 ${!departure.vehicle.value.id && 'empty'}`} value={departure.vehicle.value.id} name="vehicle" onChange={(e)=>handleFieldChange(e,i,"dept")}>
                                                    <option value="" hidden disabled>Select Vehicle</option>
                                                    {vehicles.map((item)=>{
                                                        return <option key={item.id} value={item.id}>{item.name}</option>
                                                    })}
                                                </Form.Select>
                                            </Form.Group>
                                            </Col>
                                            <Col md={6} sm={12}>
                                                <Form.Group className="input-field-custom my-3">
                                                    <Form.Label><FormattedMessage id="step2_hotel_title" /></Form.Label>
                                                <Form.Control className="py-3" type="text" placeholder={intl.formatMessage({id:'step2_hotel_placeholder'})} value={departure.hotel.value} name="hotel" onChange={(e)=>handleFieldChange(e,i,"dept")} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md={6} sm={12}>
                                        <Row className="align-items-end">
                                            <Col md={6} sm={12}>
                                                <Form.Group controlId="date" className="input-field-custom my-3">
                                                    <Form.Label><img src="/images/user-icon-light.png" className="field-title-icon" /><FormattedMessage id="step2_number_of_people_title"/></Form.Label>
                                                    <Form.Select aria-label="Skipass" className={`${!departure.number_of_people.isValid && 'is-invalid'} py-3 ${!departure.number_of_people.value && 'empty'}`}  name="number_of_people" value={departure.number_of_people.value} onChange={(e)=>handleFieldChange(e,i,"dept")}>
                                                        <option value="" hidden disabled>{intl.formatMessage({id:'step2_number_of_people_placeholder'})}</option>
                                                        {departure.vehicle.value && setOptions(departure.vehicle.value.passengers)}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} sm={12}>
                                                <Form.Group controlId="complimentary-highchair" className="input-field-custom my-3">
                                                    <Form.Select aria-label="Skipass" className={`py-3 ${!departure.number_of_child.value && 'empty'}`} name="number_of_child" value={departure.number_of_child.value} onChange={(e)=>handleFieldChange(e,i,"dept")}>
                                                        <option value="" hidden disabled>{intl.formatMessage({id:'step2_number_of_child_placeholder'})}</option>
                                                        {departure.vehicle.value && setOptions(departure.vehicle.value.childs)}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md={12} sm={12}>
                                        <Row className="align-items-end">
                                        <Form.Group className="mb-3">
                                            <Form.Label>השאר הודעה לנהג</Form.Label>
                                            <Form.Control as="textarea" rows={5} className="driverMsg" />
                                        </Form.Group>
                                        </Row>
                                    </Col>
                                </Row>
                                {/* <Row>
                                    <Col md={12}>
                                        <Form.Group controlId="comment" className="input-field-custom my-3">
                                            <Form.Label><FormattedMessage id="step2_leave_message_title"/></Form.Label>
                                            <Form.Control as="textarea" rows="4" className="py-3" name="message" value={departure.message.value} onChange={(e)=>handleFieldChange(e,i,"dept")} style={{'resize': 'none'}}></Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row> */}
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
                    <Col md={4} xs={12} className="btn--others-wrapper d-flex mb-4 justify-content-start">
                        <Button className="btn--save py-2 px-5 py-sm-3 px-sm-5 " onClick={handleDepartureSave}><FormattedMessage id="btn_save_text"/></Button>
                        <Button className="btn--add py-2 px-2 py-sm-3 px-sm-3" onClick={handleDepartureAdd}><p><AddIcon/><FormattedMessage id="step2_add_departure_btn" /></p></Button>
                    </Col>
                    <Col md={4} xs={12} className="btn--next-wrapper mb-4">
                        <Button className="btn--back py-2 px-3 py-sm-3 px-sm-3" onClick={handleBackStep}><KeyboardArrowLeftIcon style={{width: '1.4em',height:'1.4em'}}/> <FormattedMessage id="btn_back_text"/></Button>
                        <Button className="btn--next py-2 px-3 py-sm-3 px-sm-3" onClick={handleNext}><FormattedMessage id="btn_next_step_text"/>  <KeyboardArrowRightIcon style={{width:'1.4em',height:'1.4em'}}/></Button>
                    </Col>
                    {departureSaved && <div className="save--message endpage">
                        <p><CheckCircleIcon style={{fill:'#5CC3D2'}}/><span><FormattedMessage id="save--message" defaultMessage="הפרטים נשמרו בהצלחה"/></span></p>
                    </div>}
                </Row>
            </div>
        </div>
    </div>);
}