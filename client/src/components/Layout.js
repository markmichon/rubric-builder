import React, { useState } from 'react'
import { Box, Link, H, ButtonLink, Button } from './radicals'
import Icons from './Icons'
// import

function Header({ logOut }) {
  return (
    <Box
      as="header"
      display="flex"
      justifyContent="space-between"
      p="base"
      maxWidth="1000px"
      mx="auto"
    >
      <H>Application Name</H>
      <Box as="nav" display="flex">
        {/* <button onClick={handleLogOut}>Log Out</button> */}
        <ButtonLink to="/builder" variant="primary" mr="base">
          Create new Rubric <Icons.plus />
        </ButtonLink>
        <Button variant="secondary" onClick={logOut}>
          Log Out
        </Button>
      </Box>
    </Box>
  )
}

function Layout({ children, location, logOut }) {
  return (
    <>
      <Header logOut={logOut} />
      <Box as="main" p="2" maxWidth="1000px" mx="auto">
        {children}
      </Box>
    </>
  )
}

export default Layout
