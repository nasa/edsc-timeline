import React from "react"
import PropTypes from "prop-types"
import { startCase } from "lodash"

import { RESOLUTIONS } from "../../../../src/constants"
import { Card, Col, Container, Row, Table } from "react-bootstrap"

import "./Output.scss"

const OutputItemEntry = ({ borderBottom, heading, value, ...props }) => {
  let classNames = "d-flex align-items-center p-2"

  if (borderBottom) classNames += " border-bottom border-bottom-light"

  return (
    <div data-testid="center" className={classNames} {...props}>
      <span className="output-item-entry__heading pl-3 font-weight-bold">
        {heading}
      </span>
      <span className="text-monospace pr-3">{value}</span>
    </div>
  )
}

const OutputItem = ({ heading, children }) => (
  <Col>
    <Card>
      <Card.Header>{heading}</Card.Header>
      <div className="mb-0">{children}</div>
    </Card>
  </Col>
)

export const Output = ({
  displayedCenter,
  zoom,
  timelineRange,
  temporalStart,
  temporalEnd,
  focusedStart,
  focusedEnd,
}) => {
  const { end: timelineEnd, start: timelineStart } = timelineRange

  return (
    <section className="mt-5 mb-5 d-flex flex-column align-items-center">
      <Container fluid className="px-0">
        <Row className="mb-4">
          <OutputItem heading="Center & Zoom">
            <OutputItemEntry
              data-testid="center"
              heading="Center:"
              value={`${new Date(displayedCenter).toUTCString()}`}
              borderBottom
            />
            <OutputItemEntry
              data-testid="zoom"
              heading="Zoom:"
              value={`${startCase(RESOLUTIONS[zoom])} (${zoom})`}
            />
          </OutputItem>
          <OutputItem heading="Timeline Range">
            <OutputItemEntry
              data-testid="timelineStart"
              heading="Start:"
              value={`${
                timelineStart && new Date(timelineStart).toISOString()
              }`}
              borderBottom
            />
            <OutputItemEntry
              data-testid="timelineEnd"
              heading="End:"
              value={`${timelineEnd && new Date(timelineEnd).toISOString()}`}
            />
          </OutputItem>
        </Row>
        <Row>
          <OutputItem heading="Temporal Range">
            <OutputItemEntry
              data-testid="temporalStart"
              heading="Start:"
              value={` ${
                temporalStart && new Date(temporalStart).toISOString()
              }`}
              borderBottom
            />
            <OutputItemEntry
              data-testid="temporalEnd"
              heading="End:"
              value={` ${temporalEnd && new Date(temporalEnd).toISOString()}`}
            />
          </OutputItem>
          <OutputItem heading="Focused Range">
            <OutputItemEntry
              data-testid="focusedStart"
              heading="Start:"
              value={` ${focusedStart && new Date(focusedStart).toISOString()}`}
              borderBottom
            />
            <OutputItemEntry
              data-testid="focusedEnd"
              heading="End:"
              value={` ${focusedEnd && new Date(focusedEnd).toISOString()}`}
            />
          </OutputItem>
        </Row>
      </Container>
    </section>
  )
}

Output.defaultProps = {
  displayedCenter: null,
  zoom: null,
  timelineRange: {},
  temporalStart: null,
  temporalEnd: null,
  focusedStart: null,
  focusedEnd: null,
}

Output.propTypes = {
  displayedCenter: PropTypes.number,
  zoom: PropTypes.number,
  timelineRange: PropTypes.shape({
    end: PropTypes.number,
    start: PropTypes.number,
  }),
  temporalStart: PropTypes.number,
  temporalEnd: PropTypes.number,
  focusedStart: PropTypes.number,
  focusedEnd: PropTypes.number,
}
