import React, { useState } from "react";
import { Button, Card, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import Steps from "../components/Steps";

export default function Step5Screen(){

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
                                    <Form.Control type="text" className="py-3" placeholder="Full Name" readOnly/>
                                </Form.Group>
                            </Col>
                            <Col md={3} sm={12}>
                                <Form.Group className="input-field-custom my-3">
                                    <Form.Control type="text" className="py-3" placeholder="Target" readOnly/>
                                </Form.Group>
                            </Col>
                            <Col md={3} sm={12}>
                                <Form.Group className="input-field-custom my-3">
                                    <Form.Control type="text" className="py-3" placeholder="Check-in date" readOnly/>
                                </Form.Group>
                            </Col>
                            <Col md={3} sm={12}>
                                <Form.Group className="input-field-custom my-3">
                                    <Form.Control type="text" className="py-3" placeholder="Check-out date" readOnly/>
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Row>
                            <Col md={12}>
                                <Card className="main--card p-3">
                                    <Card.Title className="card--title">Transfers</Card.Title>
                                    <Card.Subtitle className="card--subtitle" style={{'marginTop': '1rem'}}>Arrival</Card.Subtitle>
                                    <div className="overflow-auto">
                                    <Table striped bordered hover className="my-3">
                                    <thead>
                                        <tr>
                                        <th>Date</th>
                                        <th>hour</th>
                                        <th>Vehicle Type</th>
                                        <th>Number of people</th>
                                        <th>Highchair</th>
                                        <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                        <td>22/02/2022</td>
                                        <td>16:00</td>
                                        <td>Minibus 8-18</td>
                                        <td>12</td>
                                        <td>Yes</td>
                                        <td>850 NIS</td>
                                        </tr>
                                    </tbody>
                                    </Table>
                                    </div>
                                    <Card.Subtitle className="card--subtitle" style={{'marginTop': '1rem'}}>Departure</Card.Subtitle>
                                    <div className="overflow-auto">
                                    <Table striped bordered hover className="my-3">
                                    <thead>
                                        <tr>
                                        <th>Date</th>
                                        <th>hour</th>
                                        <th>Vehicle Type</th>
                                        <th>Number of people</th>
                                        <th>Highchair</th>
                                        <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                        <td>22/02/2022</td>
                                        <td>16:00</td>
                                        <td>Minibus 8-18</td>
                                        <td>12</td>
                                        <td>Yes</td>
                                        <td>850 NIS</td>
                                        </tr>
                                    </tbody>
                                    </Table>
                                    </div>
                                </Card>
                            </Col>
                            <Col md={5} sm={12}>
                            </Col>                            
                        </Row>
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