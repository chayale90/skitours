import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import Steps from "../components/Steps";
import useApp from "front/hooks/useApp";
import { useIntl } from "react-intl";

export default function Step5Screen(){
    const {fullName,target,arrivalDate,departureDate,arrivals,departures} = useApp();


    useEffect(()=>{
        arrivals.forEach((arrival)=>{
            console.log("Arrival",arrival.date.value,arrival.time.value);
        })
    },[])

    const Intl = useIntl();
    return (<div className="container-sm">
        <Steps step5/>
        <div className="my-4 my-md-2 d-flex justify-content-center">
            <div className="form-container-box small-container w-100">
                <div className="form-text-area py-md-4 px-md-5 position-relative">
                    <h1>Order summary</h1>
                    <p>Lorem Ipsum Dolor Sit Emmett, Constorer Edificing Alit Colores Monfred Adendum Silkoff, Emotional and Madagh Interchange and in their hearts Sulgak. Brait and lach zurek is blown, in the elements of Magmas.Shrachmadal who gritted.</p>
                    <Button className="floating-btn">Download and print <i className="fa fa-info-circle mx-1"></i></Button>
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
                                    <Form.Control type="text" className="py-3" value={target} placeholder="Target" readOnly/>
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
                        
                        {(departures[0].vehicle?.value != '' || arrivals[0]?.vehicle.value != '') &&
                        <Row>
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
                        <Button className="btn--next py-3 px-5">Next step <i className="fa fa-chevron-right"></i></Button>
                    </Col>
                </Row>
            </div>
        </div>
    </div>);
}