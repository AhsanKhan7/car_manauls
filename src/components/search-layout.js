import React from "react"
import PropTypes from "prop-types"
import {useStaticQuery, graphql} from "gatsby"

import Footer from "./footer";
import {InstantSearch} from "react-instantsearch-dom";
import SearchHeader from "./search-header";
import algoliasearch from "algoliasearch/lite";
import { Configure } from 'react-instantsearch-dom';

const SearchLayout = ({children, searchTerm, updaterTop}) => {
    const data = useStaticQuery(graphql`
    query SiteTitleSearchQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

    const searchClient = algoliasearch(
        'VGCLEQDB5C',
        '7f085e0cdff29340cba1e35b5c039153'
    );

    function updater(value) {
        updaterTop(value);
    }

    return (
        <div
            style={{
                margin: `0 auto`,
                paddingTop: 0,
            }}
        >
            <InstantSearch
                indexName="Pages"
                searchClient={searchClient}
            >

            <Configure
                hitsPerPage={10}
            />

            <SearchHeader siteTitle={data.site.siteMetadata.title} searchTerm={searchTerm} updater={updater}/>
            <main>{children}</main>

            </InstantSearch>
            <Footer/>

        </div>
    )
};

SearchLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default SearchLayout
