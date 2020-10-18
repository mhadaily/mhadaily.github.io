import React, { useEffect, useRef } from 'react';
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';
import { rgba, darken, lighten } from 'polished';
import { Layout, Wrapper, Button, Article } from '../components';
import PageProps from '../models/PageProps';
import { Helmet } from 'react-helmet';
import config from '../../config/SiteConfig';
import { media } from '../utils/media';

const Homepage = styled.main`
  display: flex;
  height: 100vh;
  flex-direction: row;
  @media ${media.tablet} {
    height: 100%;
    flex-direction: column;
  }
  @media ${media.phone} {
    height: 100%;
    flex-direction: column;
  }
`;

const GridRow: any = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props: any) =>
    props.background
      ? `linear-gradient(
      -185deg,
      ${rgba(darken(0.1, props.theme.colors.primary), 0.7)}, 
      ${rgba(lighten(0.1, props.theme.colors.black), 0.9)}), url(${config.defaultBg}) no-repeat`
      : null};
  background-size: cover;
  padding: 2rem 4rem;
  color: ${(props: any) => (props.background ? props.theme.colors.white : null)};
  h1 {
    color: ${(props: any) => (props.background ? props.theme.colors.white : null)};
  }
  @media ${media.tablet} {
    padding: 3rem 3rem;
  }
  @media ${media.phone} {
    padding: 2rem 1.5rem;
  }
`;

const Matrix: any = styled.canvas`
  position: absolute;
  z-index: -1;
  opacity: 0.5;
`;

const HomepageContent = styled.div<{ center?: boolean }>`
  max-width: 30rem;
  text-align: ${(props) => (props.center ? 'center' : 'left')};
`;

export default ({ data }: PageProps) => {
  // Get the canvas node and the drawing context
  const canvas = useRef<HTMLCanvasElement | any>();
  const col = useRef<HTMLElement>();

  useEffect(() => {
    const ctx = canvas.current.getContext('2d');
    // set the width and height of the canvas
    const w = (canvas.current.width = col.current?.offsetWidth) || 200;
    const h = (canvas.current.height = col.current?.offsetHeight) || 100;
    // draw a black rectangle of width and height same as that of the canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
    const cols = Math.floor(w / 20) + 1;
    const ypos = Array(cols).fill(0);

    function matrix() {
      // Draw a semitransparent black rectangle on top of previous drawing
      ctx.fillStyle = rgba(0, 0, 0, 0.066);
      ctx.fillRect(0, 0, w, h);
      // Set color to green and font to 15pt monospace in the drawing context
      ctx.fillStyle = '#0f0';
      ctx.font = '10pt monospace';
      // for each column put a random character at the end
      ypos.forEach((y, ind) => {
        // generate a random character
        const text = String.fromCharCode(Math.random() * 128);
        // x coordinate of the column, y coordinate is already given
        const x = ind * 20;
        // render the character at (x, y)
        ctx.fillText(text, x, y);
        // randomly reset the end of the column if it's at least 100px high
        y > 100 + Math.random() * 10000
          ? (ypos[ind] = 0)
          : // otherwise just move the y coordinate for the column 20px down,
            (ypos[ind] = y + 20);
      });
    }
    const FPS_WANTED = 20;
    const FPS = 1000 / FPS_WANTED;
    setInterval(matrix, FPS);
  }, []);

  const { edges, totalCount } = data.allWordpressWpConferences;
  return (
    <Layout>
      <Wrapper fullWidth={true}>
        <Helmet title={`Homepage | ${config.siteTitle}`} />
        <Homepage>
          <GridRow background={false} ref={col}>
            <Matrix ref={canvas} />
            <HomepageContent center={true}>
              <img src={config.siteLogo} alt={config.siteTitle} />
              <h1>
                Hi. I am <br /> Majid Hajian
              </h1>
              <p>I write about Dart, Flutter, PWA, Performance and JavaScript</p>
              <Link to="/speaking">
                <Button big={true}>Speaking</Button>
              </Link>
              <Link to="/writing">
                <Button big={true}>Writing</Button>
              </Link>
              <Link to="/blog">
                <Button big={true}>Blog</Button>
              </Link>
              <GridRow>
                <Link to="/contact">
                  <Button big={false}>Contact</Button>
                </Link>
              </GridRow>
            </HomepageContent>
          </GridRow>
          <GridRow>
            <HomepageContent>
              <h2>About Me</h2>
              <p>
                I am a passionate software developer with years of developing and architecting
                complex web and mobile applications. my passions are Flutter, PWA, and performance.
                I love sharing my knowledge with the community by writing and speaking, contributing
                to open source, and organizing meetups and events.
                <br /> I am the award-winning author of the "Progressive web app with Angular" book
                by Apress and the "Progressive Web Apps" video course by PacktPub and Udemy. <br />I
                am also (co)organizer a few Nordic conferences and meetups including GDG Oslo,
                FlutterVikings, Mobile Era, and ngVikings.
              </p>
              <hr />
              <h2>Latest Talk/Workshop</h2>
              {edges.map(({ node }) => (
                <div key={node.wordpress_id}>
                  <p>
                    {node.acf.title} at <b>{node.title}</b>
                  </p>
                  <p>{node.acf.date}</p>
                </div>
              ))}
              <p className={'textRight'}>
                <Link to={'/speaking'}>All talks ({totalCount})</Link>
              </p>
            </HomepageContent>
          </GridRow>
        </Homepage>
      </Wrapper>
    </Layout>
  );
};

// export const IndexQuery = graphql`
//   query {
//     allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: 1) {
//       totalCount
//       edges {
//         node {
//           fields {
//             slug
//           }
//           frontmatter {
//             title
//             date(formatString: "DD.MM.YYYY")
//             category
//           }
//           timeToRead
//         }
//       }
//     }
//   }
// `;
export const IndexQuery = graphql`
  query {
    allWordpressWpConferences(sort: { fields: date, order: DESC }, limit: 1) {
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
