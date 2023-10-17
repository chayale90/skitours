import React, { useEffect, useReducer, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Steps from "../components/Steps";
import DatePicker from 'react-datepicker';
import useApp from "front/hooks/useApp";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeftSharp';
import { FormattedMessage,useIntl } from "react-intl";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import CancelIcon from "@mui/icons-material/Cancel";
import { getDateArray } from "front/utils";
import Swal from "sweetalert2";

const reducer = function(state,action){
    switch (action.type) {
        case "SET_EQUIPMENTS":
            return {...state, equipments: action.payload};
        case "ADD_EQUIPMENT":
            return {...state, equipments:[...state.equipments,action.payload]};
        case "REMOVE_EQUIPMENT":{
            let currentEquipments = state.equipments;
            if (action.payload > -1) {
                currentEquipments.splice(action.payload, 1);
            }
            return { ...state,equipments: currentEquipments }
        }
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
    const intl = useIntl();
    const {equipments,templateEquipments,addStepThree,helmets,equipmentTypes,changeStepVisited,language} = useApp();
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
        console.log("Values",data);
        if(e.target.name === 'helmet'){
            if(e.target.value !== 'no' && e.target.value !== 'free-child'){
                data = equipmentTypes.find((h)=>h.id == e.target.value);
            }
        }
        if(e.target.name === 'equipment_type'){
            data = equipmentTypes.find((eq)=>eq.id == e.target.value);
        }
        if(e.target.name === 'skipass'){
            data = e.target.checked
        }
        dispatch({type:"SAVE_FIELD", payload:{index, value:data,field:e.target.name}});
    }

    function handleAddEquipment(){
        dispatch({type:"ADD_EQUIPMENT",payload:templateEquipments});
    }

    function handleRemoveEquipment(i){
        dispatch({type: "REMOVE_EQUIPMENT", payload: i});
    }

    function handleSkipStep(){
        changeStepVisited('step4');
        navigate('/step4');
    }

    function validateFields(){
        let isValid = true;
        state.equipments.forEach((item,index)=>{
            let nameIsValid = item.name.value ? true : false;  
            dispatch({type:"SET_ISVALID", payload:{index, value:nameIsValid,field:"name"}});

            let firstDateIsValid = item.first_date.value ? true : false;
            dispatch({type:"SET_ISVALID", payload:{index, value:firstDateIsValid,field:"first_date"}});

            let lastDateIsValid = item.last_date.value ? true : false;
            dispatch({type:"SET_ISVALID", payload:{index, value:lastDateIsValid,field:"last_date"}});

            let skipassFirstDateIsValid = item.skipass.value ? (item.skipass_first_date.value ? true : false) : true;
            dispatch({type:"SET_ISVALID", payload:{index, value:skipassFirstDateIsValid,field:"skipass_first_date"}});

            let skipassLastDateIsValid = item.skipass.value ? (item.skipass_last_date.value ? true : false) : true;
            dispatch({type:"SET_ISVALID", payload:{index, value:skipassLastDateIsValid,field:"skipass_last_date"}});

            let equipmentTypeIsValid = item.equipment_type.value ? true : false;
            dispatch({type:"SET_ISVALID", payload:{index, value:equipmentTypeIsValid,field:"equipment_type"}});

            let helmetIsValid = item.helmet.value ? true : false;
            dispatch({type:"SET_ISVALID", payload:{index, value:helmetIsValid,field:"helmet"}});

            let ageTypeIsValid = item.age_type.value ? true : false;
            dispatch({type:"SET_ISVALID", payload:{index, value:ageTypeIsValid,field:"age_type"}});

            if(!nameIsValid || !firstDateIsValid || !lastDateIsValid || !equipmentTypeIsValid || !helmetIsValid || !ageTypeIsValid || !skipassFirstDateIsValid || !skipassLastDateIsValid) isValid = false;
        });
        return isValid;
    }

    function handleSaveEquipment(e){
        e.preventDefault();
        const isValid = validateFields();
        if(!isValid) {
            alert("Please fill in all required fields");
            return;
        }
        Swal.fire({
            icon:'success',
            iconColor: '#2B4159',
            title: 'Saved!',
            text: "Form is saved",
            confirmButtonText: 'Ok',
            confirmButtonColor: '#2B4159',
        })
    }

    function handleNext(e){
        e.preventDefault();
        const isValid = validateFields();
        if(!isValid) {
            alert("Please fill in all required fields");
            return;
        }
        let equipments = state.equipments.map((equipment)=>{
            return {isAdded:true,...equipment}
        })
        addStepThree({equipments})
        navigate('/step4');
        changeStepVisited('step4');
    }

    function handleBackStep(e){
        e.preventDefault();
        navigate('/step2');
    }

    useEffect(()=>{
        dispatch({type:"SET_EQUIPMENTS",payload:equipments});
    },[]);
    return (<div className="container-sm">
        <Steps step3/>
        <div className="my-4 my-md-2 d-flex justify-content-center">
            <div className="form-container-box small-container w-100">
                <div className="form-text-area py-md-4 px-md-5 position-relative">
                    <h1><FormattedMessage id="step3_desc_title"/></h1>
                    <p><FormattedMessage id="step3_desc_text"/></p>
                    <div className="floating-btns">
                        <Button className="floating-btn--back d-none d-sm-inline-flex" onClick={(e)=>handleBackStep(e)}><KeyboardArrowLeftIcon/><FormattedMessage id="btn_back_text"/></Button>
                        <Button className="floating-btn" onClick={()=>handleSkipStep()}><InfoIcon/><FormattedMessage id="btn_skip_text"/></Button>                    
                    </div>
                </div>
                <div className="py-md-4 px-md-5">
                    {state.equipments.map((equipment,i)=>{
                        return (

                            <Form key={i} style={{position:'relative'}}>
                                {i != 0 && <hr/>}
                                {i > 0 && <CancelIcon className="cancel-btn" onClick={(e)=>handleRemoveEquipment(i)}/>}
                            <Row>
                                <Col md={6} sm={12}>
                                    <Form.Group controlId="userName" className="input-field-custom input-field-name my-3 position-relative">
                                        <Form.Label className="d-md-none">Full Name</Form.Label>
                                        <Form.Control name="name" onChange={(e)=>handleFieldChange(e,i)} type="text"
                                        value={equipment.name.value}
                                        className={equipment.name.isValid ? 'py-3' : 'py-3 is-invalid'} placeholder={intl.formatMessage({id:"step3_name_placeholder"})}/>
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
                                                    locale={language.locale}
                                                    placeholderText={intl.formatMessage({id:"step3_hire_date_first_placeholder"})}
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
                                                    locale={language.locale}
                                                    placeholderText={intl.formatMessage({id:"step3_hire_date_last_placeholder"})}
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
                                <Form.Label><img src="/images/calander.png" className="field-title-icon" /><FormattedMessage id="step3_equipment_type_title"/></Form.Label>
                                <div className="btn-group d-flex w-100" data-toggle="buttons">
                                    <label className={equipment.age_type.value === 'child' ? 'btn active p-3' : 'btn p-3'}>
                                        <input onChange={(e)=>{handleInputGroupValue(e,i)}} type="radio" value="child" name="options" id="option2" autoComplete="off" checked={equipment.age_type.value === 'child'} />
                                            <FormattedMessage id="step3_equipment_type_option_1"/>
                                    </label>
                                    <label className={equipment.age_type.value === 'adult' ? 'btn active p-3' : 'btn p-3'}>
                                        <input onChange={(e)=>{handleInputGroupValue(e,i)}} type="radio" value="adult" name="options" id="option2" autoComplete="off" checked={equipment.age_type.value === 'adult'}/>
                                        <FormattedMessage id="step3_equipment_type_option_2"/>
                                    </label>
                                    <label className={equipment.age_type.value === 'expert' ? 'btn active p-3' : 'btn p-3'}>
                                        <input onChange={(e)=>{handleInputGroupValue(e,i)}} type="radio" value="expert" name="options" id="option2" autoComplete="off" checked={equipment.age_type.value === 'expert'}/>
                                        <FormattedMessage id="step3_equipment_type_option_3"/>
                                    </label>
                                </div>
                                </Form.Group>
                                </Col>
                                <Col  md={4} ms={12}>
                                <Form.Group className="input-field-custom my-3">
                                    <Form.Label className="d-md-none">Skipass</Form.Label>
                                    <Form.Select aria-label="Skipass" className={`${!equipment.equipment_type.isValid && 'is-invalid'} py-3 ${!equipment.equipment_type?.value?.id && 'empty'}`} 
                                    value={equipment.equipment_type?.value?.id}
                                    name="equipment_type" onChange={(e)=>handleFieldChange(e,i)}>
                                        <option disabled selected={!equipment.equipment_type?.value?.id}>{intl.formatMessage({id:"step3_select_equipment_placeholder"})}</option>
                                        {equipmentTypes.map((e)=>{
                                            if(e.age_type !== equipment.age_type.value || e.equipment_type == 'helmet' || e.equipment_type == 'skipass') return;
                                            return <option key={e.id} value={e.id}>{e.name}</option>
                                        })}
                                    </Form.Select>
                                </Form.Group>
                                </Col>
                                <Col md={3} ms={12}>
                                <Form.Group className="input-field-custom my-3">
                                    <Form.Label><FormattedMessage id="step3_helmet_title"/></Form.Label>
                                    <Form.Select aria-label="Skipass" name="helmet" onChange={(e)=>handleFieldChange(e,i)}
                                    value={equipment.helmet.value.id}
                                    className={`${!equipment.helmet.isValid && 'is-invalid'} py-3 ${!equipment.helmet?.value && 'empty'}`}>
                                        <option value="" hidden>{intl.formatMessage({id:"step3_helmet_placeholder"})}</option>
                                        {equipmentTypes.map((h)=>{
                                            if(h.equipment_type !== 'helmet') return;
                                            return <option key={h.id} value={h.id}>{h.name}</option>
                                        })}
                                        <option value="no">No - helmet</option>
                                        <option value="free-child">Free child helmet</option>
                                    </Form.Select>
                                </Form.Group>
                                </Col>
                            </Row>

                            <Row className="align-items-end">
                                <Col md={12} sm={12}>
                                    <Form.Group className="input-field-custom my-3">
                                    <div className="d-flex align-items-center">
                                        <label className="custom-label">Skipass</label>
                                        <Form.Check label="Need a skipass?" type="checkbox" checked={equipment.skipass.value} name="skipass" onChange={(e)=>handleFieldChange(e,i)} className="checkbox-field-custom"/>
                                    </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                            {equipment.skipass.value && <Row>
                                        <Col md={6} sm={12}>
                                            <Form.Group controlId="date" className="input-field-custom my-3">
                                                <Form.Label className="d-md-none">Date</Form.Label>
                                                <DatePicker
                                                    className={equipment.skipass_first_date.isValid ? 'py-3 date_picker form-control' : 'py-3 date_picker form-control is-invalid'}
                                                    dateFormat="EEEE d MMMM yyyy" 
                                                    minDate={new Date()}
                                                    locale={language.locale}
                                                    placeholderText={intl.formatMessage({id:"step3_hire_date_first_placeholder"})}
                                                    name="skipass_first_date"
                                                    onChange={(date)=>handleDateChange(date,i,'skipass_first_date')}
                                                    selected={equipment.skipass_first_date.value}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6} sm={12}>
                                            <Form.Group controlId="toDate" className="input-field-custom my-3">
                                                <Form.Label className="d-md-none">To Date</Form.Label>
                                                <DatePicker
                                                    className={equipment.skipass_last_date.isValid ? 'py-3 date_picker form-control' : 'py-3 date_picker form-control is-invalid'}
                                                    dateFormat="EEEE d MMMM yyyy"  
                                                    locale={language.locale}
                                                    minDate={equipment.skipass_first_date.value ? equipment.skipass_first_date.value : new Date()}
                                                    placeholderText={intl.formatMessage({id:"step3_hire_date_last_placeholder"})}
                                                    name="skipass_last_date"
                                                    onChange={(date)=>handleDateChange(date,i,'skipass_last_date')}
                                                    selected={equipment.skipass_last_date.value}
                                                />
                                            </Form.Group>
                                        </Col>
                                        {equipment.skipass_first_date.value && equipment.skipass_last_date.value && <Col md={12} sm={12}>
                                            <Typography style={{color:'#D0D0D0'}}>{'You selected skipass for ' + (getDateArray(equipment.skipass_first_date.value,equipment.skipass_last_date.value).length - 1) + ' days.'}</Typography>
                                        </Col>}
                            </Row>}
                        </Form>
                        )
                    })}
                </div>
            </div>
        </div>
        <div className="my-4 my-md-2 d-flex justify-content-center">
            <div className="my-5 small-container w-100">
                <Row className="d-flex justify-content-between">
                    <Col md={8} xs={12} className="btn--others-wrapper d-flex mb-4">
                        <Button className="btn--save py-2 px-1 py-sm-3 px-sm-5 " onClick={handleSaveEquipment}><FormattedMessage id="btn_save_text"/></Button>
                        <Button className="btn--add py-2 px-1 py-sm-3 px-sm-3" onClick={handleAddEquipment}><FormattedMessage id="step3_add_equipment_btn"/> <i className="fa fa-plus" style={{'marginLeft': '7px'}}></i></Button>
                    </Col>
                    <Col md={4} xs={12} className="btn--next-wrapper d-flex mb-4">
                        <Button className="btn--back py-2 px-2 py-sm-3 px-sm-3" onClick={handleBackStep}><KeyboardArrowLeftIcon style={{width: '1.4em',height:'1.4em'}}/> <FormattedMessage id="btn_back_text"/></Button>
                        <Button className="btn--next py-2 px-2 py-sm-3 px-sm-3" onClick={handleNext}><FormattedMessage id="btn_next_step_text"/>  <KeyboardArrowRightIcon style={{width:'1.4em',height:'1.4em'}}/></Button>
                    </Col>
                </Row>
            </div>
        </div>
    </div>);
}