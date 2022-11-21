import React, { useEffect, useReducer, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Steps from "../components/Steps";
import DatePicker from 'react-datepicker';
import useApp from "front/hooks/useApp";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const reducer = function(state,action){
    switch (action.type) {
        case "SET_EQUIPMENTS":
            return {...state, equipments: action.payload};
        case "ADD_EQUIPMENT":
            return {...state, equipments:[...state.equipments,action.payload]};
        case "SAVE_NAME":
            return state;
        case "SAVE_FIELD":{
            let isValid = action.payload.value != '';
            let equipments = state.equipments.map((equipment,i)=>{
                return i === action.payload.index ? {...equipment,[action.payload.field]:{isValid,value:action.payload.value}} : equipment;
            });
            return {...state,equipments};
        }
        case "SET_ISVALID":{
            let equipments = state.equipments.map((equipment,i)=>{
                return i === action.payload.index ? {...equipment,[action.payload.field]:{...equipment[action.payload.field],isValid:action.payload.value}} : equipment;
            });
            return {...state,equipments};     
        }
        default:
            return state;
    }
}

export default function Step3Screen(){
    const navigate = useNavigate();
    const {equipments,templateEquipments,addStepThree,helmets,equipmentTypes} = useApp();
    const [state, dispatch] = useReducer(reducer,{
        equipments:[]
    });
    const handleInputGroupValue = (e,index) => {
        dispatch({type:"SAVE_FIELD", payload:{index, value:e.target.value,field:"age_type"}});
    }
    
    function handleDateChange(date,index,field){
        dispatch({type:"SAVE_FIELD", payload:{index, value:date,field}});
    }

    function handleFieldChange(e,index){
        let  data = e.target.value;
        if(e.target.name === 'helmet'){
            data = helmets.find((h)=>h.id == e.target.value);
        }
        if(e.target.name === 'equipment_type'){
            data = equipmentTypes.find((eq)=>eq.id == e.target.value);
        }
        dispatch({type:"SAVE_FIELD", payload:{index, value:data,field:e.target.name}});
    }

    function handleAddEquipment(){
        dispatch({type:"ADD_EQUIPMENT",payload:templateEquipments});
    }

    function handleNext(e){
        e.preventDefault();
        let isValid = false;
        state.equipments.forEach((item,index)=>{
            let nameIsValid = item.name.value ? true : false;  
            dispatch({type:"SET_ISVALID", payload:{index, value:nameIsValid,field:"name"}});

            let firstDateIsValid = item.first_date.value ? true : false;
            dispatch({type:"SET_ISVALID", payload:{index, value:firstDateIsValid,field:"first_date"}});

            let lastDateIsValid = item.last_date.value ? true : false;
            dispatch({type:"SET_ISVALID", payload:{index, value:lastDateIsValid,field:"last_date"}});

            let equipmentTypeIsValid = item.equipment_type.value ? true : false;
            dispatch({type:"SET_ISVALID", payload:{index, value:equipmentTypeIsValid,field:"equipment_type"}});

            let helmetIsValid = item.helmet.value ? true : false;
            dispatch({type:"SET_ISVALID", payload:{index, value:helmetIsValid,field:"helmet"}});

            let ageTypeIsValid = item.age_type.value ? true : false;
            dispatch({type:"SET_ISVALID", payload:{index, value:ageTypeIsValid,field:"age_type"}});

            if(nameIsValid && firstDateIsValid && lastDateIsValid && equipmentTypeIsValid && helmetIsValid && ageTypeIsValid) isValid = true;
        });
        if(!isValid) {
            alert("Please fill in all required fields");
            return;
        }
        addStepThree({equipments: state.equipments})
        navigate('/step4');
    }

    useEffect(()=>{
        dispatch({type:"SET_EQUIPMENTS",payload:equipments});
        console.log("equipments",equipments);
    },[]);
    return (<div className="container-sm">
        <Steps step3/>
        <div className="my-4 my-md-2 d-flex justify-content-center">
            <div className="form-container-box small-container w-100">
                <div className="form-text-area py-md-4 px-md-5 position-relative">
                    <h1>Equipment Hire,</h1>
                    <p>Lorem Ipsum Dolor Sit Emmett, Constorer Edificing Alit Colores Monfred Adendum Silkoff, Emotional and Madagh Interchange and in their hearts Sulgak. Brait and lach zurek is blown, in the elements of Magmas.Shrachmadal who gritted.</p>
                    <Button className="floating-btn" onClick={()=>navigate('/step4')}>Skip step <i className="fa fa-info-circle mx-1"></i></Button>
                </div>
                <div className="py-md-4 px-md-5">
                    {state.equipments.map((equipment,i)=>{
                        return (

                            <Form key={i}>
                                {i != 0 && <hr/>}
                            <Row>
                                <Col md={6} sm={12}>
                                    <Form.Group controlId="userName" className="input-field-custom input-field-name my-3 position-relative">
                                        <Form.Label className="d-md-none">Full Name</Form.Label>
                                        <Form.Control name="name" onChange={(e)=>handleFieldChange(e,i)} type="text"
                                        value={equipment.name.value}
                                        className={equipment.name.isValid ? 'py-3' : 'py-3 is-invalid'} placeholder="Doron Israel Shlomo"/>
                                        <img src="/images/user-icon.png" className="field-icon"/>
                                    </Form.Group>
                                </Col>
                                <Col md={6} sm={12}>
                                    <Row>
                                        <Col md={6} sm={12}>
                                            <Form.Group controlId="date" className="input-field-custom my-3">
                                                <Form.Label className="d-md-none">Date</Form.Label>
                                                <DatePicker
                                                    className={equipment.first_date.isValid ? 'py-3 date_picker form-control' : 'py-3 date_picker form-control is-invalid'}
                                                    dateFormat="EEEE d MMMM yyyy"  
                                                    minDate={new Date()}
                                                    placeholderText="First date of hire"
                                                    name="first_date"
                                                    onChange={(date)=>handleDateChange(date,i,'first_date')}
                                                    selected={equipment.first_date.value}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6} sm={12}>
                                            <Form.Group controlId="toDate" className="input-field-custom my-3">
                                                <Form.Label className="d-md-none">To Date</Form.Label>
                                                <DatePicker
                                                    className={equipment.last_date.isValid ? 'py-3 date_picker form-control' : 'py-3 date_picker form-control is-invalid'}
                                                    dateFormat="EEEE d MMMM yyyy"  
                                                    minDate={new Date()}
                                                    placeholderText="Last date of hire"
                                                    name="last_date"
                                                    onChange={(date)=>handleDateChange(date,i,'last_date')}
                                                    selected={equipment.last_date.value}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            
                            <Row className="align-items-end">
                                <Col md={5} ms={12}>
                                <Form.Group className="input-field-custom my-3">
                                <Form.Label><img src="/images/calander.png" style={{'marginRight':'5px'}}/>Equipment Type</Form.Label>
                                <div className="btn-group d-flex" data-toggle="buttons">
                                    <label className={equipment.age_type.value === 'child' ? 'btn active p-3' : 'btn p-3'}>
                                        <input onChange={(e)=>{handleInputGroupValue(e,i)}} type="radio" value="child" name="options" id="option2" autoComplete="off" checked={equipment.age_type.value === 'child'} />
                                            Child
                                    </label>
                                    <label className={equipment.age_type.value === 'adult' ? 'btn active p-3' : 'btn p-3'}>
                                        <input onChange={(e)=>{handleInputGroupValue(e,i)}} type="radio" value="adult" name="options" id="option2" autoComplete="off" checked={equipment.age_type.value === 'adult'}/>
                                            Adult
                                    </label>
                                    <label className={equipment.age_type.value === 'expert' ? 'btn active p-3' : 'btn p-3'}>
                                        <input onChange={(e)=>{handleInputGroupValue(e,i)}} type="radio" value="expert" name="options" id="option2" autoComplete="off" checked={equipment.age_type.value === 'expert'}/>
                                            Expert
                                    </label>
                                </div>
                                </Form.Group>
                                </Col>
                                <Col  md={4} ms={12}>
                                <Form.Group className="input-field-custom my-3">
                                    <Form.Label className="d-md-none">Skipass</Form.Label>
                                    <Form.Select aria-label="Skipass" className={equipment.equipment_type.isValid ? "py-3" : "py-3 is-invalid"} 
                                    value={equipment.equipment_type.value.id}
                                    name="equipment_type" onChange={(e)=>handleFieldChange(e,i)}>
                                        <option>Select equipment</option>
                                        {equipmentTypes.map((e)=>{
                                            return <option key={e.id} value={e.id}>{e.name}</option>
                                        })}
                                    </Form.Select>
                                </Form.Group>
                                </Col>
                                <Col md={3} ms={12}>
                                <Form.Group className="input-field-custom my-3">
                                    <Form.Label>Add a helmet?</Form.Label>
                                    <Form.Select aria-label="Skipass" name="helmet" onChange={(e)=>handleFieldChange(e,i)}
                                    value={equipment.helmet.value.id}
                                    className={equipment.helmet.isValid ? "py-3" : "py-3 is-invalid"}>
                                        <option value="" hidden>Helmet?</option>
                                        {helmets.map((h)=>{
                                            return <option key={h.id} value={h.id}>{h.name}</option>
                                        })}
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
                        <Button className="btn--add py-3 px-3" onClick={handleAddEquipment}>Add equipment <i className="fa fa-plus" style={{'marginLeft': '7px'}}></i></Button>
                    </Col>
                    <Col md={4} xs={6} style={{'textAlign': 'right'}}>
                        <Button className="btn--next py-3 px-5" onClick={handleNext}>Next step <KeyboardArrowRightIcon style={{width:'1.4em',height:'1.4em'}}/></Button>
                    </Col>
                </Row>
            </div>
        </div>
    </div>);
}