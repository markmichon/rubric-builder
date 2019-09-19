import React from 'react'
import { Link } from '@reach/router'

const Nav = () => (
  <div>
    <Link to="/">Dashboard</Link> / <Link to="/builder">Builder</Link>
  </div>
)

export default Nav
