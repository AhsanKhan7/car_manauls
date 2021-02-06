/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { StickyContainer } from 'react-sticky';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'universal-cookie';

import Header from "./header"
import Footer from "./footer";

const Layout = ({children, path, description, siteTitle}) => {

    const cookies = new Cookies();

    cookies.set('gatsby-gdpr-google-analytics', 'true', { path: '/' });

    return (
        <StickyContainer>
          <div
            style={{
                margin: `0 auto`,
                paddingTop: 0,
            }}
          >
              <Header path={path} siteTitle={siteTitle} description={description}/>
              <main>{children}</main>
              <Footer/>

          </div>
        </StickyContainer>
    )
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Layout
