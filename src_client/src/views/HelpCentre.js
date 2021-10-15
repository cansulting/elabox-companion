import React, { Component } from 'react';
import { Button, Input, Card, CardBody, CardHeader, Col, Row, Form, FormGroup, Label, FormFeedback, Alert } from 'reactstrap';
import master from "../api/master"
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
      success: false,
      failure: false,
      isMobile: props.isMobile,


    }
  }


  render() {
    const { isMobile } = this.props;

    return (
      <Formik
        initialValues={{ email: '', name: '', problem: '' }}
        onSubmit={async (values) => {
          this.setState({ success: false, failure: false })
          try {
            const response = await master.submitForm(values)
            if (response.ok) {
              this.setState({ success: true })

            }
            else {
              this.setState({ failure: true })

            }
          } catch (err) {

            this.setState({ failure: true })

          }
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

          const { success, failure } = this.state

          return (
            <div id='main' style={{
              ...{
                paddingLeft: "18%",
                width: "100%",
                backgroundColor: "#1E1E26",
              },
              ...(isMobile && { paddingLeft: undefined }),
            }}
              className="animated fadeIn w3-container">
              {success && <Alert color="success">
                Success! An Elabox Support representative will reach out to you shortly.
                </Alert>}
              {failure && <Alert color="danger">
                Please check your network connection
            </Alert>}
              <Row >
                <Col>
                  <Card style={{ backgroundColor: '#272A3D', color: 'white', fontSize: '16px' }}>
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