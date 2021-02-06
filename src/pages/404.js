import React from 'react';
import '../styles/style.scss';
import Layout from '../components/layout';
import SEO from '../components/seo';
import Container from 'react-bootstrap/Container';

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <Container>
      <section className="minimum-height text-center">
        <h1 className="mt-50">Ooops, no such page</h1>
        <h4 className="mt-30">Go to <a href="http://carmanuals.org">carmanuals.org</a> instead.</h4>
      </section>
    </Container>
  </Layout>
)

export default NotFoundPage
