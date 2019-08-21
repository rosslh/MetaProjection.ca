import { Link } from "gatsby"
import React from "react"
import { css } from "@emotion/core"

const Header = () => (
  <header
    css={css`
      height: 2rem;
      width: 100%;
      margin-bottom: 1rem;
    `}
  >
    <span>Logo</span>
    <Link to="/about">About</Link>
  </header>
)

export default Header
