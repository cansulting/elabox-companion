import React, { Component } from 'react';
import { Button, Badge, Line, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import Widget05 from './widgets/Widget05';

class Settings extends Component {
  render() {
    return (
      <div id='main' style={{paddingLeft:'18%', height:'100%', width:'100%', backgroundColor:'#1E1E26'}} className="animated fadeIn w3-container">

        <Row>
          <Col xs="12" sm="6" lg="4">
          <Widget05 dataBox={() => ({ title: 'MainChain', variant: 'facebook', Restart: 'Restart', Resync: 'Re-sync' })} >
            </Widget05>
          </Col>

          <Col xs="12" sm="6" lg="4">
          <Widget05 dataBox={() => ({ title: 'DID',variant: 'facebook', Restart: 'Restart', Resync: 'Re-sync'})} >
            </Widget05>
          </Col>

          <Col xs="12" sm="6" lg="4">
          <Widget05 dataBox={() => ({ title: 'Carrier',variant: 'facebook', Restart: 'Relaunch', Resync: ''})} >
            </Widget05>
          </Col>
        </Row>


        <Row style={{marginTop: '20px'}}>
          <Col xs="12" sm="6" lg="4">
          <Widget05 dataBox={() => ({ title: 'Downlod wallet file', variant: 'facebook', Restart: 'Download', Resync: '' })} >
            </Widget05>
          </Col>
        </Row>

      </div>

    );
  }
}

export default Settings;