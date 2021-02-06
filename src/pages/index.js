import React, {useState} from 'react';
import Select from 'react-select';
import '../styles/style.scss';
import Layout from '../components/layout';
import {Link} from 'gatsby';
import {carYear, topCarBrandData} from '../config-data/indexConfig';
import indexbanner from '../img/bg/carmanuals-homepage.jpg';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {submitFormEmail} from '../backend/utils';

const IndexPage = () => {
    function composeSearchTerm(sMake, sModel, sYear) {
        const make = sMake ? sMake.value : '';
        const model = sModel ? sModel.value : '';

        const year = sYear ? sYear.value : '';
        setSearchTerm(`${make} ${model} ${year}`);
        console.log(`${make} ${model} ${year}`);
    }

    function yearChosen(year) {
        setSelectedYear(year);
        composeSearchTerm(selectedMake, selectedModel, year);
    }

    function modelChosen(model) {
        setSelectedModel(model);
        composeSearchTerm(selectedMake, model, selectedYear);
    }

    function makeChosen(make) {
        setSelectedModel(null);
        setSelectedYear(selectedYear);
        setSelectedMake(make);
        let models = topCarBrandData.filter(d => d.brandName === make.value).map(d => d.models);
        let mapArray = models ? models[0] : [];
        let map = mapArray.map(model => {return {label: model, value: model}});
        setCarModels(map);
        composeSearchTerm(make, null, null);
    }

    const carMakes = topCarBrandData.map(d => {return {label: d.brandName, value: d.brandName}});
    const [carModels, setCarModels] = useState(null);
    const [selectedMake, setSelectedMake] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formSuccess, setFormSuccess] = useState(null);
    const [formError, setFormError] = useState(null);
    const [formEmail, setFormEmail] = useState('');
    const [formSubject, setFormSubject] = useState('');
    const [formName, setFormName] = useState('');
    const [formMessage, setFormMessage] = useState('');

    const descriptionContent = 'Download or view any car owner’s manual for free. The world’s most complete and accurate database of PDF car owner\'s manuals.';
    const siteTitle = 'Car Owner\'s Manual PDF Database';

    function handleFormChange(e) {
        const {name, value} = e.target;
        const reason = 'Please make sure all fields are filled out properly.';
        if (value.length < 3) {
            setFormError({name, reason});
        } else {
            setFormError(null);
        }
        switch(name) {
            case 'email':
                setFormEmail(value);
                break;
            case 'subject':
                setFormSubject(value);
                break;
            case 'name':
                setFormName(value);
                break;
            case 'message':
                setFormMessage(value);
                break;
            default:
                break;
        }
    }

    function submitFormEmailWrapper(e) {
        e.preventDefault();
        if (!formSuccess && formEmail && formSubject && formName && formMessage) {
            setFormSuccess(true);
            submitFormEmail(formName, formEmail, formSubject, formMessage).then(_ => console.log(`submitted email values: ${formName}, ${formName}, ${formSubject}, ${formMessage}`));
        }
    }

    return (
        <Layout siteTitle={siteTitle} description={descriptionContent}>
            <section className="main-search-area mb-50 pb-50" style={{backgroundImage: `url(${indexbanner})`}}>
                <Container>
                    <Row>
                        <Col className="mb-4">
                            <div className="shipping_inner">
                                <h1 className="mb-2">Looking for a car manual?</h1>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3} xs={12} className="mb-3">
                            <Select options={carMakes} isSearchable placeholder='Make' className='index-search' value={selectedMake} onChange={makeChosen}/>
                        </Col>
                        <Col md={3} xs={12} className="mb-3">
                            <Select isDisabled={!carModels} options={carModels} isSearchable placeholder='Model' className='index-search' value={selectedModel} onChange={modelChosen}/>
                        </Col>
                        <Col md={3} xs={12} className="mb-3">
                            <Select options={carYear} isSearchable placeholder='Year' className='index-search' value={selectedYear} onChange={yearChosen}/>
                        </Col>
                        <Col md={3} xs={12} className="main-button">
                            <Link to='/search' state={{searchTerm}}>Search</Link>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="brands-to-search mb-50">
                <Container>
                    <Row>
                        <Col>
                            <div className="section_title">
                                <h2><span><strong>Owner's Manuals by Brand</strong></span></h2>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        {
                            topCarBrandData.map((cbd, index) =>
                                <Col lg={2} md={3} sm={4} xs={6} key={index} className={'mb-4 text-center'}>
                                    <div className="single_product">
                                        <Link  to='/search' state={{searchTerm: cbd.brandName + ' 2019'}}>
                                            <div className="product_thumb mb-2">
                                                <img src={cbd.logo} alt=""/>
                                            </div>
                                            <div>
                                                <h5>{cbd.brandName}</h5>
                                            </div>
                                            <div className="brand-url">
                                                <p>{cbd.brandUrl}</p>
                                            </div>
                                        </Link>
                                    </div>
                                </Col>
                            )
                        }
                    </Row>
                </Container>
            </section>

            <section className="call_to_action mb-50">
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

            <section className="contact-area">
                <Container>
                    <Row>
                        <Col>
                            <div className="section_title">
                                <h3><span> <strong>Contact</strong>Us</span></h3>
                            </div>
                            <div className="contact_message form">
                                <form id="contact-form" onSubmit={submitFormEmailWrapper}>
                                    <Row>
                                        <Col md={4} xs={12}>
                                            <p>
                                                <label> Your Name</label>
                                                <input name="name" onChange={handleFormChange} value={formName} placeholder="Name" type="text"/>
                                            </p>
                                        </Col>
                                        <Col md={4} xs={12}>
                                            <p>
                                                <label>  Your Email</label>
                                                <input name="email" onChange={handleFormChange} value={formEmail} placeholder="Email" type="email"/>
                                            </p>
                                        </Col>
                                        <Col md={4} xs={12}>
                                            <p>
                                                <label>  Subject</label>
                                                <input name="subject" onChange={handleFormChange} value={formSubject} placeholder="Subject" type="text"/>
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className="contact_textarea">
                                                <label>  Your Message</label>
                                                <textarea placeholder="Message" name="message" onChange={handleFormChange} value={formMessage} className="form-control2"/>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <button className="main" type="submit"> Send</button>
                                            <p className="form-message">
                                                {
                                                    formSuccess &&
                                                    <span className='thank-you'>Thank you for your message. Someone will be in touch with you shortly.</span>
                                                }

                                                {
                                                    formError &&
                                                    <span className='error danger'>Please make sure all fields are filled out properly.</span>
                                                }
                                            </p>
                                        </Col>
                                    </Row>
                                </form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Layout>
    );
};

export default IndexPage
