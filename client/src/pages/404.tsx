import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";

const NotFoundPage = () => (
  <Layout noMap>
    {typeof window !== "undefined" ? (
      <>
        <SEO title="404: Not found" />
        <h1>404: Not Found</h1>
        <p>This page does not exist.</p>
      </>
    ) : null}
  </Layout>
);

export default NotFoundPage;
