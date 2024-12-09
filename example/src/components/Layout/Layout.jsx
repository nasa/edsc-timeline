import React from "react"

import { LinkContainer } from "react-router-bootstrap"
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { Outlet } from "react-router-dom"

const routes = [
  {
    to: "/empty",
    title: "Empty",
  },
  {
    to: "/temporalRange",
    title: "Temporal Range",
  },
  {
    to: "/temporalStart",
    title: "Temporal Start",
  },
  {
    to: "/temporalEnd",
    title: "Temporal End",
  },
  {
    to: "/callbacks",
    title: "Callbacks",
  },
]

const Layout = () => (
  <>
    <Navbar bg="light">
      <Container>
        <Navbar.Brand href="#">@edsc/timeline Demo</Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav" className="overflow-x-auto">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Demo</Nav.Link>
            </LinkContainer>
            <NavDropdown title="Additional Demos">
              {routes.map(({ title, to }) => (
                <LinkContainer key={`link__${to}`} to={to}>
                  <Nav.Link>{title}</Nav.Link>
                </LinkContainer>
              ))}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <Outlet />
  </>
)

export default Layout
