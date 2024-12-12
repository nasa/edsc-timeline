import React from 'react'

import { LinkContainer } from 'react-router-bootstrap'
import {
  Container,
  Nav,
  Navbar,
  NavDropdown
} from 'react-bootstrap'
import { Outlet } from 'react-router-dom'

const routes = [
  {
    to: '/empty',
    title: 'Empty'
  },
  {
    to: '/temporalRange',
    title: 'Temporal Range'
  },
  {
    to: '/temporalStart',
    title: 'Temporal Start'
  },
  {
    to: '/temporalEnd',
    title: 'Temporal End'
  },
  {
    to: '/callbacks',
    title: 'Callbacks'
  }
]

const Layout = () => (
  <>
    <Navbar expand="lg" bg="light">
      <Container>
        <Navbar.Brand href="/">@edsc/timeline Demo</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Demo</Nav.Link>
            </LinkContainer>
            <NavDropdown id="additional-demos-dropdown" title="Additional Demos">
              {
                routes.map(({ title, to }) => (
                  <NavDropdown.Item key={`link__${to}`} to={to} as={LinkContainer}>
                    <Nav.Link>{title}</Nav.Link>
                  </NavDropdown.Item>
                ))
              }
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <Outlet />
  </>
)

export default Layout
