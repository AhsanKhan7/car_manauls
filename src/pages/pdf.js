import React, {useState} from 'react';
import '../styles/style.scss';
import Layout from '../components/layout';
import pdfjsLib from 'pdfjs-dist';
import {manualUnlock} from "../backend/utils";
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

const PDFPage = ({location, path}) => {
    
    const manual = location.state ? location.state.manual : null;
    const [url, setUrl] = useState(location.state ? location.state.url : null);
    const [s3UnlockPayload, setS3UnlockPayload] = useState(extractObject());

    function openPDFNewPage() {
        manualUnlock(location.state.s3URL).then(s3url => {
            setUrl(s3url);
            setS3UnlockPayload(extractObject());
        });
    }

    let title = `Download or View Owner's Manual PDF`;
    let description = `PDF Owner's Manual`;

    if(manual && manual.year && manual.make && manual.model) {
        title = `${manual.year} ${manual.make} ${manual.model} - Download or View Owner's Manual PDF`;
        description = `${manual.year} ${manual.make} ${manual.model} PDF Owner's Manual`;
    }

    function extractObject() {
        let search = url.substring(1 + url.indexOf('?'));
        return JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function (key, value) {
            return key === "" ? value : decodeURIComponent(value)
        });
    }

    // setS3UnlockPayload(extractObject());
    console.log(s3UnlockPayload);

    return (
        <Layout siteTitle={title} description={description} path={path}>
            <section className="mb-50 mt-20">
                <Container>
                    <Row>
                        <Col>
                            <h1 className="long mb-30 mt-20">
                                {description}
                            </h1>
                        </Col>
                    </Row>
                    <Row className="mb-15">
                        <Col>
                            <form  action={url} target='_blank' method='GET'>
                                {
                                    Object.entries(s3UnlockPayload).map(([key, value]) =>
                                        <input key={key} type='hidden' name={key} value={value} />
                                    )
                                }
                                <button className='main' type='submit'>DOWNLOAD</button>
                            </form>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={9} sm={12}>
                            <div className="pdf-container">
                                <iframe title={title} src={url} height='100%' width='100%' frameBorder="0"/>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Layout>
    )
};

export default PDFPage
