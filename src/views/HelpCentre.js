import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, Input, ModalHeader, Badge, Line, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table, Form, FormGroup, Label, FormText, FormFeedback } from 'reactstrap';
import Widget05 from './widgets/Widget05';

import master from "../api/master"
import axios from "axios";
import { Formik } from 'formik'
import * as Yup from 'yup';




const Schema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required'),
  email: Yup.string()
    .email("Invalid Email")
    .required('Email is required'),
  problem: Yup.string()
    .required('Required'),

});


class HelpCentre extends Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }


  render() {
    return (
      <Formik
        initialValues={{ email: '', name: '', problem: '' }}
        onSubmit={async (values) => {
          console.log(values)
          console.log(await master.submitForm(values))

        }}
        validationSchema={Schema}
        render={({
          values,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
          errors,
          isValid,
          isSubmitting
        }) => {

          // console.log("Palne", values, touched, errors)
          return (
            <div id='main' style={{ paddingLeft: '18%', height: '100%', width: '100%', backgroundColor: '#1E1E26' }} className="animated fadeIn w3-container">
              <Row >
                <Col>
                  <Card style={{ backgroundColor: '#272A3D', color: 'white', fontSize: '16px', marginTop: '40px' }}>
                    <CardHeader><center>Need Help or Assistance?</center></CardHeader>
                    <CardBody>
                      <center>Fill in the details below the Elabox Support Team will reach out to you as soon as possible.</center>
                      <br />
                      <Form>
                        <Row><Col>
                          <FormGroup>
                            <Label for="name">Full Name</Label>
                            <Input type="text" name="name" id="name" placeholder="John Doe" onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.name}
                              invalid={errors.name ? true : false}
                            />
                            {(errors.problem ? true : false) && <FormFeedback>{errors.problem}</FormFeedback>
                            }

                          </FormGroup>
                        </Col>
                          <Col>
                            <FormGroup>
                              <Label for="email">Email</Label>
                              <Input type="email" name="email" id="email" placeholder="john@doe.com"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                invalid={errors.email ? true : false}


                              />
                              {(errors.email ? true : false) && <FormFeedback>{errors.email}</FormFeedback>
                              }
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row><Col>
                          <FormGroup>
                            <Label for="problem">Problem</Label>
                            <Input type="textarea" name="problem" id="problem" placeholder="Describe your problem"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.problem}
                              invalid={errors.problem ? true : false}

                            />
                            {(errors.problem ? true : false) && <FormFeedback>{errors.problem}</FormFeedback>
                            }
                          </FormGroup>
                        </Col></Row>
                        <Row>
                          <Col>
                            <Button color="primary" size="lg" type="submit" onClick={handleSubmit}>Submit</Button>
                          </Col>

                        </Row>

                      </Form>
                    </CardBody>

                  </Card>
                </Col>
              </Row>
            </div>

          )
        }} />



    );
  }
}

export default HelpCentre;