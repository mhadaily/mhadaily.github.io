import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'gatsby';
import { Layout, Wrapper, Header, Content, SectionTitle } from '../components';

import config from '../../config/SiteConfig';

export default () => {
  return (
    <Layout>
      <Helmet title={`Writing | ${config.siteTitle}`} />
      <Header>
        <Link to="/">{config.siteTitle}</Link>
        <SectionTitle uppercase={true}>Writing</SectionTitle>
      </Header>
      <Wrapper>
        <Content>Comming soon</Content>
      </Wrapper>
    </Layout>
  );
};
