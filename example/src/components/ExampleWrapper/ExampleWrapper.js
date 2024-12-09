import PropTypes from 'prop-types'
import React from 'react'
import {
  Col,
  Container,
  Row,
  Tab,
  Tabs
} from 'react-bootstrap'

const ExampleWrapper = ({
  code,
  children,
  description,
  output,
  pageHeading,
  timeline
}) => (
  <div className="overflow-y-scroll">
    <header className="pt-5">
      <Container className="p-0">
        <h2 className="h1 mb-4 font-weight-bolder">{pageHeading}</h2>
        <p>{description}</p>
      </Container>
    </header>
    {children}
    <div className="timeline-example timeline-example--one mb-5 mt-5 bg-light">
      <Container className="px-0 py-2">
        <span className="text-uppercase small fw-bold">
          Interactive Example
        </span>
      </Container>
      {timeline}
    </div>
    <Container className="px-0">
      <Tabs defaultActiveKey="code" id="example-page-tabs mb-5">
        <Tab eventKey="code" className="py-4" title="Code (.jsx)">
          <Container>
            <Row>
              <Col>
                <pre className="w-100">
                  <code className="jsx px-4 pb-4">{code}</code>
                </pre>
              </Col>
            </Row>
          </Container>
        </Tab>
        <Tab eventKey="output" className="py-4" title="Callback Return Values">
          <Container>
            <Row>
              <Col>
                <p>
                  When callback functions are defined, the timeline provides them values
                  that represent its current position, zoom, and ranges. See the
                  {' '}
                  <a target="_blank" href="https://github.com/nasa/edsc-timeline?tab=readme-ov-file#callback-function-return-value" rel="noreferrer">README.md</a>
                  {' '}
                  in the
                  {' '}
                  <a target="_blank" href="https://github.com/nasa/edsc-timeline" rel="noreferrer">@edsc/timeline</a>
                  {' '}
                  repository for more information
                  about the callback functions.
                </p>
                {output}
              </Col>
            </Row>
          </Container>
        </Tab>
      </Tabs>
    </Container>
  </div>
)

ExampleWrapper.defaultProps = {
  children: null
}

ExampleWrapper.propTypes = {
  code: PropTypes.node.isRequired,
  children: PropTypes.node,
  description: PropTypes.string.isRequired,
  output: PropTypes.node.isRequired,
  pageHeading: PropTypes.string.isRequired,
  timeline: PropTypes.node.isRequired
}

export default ExampleWrapper
