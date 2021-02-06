import {Link} from 'gatsby';
import logo from '../img/logo/logo.png';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Sticky} from 'react-sticky';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Autocomplete from './algolia-autocomplete';
import {connectAutoComplete, InstantSearch} from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';
import SEO from './seo';

const AlgoliaAutocomplete = connectAutoComplete(Autocomplete);
const searchClient = algoliasearch(
    'VGCLEQDB5C',
    '7f085e0cdff29340cba1e35b5c039153'
);
const Header = ({siteTitle, description, path}) => {

    const [searchTerm, setSearchTerm] = useState('');

    return (
        <>
            <SEO title={siteTitle} description={description}/>
            <Sticky topOffset={80}>
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
            { ((path && !path.match(/pdf/)) || !path) &&
                <div className="search-area">
                    <Container>
                        <Navbar>
                            <div className="search-container">
                                <div className="search-box">
                                <InstantSearch indexName="Pages"
                                               searchClient={searchClient}>
                                    <AlgoliaAutocomplete searchTermSetter={setSearchTerm} searchTerm={searchTerm}/>
                                </InstantSearch>
                                <Link to='/search' state={{searchTerm}}>
                                    <button type="submit"><i className="ion-ios-search-strong"/></button>
                                </Link>
                                </div>
                            </div>
                        </Navbar>
                    </Container>
                </div>
            }
        </>
    )
};

Header.propTypes = {
    siteTitle: PropTypes.string,
};

Header.defaultProps = {
    siteTitle: ``,
};

export default Header
