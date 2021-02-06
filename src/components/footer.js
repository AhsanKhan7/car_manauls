import React, {useState} from 'react';
import {Link} from 'gatsby';
import logo from '../img/logo/logo.png';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import addToMailchimp from 'gatsby-plugin-mailchimp';

const Footer = () => {

    const [email, setEmail] = useState('');
    const [mailchimpMsg, setMailchimpMsg] = useState(null);

    const handleInput = e => {
        const {value} = e.target
        setEmail(value);
        setMailchimpMsg(null);
    }

    const handleSubmit = e => {
        e.preventDefault();
        addToMailchimp(email).then( ({result, msg}) => {
            setMailchimpMsg(msg);
            if (result !== 'error') {
                setEmail('');
            }
        })
        .catch(() => {
            console.log('unexpected Mailchimp error');
        })
      }

    return (
        <footer className="footer-widgets">
        <Container>
            <div className="footer-top">
                <Row>
                    <Col>
                        <div className="footer-logo">
                            <Link to='/'><img src={logo} alt=""/></Link>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg={4} md={6}>
                        <div className="widgets-container">
                            <div className="footer-menu">
                                <ul>
                                    <li><Link to='/about-us'>About Us</Link></li>
                                    <li><Link to='/work-with-us'>Advertise</Link></li>
                                    <li><Link to='/privacy-policy'>Privacy policy</Link></li>
                                    <li><Link to='/terms-and-conditions'>Terms and conditions</Link></li>
                                </ul>
                            </div>
                        </div>
                    </Col>
                    <Col lg={4} md={6}>
                        <div className="widgets-container">
                            <div className="follow-us">
                                <p>Follow Us:</p>
                                <ul className="follow_link">
                                    <li><a href="https://www.facebook.com/carmanuals.org/" rel="noopener noreferrer" target="_blank"><i className="ion-social-facebook"></i></a></li>
                                    <li><a href="https://www.instagram.com/carmanualsorg" rel="noopener noreferrer" target="_blank"><i className="ion-social-instagram"></i></a></li>
                                    <li><a href="https://www.pinterest.com/2cb7dca7cbd0a6acaf745a84d80023/" rel="noopener noreferrer" target="_blank"><i className="ion-social-pinterest"></i></a></li>
                                    <li><a href="https://twitter.com/carmanuals_org" rel="noopener noreferrer" target="_blank"><i className="ion-social-twitter" target="_blank"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </Col>
                    <Col lg={4} md={6}>
                        <div className="widgets-container">
                            <p>Stay up to date with the latest automotive news.</p>
                            <p>Join our newsletter today!</p>
                            <div className="subscribe-form">
                                <form onSubmit={handleSubmit} id="mc-embedded-subscribe-form" className="mc-form footer-newsletter">
                                    <input id="email" onChange={handleInput} value={email} type="email" autoComplete="off"
                                           placeholder="Your Email"/>
                                    <button className="main" id="mc-submit" type="submit">Subscribe</button>
                                </form>
                                <div className="mailchimp-alerts text-centre">
                                    <div className="mailchimp-submitting">{mailchimpMsg}</div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="footer-bottom">
                <Row>
                    <Col>
                        <div className="copyright-area">
                            <p>Copyright &copy; 2019 <Link to='/'>Car Manuals Ltd.</Link> All Rights Reserved.</p>
                        </div>
                    </Col>
                </Row>
            </div>
        </Container>
    </footer>
    )
    
}

export default Footer