import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { StaticQuery, graphql } from "gatsby"

const IndexPage = () => (
  <StaticQuery
    query={graphql`
      query Federal2019Query {
        federalJson {
          parties {
            avg
            name
            projections {
              calculatedPolitics
              cdnElectionWatch
              threethirtyeight
              cbc
            }
          }
        }
      }
    `}
    render={data => (
      <Layout>
        <SEO title="Home" />
        <h2>Federal projection</h2>
        <h3>Party seats</h3>
        <div>{JSON.stringify(data)}</div>
        <ol>
          {/* <li>LPC: {data.parties.find(x => (x.name = "lpc")).seats}</li> */}
          <li>CPC: </li>
          <li>NDP: </li>
        </ol>
      </Layout>
    )}
  />
)

export default IndexPage
