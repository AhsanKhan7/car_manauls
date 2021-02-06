import React from 'react';
import '../styles/style.scss';
import Layout from '../components/layout';
import {topCarBrandData} from '../config-data/indexConfig';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const descriptionContent = 'Find any car owner’s manual by brand. Download or view any car owner’s manual for free.';
const siteTitle = 'Car Owner\'s Manual PDF Search by Brand';
const BrandsPage = () => (

    <Layout siteTitle={siteTitle} description={descriptionContent}>
        <div className="brands mt-15 mb-50">
            <Container>
                <Row>
                    <Col>
                        <div className="section_title">
                            <h1>
                                <span>Brands</span>
                            </h1>
                        </div>
                    </Col>
                </Row>
                <Row className="mb-50 az-navigation-wrapper">
                    <Col>
                        <a href='#Acura'>A</a>
                        <a href='#Bentley'>B</a>
                        <a href='#Cadillac'>C</a>
                        <a href='#Dodge'>D</a>
                        <a href='#Ferrari'>F</a>
                        <a href='#Genesis'>G</a>
                        <a href='#Harley-Davidson'>H</a>
                        <a href='#Infiniti'>I</a>
                        <a href='#Jaguar'>J</a>
                        <a href='#Kia'>K</a>
                        <a href='#Lexus'>L</a>
                        <a href='#Maserati'>M</a>
                        <a href='#Nissan'>N</a>
                        <a href='#Oldsmobile'>O</a>
                        <a href='#Peugeot'>P</a>
                        <a href='#Ram'>R</a>
                        <a href='#Saab'>S</a>
                        <a href='#Tesla'>T</a>
                        <a href='#Volvo'>V</a>
                    </Col>
                </Row>
                <Row className="car-brands-wrapper">
                    {
                        topCarBrandData.map((cib, index) =>
                            <Col lg={3} md={4} key={index}>
                                <span id={cib.brandName}> &nbsp; </span>
                                <a href={cib.brandUrl} target="_blank" rel="noopener noreferrer">    
                                    <div className="single_product">
                                        <div className="product_name grid_name text-center">
                                            <h3>
                                                {cib.brandName}
                                            </h3>
                                        </div>
                                        <div className="product-thumb text-center">
                                            <img src={cib.logo} alt=""></img>
                                        </div>
                                        <div className="product_content grid_content">
                                            <div className="content_inner">
                                                <div className="product_footer d-flex align-items-center">
                                                    <p>
                                                        {cib.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </Col>
                        )
                    }
                </Row>
            </Container>
        </div>
    </Layout>
);

export default BrandsPage
