import React, {useState} from "react";
import '../styles/style.scss';
import Layout from "../components/layout";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {submitFormEmail} from '../backend/utils';


const AboutUsPage = () => {

  const [formSuccess, setFormSuccess] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formName, setFormName] = useState('');
  const [formMessage, setFormMessage] = useState('');

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

  const siteTitle = 'About Us';
  const descriptionContent = 'Our vision is to bring quick and reliable information to everyone about their vehicle. We are doing this through the compilation of the world’s most complete database of PDF car owner\'s manuals.';
  return (
  <Layout siteTitle={siteTitle} description={descriptionContent}>
    <section className="work-with-us mt-20 mb-20">
      <Container>
        <Row className="section_title">
          <Col>
            <h1>
              <span><strong>About Us</strong></span>
            </h1>
          </Col>
        </Row>
        <Row className="mb-50">
          <Col lg={12}>
            <div className="mb-15">
            </div>
          </Col>
          <Col lg={6}>
            <div className="contact_message form mb-20">
              <form id="contact-form" onSubmit={submitFormEmailWrapper}>
                <p>
                  <label> Your Name</label>
                  <input name="name" onChange={handleFormChange} value={formName} placeholder="Name" type="text"/>
                </p>
                <p>       
                  <label>  Your Email</label>
                  <input name="email" onChange={handleFormChange} value={formEmail} placeholder="Email" type="email"/>
                </p>
                <p>
                  <label>  Subject</label>
                  <input name="subject" onChange={handleFormChange} value={formSubject} placeholder="Subject" type="text"/>
                </p>
                <div className="contact_textarea">
                  <label>  Your Message</label>
                  <textarea placeholder="Message" name="message" onChange={handleFormChange} value={formMessage} className="form-control2"/>
                </div>
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
              </form> 
            </div>
          </Col>
          <Col lg={6}>
            <Tabs defaultActiveKey="about" className="info-tabs">
              <Tab eventKey="about" title="About Us">
                <p>
                  Our vision is to bring quick and reliable information to everyone about their vehicle. 
                </p>
                <p>
                  We are doing this through the compilation of the world’s most complete and accurate database of car owner's manuals.
                </p>
                <p>
                  Please feel free to contact us with any questions, concerns or suggestions and we will get back to you as quickly as possible.
                </p>
              </Tab>
              <Tab eventKey="advertise" title="Advertise" className="carmanuals-tab-content">
                <p>
                  Reach the most engaged auto audience online.
                </p>
                <p>
                  Work with our team to develop strategic digital marketing and advertising solutions.
                </p>
                <p>
                  Contact us today!
                </p>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container> 
      
    </section>
  </Layout>
)};

export default AboutUsPage
