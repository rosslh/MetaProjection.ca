import React from "react";
import { StaticQuery, graphql } from "gatsby";
import Img from "gatsby-image";

type Props = {
  src: string;
  alt: string;
  className?: string;
  wrapperStyle?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
};

const Image = (props: Props) => (
  <StaticQuery
    query={graphql`
      query {
        images: allFile {
          edges {
            node {
              relativePath
              name
              childImageSharp {
                fluid(maxWidth: 600) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    `}
    render={(data) => {
      const image = data.images.edges.find((n: any) => {
        return n.node.relativePath.includes(props.src);
      });
      if (!image) {
        return null;
      }

      //const imageSizes = image.node.childImageSharp.sizes; sizes={imageSizes}
      return (
        <Img
          style={props.wrapperStyle}
          imgStyle={props.imgStyle}
          className={props.className + " dynamic-image"}
          alt={props.alt}
          fluid={image.node.childImageSharp.fluid}
        />
      );
    }}
  />
);

export default Image;
