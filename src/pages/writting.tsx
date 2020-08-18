import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'gatsby';
import { Layout, Wrapper, Header, Button, Content, SectionTitle } from '../components';

import config from '../../config/SiteConfig';

export default () => {
  return (
    <Layout>
      <Helmet title={`Writting | ${config.siteTitle}`} />
      <Header>
        <Link to="/">{config.siteTitle}</Link>
        <SectionTitle uppercase={true}>Writting</SectionTitle>
      </Header>
      <Wrapper>
        <Content>Comming soon</Content>
      </Wrapper>
    </Layout>
  );
};
