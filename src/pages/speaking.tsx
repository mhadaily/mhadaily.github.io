import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, graphql } from 'gatsby';
import { Layout, Wrapper, Header, Button, Content, SectionTitle } from '../components';

import config from '../../config/SiteConfig';
import PageProps from '../models/PageProps';

export default ({ data }: PageProps) => {
  const { edges, totalCount } = data.allWordpressWpConferences;

  return (
    <Layout>
      <Helmet title={`Speaking | ${config.siteTitle}`} />
      <Header>
        <Link to="/">{config.siteTitle}</Link>
        <SectionTitle uppercase={true}>Speaking</SectionTitle>
      </Header>
      <Wrapper>
        <Content>
          <ol>
            {edges.map(({ node }) => (
              <li key={node.wordpress_id}>
                <p>
                  {node.acf.title} at <b>{node.title}</b>
                </p>
                <p>
                  {node.acf.date}, {node.date}
                </p>
              </li>
            ))}
          </ol>
          Total: {totalCount}
        </Content>
      </Wrapper>
    </Layout>
  );
};

export const SpeakingQuery = graphql`
  query {
    allWordpressWpConferences(sort: { fields: date, order: DESC }) {
      totalCount
      edges {
        node {
          wordpress_id
          date(fromNow: true)
          title
          acf {
            title
            description
            type
            slide
            website
            date
            video
            online
            gallery
          }
        }
      }
    }
  }
`;
