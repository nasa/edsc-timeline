# Earthdata Search Components: Timeline

[![npm version](https://badge.fury.io/js/%40edsc%2Ftimeline.svg)](https://badge.fury.io/js/%40edsc%2Ftimeline)
![Build Status](https://github.com/nasa/edsc-timeline/workflows/CI/badge.svg?branch=master)
[![codecov](https://codecov.io/gh/nasa/edsc-timeline/branch/master/graph/badge.svg?token=KQNTU9DTFD)](https://codecov.io/gh/nasa/edsc-timeline)

Try out the [online demo](http://nasa.github.io/edsc-timeline/)

A React plugin implementing a timeline view of data, allowing
time range selection as well as keyboard and touch interaction
For a basic usage example and a testbed for changes,
see `example/src`

The edsc-timeline plugin was developed as a component of
[Earthdata Search](https://github.com/nasa/earthdata-search).

## Installation

    npm install @edsc/timeline

## Usage

After installing you can use the component in your code.

```javascript
import EDSCTimeline from '@edsc/timeline'

const Component = () => {
  const data = [
    {
      id: 'row1',
      title: 'Example title',
      intervals: [
        [
          new Date('2019-08-12').getTime(), // Start of the interval
          new Date('2019-12-20').getTime() // End of the interval
        ],
        [
          new Date('2020-01-04').getTime(),
          new Date('2020-05-20').getTime()
        ]
      ]
    }
  ]

  return (
    <EDSCTimeline
      data={data}
    />
  )
}
```

### Props

| Prop | Type | Required | Default Value | Description
| ---- |:----:|:--------:|:-------------:| -----------
data | array | true | | Array of rows to be displayed on the timeline
center | number | | new Date().getTime() | Center timestamp of the timeline
minZoom | number | | 1 | Minimum zoom level
maxZoom | number | | 5 | Maximum zoom level
zoom | number | | 3 | Active zoom level
temporalRange | object | | {} | Temporal range ({ start, end }) that is displayed on the timeline
focusedInterval | object | | {} | Focused interval ({ start, end }) that is displayed on the timeline
onFocusedSet | function | | | Callback function that returns the focused interval when it is set
onTemporalSet | function | | | Callback function that returns the temporal range when it is set
onTimelineMove | function | | | Callback function called when the timeline is moved
onTimelineMoveEnd | function | | | Callback function called when the timeline is finished moving
onArrowKeyPan | function | | | Callback function called when arrow keys are used to change the focused interval
onButtonPan | function | | | Callback function called when buttons are used to change the focused interval
onButtonZoom | function | | | Callback function called when buttons are used to change the zoom level
onDragPan | function | | | Callback function called when the timeline is panned using dragging
onFocusedIntervalClick | function | | | Callback function called when a focused interval is clicked
onScrollPan | function | | | Callback function called when the mouse wheel is used to pan the timeline
onScrollZoom | function | | | Callback function called when the mouse wheel is used to change the zoom level

### Callback function return value

Every callback function returns this object

```javascript
{
  center,
  focusedEnd,
  focusedStart,
  temporalEnd,
  temporalStart,
  timelineEnd,
  timelineStart,
  zoom
}
```

## Development

To compile:

    npm install

To start the example project for local testing:

    npm start

To run the Jest tests:

    npm test

To run the Cypress tests:

    npm run cypress:run

## Contributing

See CONTRIBUTING.md

## License

> Copyright © 2007-2014 United States Government as represented by the Administrator of the National Aeronautics and Space Administration. All Rights Reserved.
>
> Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
> You may obtain a copy of the License at
>
>    http://www.apache.org/licenses/LICENSE-2.0
>
>Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
>WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
