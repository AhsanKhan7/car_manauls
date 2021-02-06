import React from 'react';
import '../styles/style.scss';
import Layout from '../components/layout';
import smallLogo from '../img/logo/logo-small.png';
import {StaticQuery} from 'gatsby';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {Disqus, CommentCount} from 'gatsby-plugin-disqus';
import {graphql} from 'gatsby';
import {InlineShareButtons} from 'sharethis-reactjs';


const mapped = {
    brand: 'Brand',
    model: 'Model',
    generation: 'Trim Level',
    doors: 'Doors',
    powerHp: 'Horsepower',
    powerRpm: 'RPM',
    tankVOlume: 'Fuel Tank Capacity',
    yearstart: 'Start of Production',
    coupe: 'Body Type',
    places: 'Seats',
    wheelbase: 'Wheelbase',
    engineDisplacement: 'Engine Displacement',
    fuel: 'Fuel Type',
    drive: 'Drivetrain',
    gearboxAT: 'Automatic Transmission Gears',
    gearboxMT: 'Manual Transmission Gears',
    gearboxATType: 'Automatic Transmission Type',
    gearboxMTType: 'Manual Transmission Type',
    fuelConsumptionCombined: 'Fuel Efficiency (plus metrics)',
    modelYear: 'Model Year'
};


export default ({location, pageContext: {entry}}) => {

    return (
        <Layout siteTitle={`${entry.year} ${entry.brand._text} ${entry.model._text} - Owner's manual PDF`} description={`Download or view the ${entry.year} ${entry.brand._text} ${entry.model._text} PDF car owner’s manual.`}>
            <div className="product_details variable_product mt-20">
                <Container>
                    <Row>
                        <Col md={6} xs={12}>
                            <div className="product-details-tab">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td><img src={smallLogo} alt=""/></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Col>
                        <Col md={6} xs={12}>
                            <div className="product_d_right">
                                <h1>View the <span className="dynamic-text">{entry.year} {entry.brand._text} {entry.model._text}</span>’s technical specs</h1>

                                <div className="product_desc">
                                    <h2>
                                        The <span className="dynamic-text">{entry.year} {entry.brand._text} {entry.model._text}</span> specs are listed below.
                                    </h2>
                                </div>

                                <div className="product_variant quantity">

                                    {/*<button className={'button ' + manualPrompt} onClick={unlockFile}>*/}
                                    {/*    <div className="button-text">{manualPrompt}</div>*/}
                                    {/*    <Spinner animation="border" variant="light" />*/}
                                    {/*</button>*/}

                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row className="mt-15">
                        <Col>
                            {/*<div className="inline-share-buttons"/>*/}
                            <InlineShareButtons
                                config={{
                                    alignment: 'center',  // alignment of buttons (left, center, right)
                                    color: 'social',      // set the color of buttons (social, white)
                                    enabled: true,        // show/hide buttons (true, false)
                                    font_size: 11,        // font size for the buttons
                                    labels: 'cta',        // button labels (cta, counts, null)
                                    language: 'en',       // which language to use (see LANGUAGES)
                                    networks: [           // which networks to include (see SHARING NETWORKS)
                                        'facebook',
                                        'twitter',
                                        'pinterest',
                                        'email',
                                        'sms',
                                        'sharethis',
                                    ],
                                    padding: 8,          // padding within buttons (INTEGER)
                                    radius: 4,            // the corner radius on each button (INTEGER)
                                    show_total: true,
                                    size: 32,
                                    property: '5dc1e93f22d2de0012305b54'
                                }} 
                            />
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className="product_d_info">
                <Container>
                    <Row>
                        <Col>
                            {entry && (
                            <div className="product_d_inner">
                                <div className="product_info_button">
                                    <h3>Technical Specifications</h3>
                                </div>
                                <div className="tab-content">
                                    <div className="tab-pane fade active" id="sheet" role="tabpanel">
                                        <div className="product_d_table">
                                            <form action="#">
                                                <table>
                                                    <tbody itemScope itemType='https://schema.org/Car'>
                                                        {Object.keys(entry).map((dataPoint, key) => {
                                                            if(!mapped[dataPoint])
                                                                return (<></>);

                                                            return (
                                                            <tr key={key}>
                                                                <td className="first_child">{mapped[dataPoint]}</td>
                                                                <td itemprop={entry[dataPoint].semantic} >{entry[dataPoint]._text}</td>
                                                            </tr>);
                                                        }
                                                        )}
                                                    </tbody>
                                                </table>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
            <div>
                <StaticQuery
                    query={graphql`
                      {
                        site {
                          siteMetadata {
                            siteUrl
                          }
                        }
                      }
                    `}
                    render={(data) => {
                        let disqusConfig = {
                            url: `${data.site.siteMetadata.siteUrl}${location.pathname}`,
                            identifier: entry.id,
                            title: `${entry.brand._text} Discussion`,
                        };
                        return (
                            <Container>
                                <h1>{entry.brand._text} Discussion</h1>
                                <CommentCount config={disqusConfig} placeholder={'...'}/>

                                <Disqus config={disqusConfig}/>
                            </Container>
                        )
                    }
                    }
                />
            </div>
        </Layout>
    )
}