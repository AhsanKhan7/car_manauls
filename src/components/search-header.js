import {Link} from 'gatsby';
import logo from '../img/logo/logo.png';
import PropTypes from 'prop-types';
import React from 'react';
import {SearchBox} from 'react-instantsearch-dom';
import {StickyContainer, Sticky} from 'react-sticky';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import SEO from './seo';


const SearchHeader = ({siteTitle, searchTerm, updater, description}) => {

    return (
        <>
            <SEO title={siteTitle} description={description}/>
            <StickyContainer>
                <Sticky>
                    {({ style }) =>

                    <header className="header-area" style={style}>
                        <Container>
                            <Navbar className="main-navigation" collapseOnSelect expand="lg">
                                <Navbar.Brand href="/"><img src={logo} alt=""/></Navbar.Brand>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav" className="navigation-item">
                                    <Nav className="mr-auto">
                                        <Nav><Link to='/brands'>Brands</Link></Nav>
                                        <Nav><Link to='/resources'>Resources</Link></Nav>
                                        <Nav><a href='http://blog.carmanuals.org'>Car News</a></Nav>
                                    </Nav>
                                </Navbar.Collapse>
                            </Navbar>
                        </Container>
                    </header>

                }
                </Sticky>
            </StickyContainer>

            <div className="search-area">
                <Container>
                    <Navbar>
                        <div className="search-container">
                            <div className="search-box">
                            <SearchBox defaultRefinement={searchTerm}
                                    onChange={event => {
                                        console.log(event.currentTarget);
                                        updater(event.currentTarget.value);
                                    }}
                                    submit={false}
                                    translations={{
                                    placeholder: 'Type a Different Make, Model or Keyword',
                                    }}
                                    searchAsYouType={true}
                                />
                            </div>
                        </div>
                    </Navbar>
                </Container>
            </div>
        </>
    )
};

SearchHeader.propTypes = {
    siteTitle: PropTypes.string,
};

SearchHeader.defaultProps = {
    siteTitle: ``,
};

export default SearchHeader
