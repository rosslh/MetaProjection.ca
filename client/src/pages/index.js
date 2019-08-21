import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { StaticQuery, graphql } from "gatsby"

const IndexPage = () => (
  <StaticQuery
    query={graphql`
      query Federal2019Query {
        allFederal2019Json {
          edges {
            node
          }
        }
      }
    `}
    render={data => (
      <Layout>
        <SEO title="Home" />
        <h2>Federal projection</h2>
        <h3>Party seats</h3>
        <ol>
          <li>LPC: {data}</li>
          <li>CPC: </li>
          <li>NDP: </li>
        </ol>
      </Layout>
    )}
  />
)

export default IndexPage
