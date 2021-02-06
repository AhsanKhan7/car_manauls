import React, {useState} from "react"
import '../styles/style.scss';
import {Link} from "gatsby"
import {Hits} from 'react-instantsearch-dom';
import {Pagination} from 'react-instantsearch-dom';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {connectStateResults} from 'react-instantsearch-dom';

import SearchLayout from "../components/search-layout";


const Hit = ({hit}) => {
    const dualHit = hit.context.manual ? hit.context.manual : hit.context.entry;
    if (!dualHit)
        return null;

    let splitMake;
    if(hit.context.manual) {
        splitMake = hit.context.manual.make.split(' ');
    } else {
        splitMake = hit.context.entry.brand._text.split(' ');
    }

    const cappedElements = splitMake.map(element => {
        return element.charAt(0).toUpperCase() + element.slice(1);
    });
    let make = cappedElements.join('-');
    if (make === 'Rollsroyce') {
        make = 'Rolls-Royce';
    }
    const carLogo = '/car-logos/' + make + '-logo.png';

    if (dualHit.make) {
        return (
            <div key={hit.objectID} className="single_product">
                <div className="product_thumb">
                    <img src={carLogo} alt=""></img>
                </div>
                <div className="product_content list_content">
                    <div className="left_caption">
                        <div className="product_name">
                            <h3>
                                <Link
                                    to={hit.path}>{hit.context.manual.make} {hit.context.manual.model} {hit.context.manual.year}</Link>
                            </h3>
                        </div>
                    </div>
                    <div className="right_caption">
                        <div className="main-button">
                            <Link to={hit.path}>get manual</Link>
                        </div>
                    </div>
                </div>
            </div>);
    } else {
        return (
            <div key={hit.objectID} className="single_product">
                <div className="product_thumb">
                    <img src={carLogo} alt=""></img>
                </div>
                <div className="product_content list_content">
                    <div className="left_caption">
                        <div className="product_name">
                            <h3>
                                <Link
                                    to={hit.path}>{hit.context.entry.brand._text} {hit.context.entry.model._text} {hit.context.entry.modelYear._text}</Link>
                            </h3>
                        </div>
                    </div>
                    <div className="right_caption">
                        <div className="main-button">
                            <Link to={hit.path}>get manual</Link>
                        </div>
                    </div>
                </div>
            </div>);
    }
};


const StateResults = ({ searchResults }) => {
    const hasResults = searchResults && searchResults.nbHits !== 0;

    return (
        <div className="col-12 ">
            <div hidden={!hasResults}><Pagination/></div>
            <Hits hitComponent={Hit}/>
        </div>
    );
};

const CustomStateResults = connectStateResults(StateResults);

const CarSearch = ({location}) => {

    const [searchTerm, setSearchTerm] = useState(location.state ? location.state.searchTerm : '');

    return (
        <SearchLayout searchTerm={searchTerm} updaterTop={setSearchTerm}>
            <div className="car-elements_area car-elements_reverse">
                <Container>
                    <Row>
                        <Col md={{ span: 9, offset: 3 }}>
                            <div>
                                <div className="car-elements_title">
                                    {searchTerm.length !== 0 && (<h3>Search results for: <strong>"{searchTerm}"</strong></h3>)}
                                </div>
                                <Row className="car-elements_wrapper grid_list">
                                    <CustomStateResults/>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </SearchLayout>
    );
};

export default CarSearch
