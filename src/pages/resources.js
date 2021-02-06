import React from 'react';
import '../styles/style.scss';
import Layout from '../components/layout';
import { Link } from 'gatsby';
import {resourcesData} from '../config-data/indexConfig';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const descriptionContent = 'Resources for car owners and drivers.';
const siteTitle = 'Car Owner\'s Resources';

const ResourcePage = () => (
  <Layout siteTitle={siteTitle} description={descriptionContent}>
     <div className="car-elements_area car-elements_reverse">
            <Container>
                <Row>
                    <Col>
                        <div className="section_title">
                            <h1>
                                <span>Resources for Car Owners and Drivers</span>
                            </h1>
                        </div>
                    </Col>
                </Row>
                <Row>
                    {
                        resourcesData.map((rsrc, index) => 
                            <Col lg={4} md={6} key={index}>
                                <div key={index} class="services_item mt-10">
                                    <div class="services-desc">
                                        <a href={rsrc.resourceUrl} target="_blank" rel="noopener noreferrer"><h3>{rsrc.resourceName}</h3></a>
                                        <p>{rsrc.resourceDescription}</p>
                                    </div>  
                                </div>
                            </Col>
                        )
                    }
                </Row>
            </Container>
        </div>

        <section className="call_to_action">
            <Container>
                <Row>
                    <Col md={7} xs={12}>
                        <div className="call_action_inner">
                            <div className="call_text">
                                <h3>Do You Want <span>To Partner With Us</span>?</h3>
                            </div>
                        </div>
                    </Col>
                    <Col md={5} xs={12}>
                        <div className="thin-button">
                            <Link to='/work-with-us'>read more about carmanuals.org</Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
  </Layout>
);

export default ResourcePage
