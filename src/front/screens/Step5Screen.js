import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import Steps from "../components/Steps";
import useApp from "front/hooks/useApp";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeftSharp';
import InfoIcon from '@mui/icons-material/Info';
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { getDateArray, getDaysPrice } from "front/utils";
import { capitalize } from "lodash";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Step5Screen(){
    const {fullName,target,arrivalDate,departureDate,arrivals,departures,cities,equipments,equipmentTypes,lessons,lessonsData} = useApp();
    const navigate = useNavigate();

    useEffect(()=>{
        console.log("Lessons",lessons)
        arrivals.forEach((arrival)=>{
            console.log("Arrival",arrival.date.value,arrival.time.value);
        })
    },[])

    function getTargetCity(target){
        let targetCity = cities?.filter((city)=>{
            return city.id == target
        })
        return targetCity[0]?.name
    }

    function getLessonData(lesson){
        let selectedLesson = lessonsData?.filter((item)=>{
            return (item.name == lesson.number_of_people.value && item.lesson_type == lesson.training_type.value)
        })
        selectedLesson = selectedLesson[0];
        let days = lesson.dates.filter((item)=>item.isSelected);
        console.log("days",days);
        const lessonsPrice = getDaysPrice(days.length,selectedLesson?.days);
        return days.length +' day(s) '+ capitalize(lesson.training_type.value)+' lessons ' +'<br/>€ '+ lessonsPrice;
    }

    function getLessonTotalPrice(lesson){
        let selectedLesson = lessonsData?.filter((item)=>{
            if(lesson.training_type.value == 'group'){
                return (item.lesson_type == lesson.training_type.value)
            }else{
                return (item.name == lesson.number_of_people.value && item.lesson_type == lesson.training_type.value)
            }
        })
        selectedLesson = selectedLesson[0];
        let days = lesson.dates.filter((item)=>item.isSelected);
        const lessonsPrice = getDaysPrice(days.length,selectedLesson?.days);
        return '€ '+ lessonsPrice;
    }

    function getEquipmentData(equipment){
        let helmetPrice = 0;
        let equipmentPrice = 0;
        let isHelmetExist = (equipment.helmet?.value !== 'no' && equipment.helmet?.value !== 'free-child') ? true : false;
        let days = getDateArray(equipment.first_date.value,equipment.last_date.value);
        if(isHelmetExist){
            helmetPrice = getDaysPrice(days.length,equipment.helmet?.value?.days);
        }if(equipment.equipment_type?.value?.days){
            equipmentPrice = getDaysPrice(days.length, equipment.equipment_type?.value?.days)
        }
        return days.length + ' day(s) ' + capitalize(equipment.age_type?.value) 
            +' '+ equipment?.equipment_type?.value?.name + (isHelmetExist ? '<br/> Helmet: 1' : '<br/>Helmet: 0')
            + '<br/> € '+ (parseFloat(helmetPrice) + parseFloat(equipmentPrice))
    }

    function getSkipassData(equipment){
        if(!equipment.skipass.value) return '';
        let skipass = equipmentTypes?.filter((type)=>{
            if(type.equipment_type == 'skipass') return type;
        })
        console.log("Skipass",skipass)
        if(skipass.length === 0) return '';
        let skipassPrice = 0;
        let days = getDateArray(equipment.skipass_first_date.value,equipment.skipass_last_date.value);
        skipassPrice = getDaysPrice((days.length - 1), skipass[0]?.days);
        return (days.length - 1) + ' day(s) ' + '<br/>€ '+ skipassPrice

    }

    function getEquipmentTotalPrice(equipment){
        let helmetPrice = 0;
        let equipmentPrice = 0;
        let skipassPrice = 0;
        let isHelmetExist = (equipment.helmet?.value !== 'no' && equipment.helmet?.value !== 'free-child') ? true : false;
        let days = getDateArray(equipment.first_date.value,equipment.last_date.value);
        if(isHelmetExist){
            helmetPrice = getDaysPrice(days.length,equipment.helmet?.value?.days);
        }if(equipment.equipment_type?.value?.days){
            equipmentPrice = getDaysPrice(days.length, equipment.equipment_type?.value?.days)
        }
        if(equipment.skipass.value){
            let skipass = equipmentTypes?.filter((type)=>{
                if(type.equipment_type == 'skipass') return type;
            })
            if(skipass.length){
                let skipassDays = getDateArray(equipment.skipass_first_date.value,equipment.skipass_last_date.value);
                skipassPrice = getDaysPrice((skipassDays.length - 1), skipass[0]?.days);
            }
        }

        return '€ ' + (parseFloat(helmetPrice) + parseFloat(equipmentPrice) + parseFloat(skipassPrice))
    }

    function handleBackStep(e){
        e.preventDefault();
        navigate('/step4');
    }

    const downloadPrint = () => {
        const toPrint = document.getElementById('to-print');
        if (!toPrint)
            return;

        // html2canvas(toPrint).then(function(canvas) {
        //     const canvasData = canvas.toDataURL("image/png");
        //     const canvasWidth = canvas.width;
        //     const canvasHeight = canvas.height;
        //     const pdf = new jsPDF();
        //     pdf.addImage(canvasData, 'JPEG', canvasWidth, canvasHeight);
        //     pdf.save("order summary.pdf");
        //     // pdf.autoPrint();
        //     }
        // );
      
        const doc = new jsPDF();
        doc.html(`<html><body>${toPrint.innerHTML}</body></html>`,
        {callback: function(doc) {
            doc.save('order summary.pdf');
            // alert(doc);
            // doc.autoPrint();
        }});
        
    };

    const downloadPrint2 = () => {
        const toPrint = document.getElementById('to-print');
        if (!toPrint)
            return;
        const doc = window.open('', '_blank', "height=400,width=450");
        doc.document.write(toPrint.outerHTML);
        doc.document.write(`<style>${toPrint.style}</style>`);
        doc.document.close();
        doc.print();
    };

    const Intl = useIntl();
    return (<div className="container-sm">
        <Steps step5/>
        <div className="my-4 my-md-2 d-flex justify-content-center">
            <div className="form-container-box small-container w-100">
                <div className="form-text-area py-md-4 px-md-5 position-relative">
                    <h1>Order summary</h1>
                    <p>Lorem Ipsum Dolor Sit Emmett, Constorer Edificing Alit Colores Monfred Adendum Silkoff, Emotional and Madagh Interchange and in their hearts Sulgak. Brait and lach zurek is blown, in the elements of Magmas.Shrachmadal who gritted.</p>
                    <div className="floating-btns">
                        <Button className="floating-btn--back d-none d-sm-inline-flex" onClick={(e)=>handleBackStep(e)}><KeyboardArrowLeftIcon/><FormattedMessage id="btn_back_text"/></Button>
                        <Button className="floating-btn" onClick={downloadPrint2}><InfoIcon/>Download and print</Button>                   
                    </div>
                </div>
                <div className="py-md-4 px-md-5">
                    <Form>
                        <Row>
                            <Col md={3} sm={12}>
                                <Form.Group className="input-field-custom my-3">
                                    <Form.Control type="text" className="py-3" value={fullName} placeholder="Full Name" readOnly/>
                                </Form.Group>
                            </Col>
                            <Col md={3} sm={12}>
                                <Form.Group className="input-field-custom my-3">
                                    <Form.Control type="text" className="py-3" value={getTargetCity(target)} placeholder="Target" readOnly/>
                                </Form.Group>
                            </Col>
                            <Col md={3} sm={12}>
                                <Form.Group className="input-field-custom my-3">
                                    <Form.Control type="text" className="py-3" 
                                        value={Intl.formatDate(arrivalDate,{
                                            year: 'numeric',
                                            weekday: 'short',
                                            month:'long',
                                            day: '2-digit'
                                        })} 
                                        placeholder="Check-in date" readOnly/>
                                </Form.Group>
                            </Col>
                            <Col md={3} sm={12}>
                                <Form.Group className="input-field-custom my-3">
                                    <Form.Control type="text" className="py-3" value={Intl.formatDate(departureDate,{
                                            year: 'numeric',
                                            weekday: 'short',
                                            month:'long',
                                            day: '2-digit'
                                        })}  placeholder="Check-out date" readOnly/>
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        {(departures[0].isAdded || arrivals[0]?.isAdded) &&
                        <Row style={{marginBottom:'2rem'}}  id='to-print'>
                            <Col md={12}>
                                <Card className="main--card p-3">
                                    <Card.Title className="card--title">Transfers</Card.Title>
                                    { arrivals[0].vehicle.value &&
                                    (<><Card.Subtitle className="card--subtitle" style={{'marginTop': '1rem'}}>Arrival</Card.Subtitle>
                                    <div className="overflow-auto">
                                    <Table striped bordered hover className="my-3">
                                    <thead>
                                        <tr>
                                        <th>Date</th>
                                        <th>hour</th>
                                        <th>Vehicle Type</th>
                                        <th>Number of people</th>
                                        <th>Number of Childs</th>
                                        <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {arrivals.map((arrival)=>{
                                            return(<tr>
                                                <td>{Intl.formatDate(arrival.date?.value,{
                                                    year: 'numeric',
                                                    weekday: 'short',
                                                    month:'long',
                                                    day: '2-digit'
                                                })}</td>
                                                <td>{arrival.time?.value}</td>
                                                <td>{arrival.vehicle?.value?.name}</td>
                                                <td>{arrival.number_of_people?.value}</td>
                                                <td>{arrival.number_of_child?.value}</td>
                                                <td>EUR {arrival.vehicle?.value?.price}</td>
                                            </tr>)
                                        })}
                                    </tbody>
                                    </Table>
                                    </div></>)}
                                    {departures[0].vehicle.value && (<><Card.Subtitle className="card--subtitle" style={{'marginTop': '1rem'}}>Departure</Card.Subtitle>
                                    <div className="overflow-auto">
                                    <Table striped bordered hover className="my-3">
                                    <thead>
                                        <tr>
                                        <th>Date</th>
                                        <th>hour</th>
                                        <th>Vehicle Type</th>
                                        <th>Number of people</th>
                                        <th>Number of childs</th>
                                        <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {departures.map((departure)=>{
                                            return(<tr>
                                                <td>{Intl.formatDate(departure.date?.value,{
                                                    year: 'numeric',
                                                    weekday: 'short',
                                                    month:'long',
                                                    day: '2-digit'
                                                })}</td>
                                                <td>{departure.time?.value}</td>
                                                <td>{departure.vehicle?.value?.name}</td>
                                                <td>{departure.number_of_people?.value}</td>
                                                <td>{departure.number_of_child?.value}</td>
                                                <td>EUR {departure.vehicle?.value?.price}</td>
                                            </tr>)
                                        })}
                                    </tbody>
                                    </Table>
                                    </div></>)}
                                </Card>
                            </Col>
                            <Col md={5} sm={12}>
                            </Col>                            
                        </Row>}
                        {equipments[0].isAdded && <Row style={{marginBottom:'2rem'}}>
                            <Col md={12}>
                                <Card className="main--card p-3">
                                    <Card.Title className="card--title">Equipments</Card.Title>
                                    { arrivals[0].vehicle.value &&
                                    (<>
                                    <div className="overflow-auto">
                                    <Table striped bordered hover className="my-3">
                                    <thead>
                                        <tr style={{textAlign:'center'}}>
                                        <th>Name</th>
                                        <th>Equipment</th>
                                        <th>Skipass</th>
                                        <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {equipments.map((equipment)=>{
                                            return(<tr style={{textAlign:'center'}}>
                                                <td>{equipment.name?.value}</td>
                                                <td dangerouslySetInnerHTML={{__html: getEquipmentData(equipment)}} />
                                                <td dangerouslySetInnerHTML={{__html: getSkipassData(equipment)}}/>
                                                <td>{getEquipmentTotalPrice(equipment)}</td>
                                            </tr>)
                                        })}
                                    </tbody>
                                    </Table>
                                    </div></>)}
                                </Card>
                            </Col>
                            <Col md={5} sm={12}>
                            </Col>                            
                        </Row>}
                        {lessons[0].isAdded && <Row style={{marginBottom:'2rem'}}>
                            <Col md={12}>
                                <Card className="main--card p-3">
                                    <Card.Title className="card--title">Lessons</Card.Title>
                                    <div className="overflow-auto">
                                    <Table striped bordered hover className="my-3">
                                    <thead>
                                        <tr style={{textAlign:'center'}}>
                                        <th>Name</th>
                                        <th>Lessons</th>
                                        <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lessons.map((lesson)=>{
                                            return(<tr style={{textAlign:'center'}}>
                                                <td>{lesson.name?.value}</td>
                                                <td dangerouslySetInnerHTML={{__html: getLessonData(lesson)}} />
                                                <td>{getLessonTotalPrice(lesson)}</td>
                                            </tr>)
                                        })}
                                    </tbody>
                                    </Table>
                                    </div>
                                </Card>
                            </Col>
                            <Col md={5} sm={12}>
                            </Col>                            
                        </Row>}
                    </Form>
                </div>
            </div>
        </div>
        <div className="my-4 my-md-2 d-flex justify-content-center">
            <div className="my-5 small-container w-100">
                <Row className="d-flex justify-content-between">
                    <Col md={8} xs={6} className="btn--others-wrapper">
                        <Button className="btn--save py-3 px-5 d-none d-md-inline-block">Save</Button>
                    </Col>
                    <Col md={4} xs={6} className="btn--next-wrapper">
                        <Button className="btn--back py-3 px-3" onClick={handleBackStep}><KeyboardArrowLeftIcon style={{width: '1.4em',height:'1.4em'}}/> <FormattedMessage id="btn_back_text"/></Button>
                        <Button className="btn--next py-3 px-3"><FormattedMessage id="btn_next_step_text"/>  <KeyboardArrowRightIcon style={{width:'1.4em',height:'1.4em'}}/></Button>
                    </Col>
                </Row>
            </div>
        </div>
    </div>);
}