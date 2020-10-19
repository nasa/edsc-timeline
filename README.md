<h1>Earthdata Search Components:<br>Timeline</h1>

[![Build Status](https://travis-ci.org/nasa/edsc-timeline.svg?branch=master)](https://travis-ci.org/nasa/edsc-timeline)

A jQuery plugin implementing a timeline view of data, allowing
time range selection as well as keyboard and touch interaction
For a basic usage example and a testbed for changes,
see demo/index.html

The edsc-timeline plugin was developed as a component of
[Earthdata Search](https://github.com/nasa/earthdata-search).

## Installation

    npm install @edsc/timeline

You will also need to include jQuery, for instance:

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/3.5.0/jquery.min.js"></script>


## Usage

Open example/index.html in a browser for an example of configuring and using the plugin.

### Creating a timeline

To create a timeline, call the jQuery plugin on an empty element

```html
<div id="timeline"></div>
```

```js
$('#timeline').timeline()
```

By default the timeline will hide itself when it has no rows and show itself when it has
rows, so the timeline above will not be visible. You can change this behavior using the
autoHide option when constructing the timeline.

```js
$('#timeline').timeline({autoHide: false})
```

You can always manually instruct the timeline to show or hide

```js
$('#timeline').timeline('show')
$('#timeline').timeline('hide')
```

To set the timeline's rows, call the `rows` method, passing an array of row data objects.
Row data objects have the following format:

```javascript
var row = {
  id: "examplerow1",      // Unique string used to identify the row
  title: "Example row 1", // Human-readable string used to label the row
  min: new Date(0) / 1000,// Earliest unix timestamp for which the row has data
  max: new Date() / 1000, // Latest unix timestamp for which the row has data
  color: '#ff0000'        // (Optional) Hex color to use for the row's data
};

$('#timeline').timeline('rows', [row]); // Set the rows
```

The final step in setting up the timeline is to supply data to its rows. This is done
using the `data` method, passing in a row ID and a data object. Data objects have the
following format.


```javascript
var data = {
  start: new Date(2015, 01) / 1000, // UNIX timestamp of the start of the data
  end: new Date() / 1000,         // UNIX timestamp of the end of the data
  resolution: 'day',              // Time resolution of the data, "minute", "hour", "day", "month", or "year"
  intervals: [                    // Array of arrays of UNIX timestamps corresponding to
                                  // [start, end] intervals where data is present.
    [new Date(2015, 04) / 1000, new Date(2015, 05) / 1000],
    [new Date(2015, 06) / 1000, new Date() / 1000]
  ]
};

$('#timeline').timeline('data', 'examplerow1', data); // Set the row data for examplerow1
```

Though it is inconvenient to divide dates by 1000 when configuring the timeline by hand,
the data format is designed to be convient to produce when using the
[CMR](https://cmr.earthdata.nasa.gov/)'s timeline API. The CMR uses UNIX timestamps for
both its query ranges and its interval responses, so those are used in the data format.
Similarly, the `resolution` field corresponds to the timeline CMR's query values.

### Temporal selection and focused timespan

Two related and potentially confusing concepts are **temporal selection** and **focused timespans**.

Temporal selection corresponds to an arbitrary timespan that the user has restricted
results to fall within. Timeline users can select a single temporal selection by dragging
the mouse across the top part of the timeline and clear the selection by clicking on the top
of the timeline; however, the selected timespans can be set to multiple values and even
row-specific values programmatically. The timeline denotes temporal selection by shading a red
area between two fenceposts. Temporal selection allows the timeline to display complex queries
and allows users to provide ranges that do not fit cleanly within single hour, day, month, etc
boundaries.

By contrast, focused timespans provide a simple, easy means of selection and navigation.
Users select a timespan by clicking a date and and can use the keyboard arrows to navigate between
focused timespans, allowing them to quickly navigate different times.

Note that these two concepts can work together. Users can make a temporal selection and then
focus on dates within that selection. The timeline prevents users from focusing dates that
lie completely outside the temporal selection.

### Methods

The following methods are available as jQuery plugin methods by calling

```javascript
$timeline.timeline(methodName, arg0, arg1, ...)
```

#### show

**Arguments:** None

**Return:** jQuery object

Shows the timeline, ignoring any autoHide behavior


#### hide

**Arguments:** None

**Return:** jQuery object

Hides the timeline, ignoring any autoHide behavior

#### destroy

**Arguments:** None

**Return:** jQuery object

Removes the timeline from the DOM and cleans up its resources

#### startTime

**Arguments:** None

**Return:** The timestamp of the left edge of the timeline

#### endTime

**Arguments:** None

**Return:** The timestamp of the right edge of the timeline

#### rows

**Arguments:**

  * `rows`: An array of row objects corresponding to the timeline's rows. See above examples for row format.

**Return:** jQuery object

Sets the rows to be displayed on the timeline, in order from top to bottom

#### data

**Arguments:**

  * `id`: The ID of the row whose data is being set
  * `data`: The data for the row. See the data format in the examples above.

**Return:** jQuery object

Sets the data for the given row

#### zoomIn

**Arguments:** None

**Return:** jQuery object

Zooms in one level, if possible, otherwise does nothing.

#### zoomOut

**Arguments:** None

**Return:** jQuery object

Zooms out one level, if possible, otherwise does nothing

#### zoom

**Arguments:**

  * `value`: (Optional) The desired zoom level, 2-6

**Return:** The current zoom level

If supplied an argument, zooms to the desired level, or as close as possible if
the given level is out of range. Numeric zoom levels 2-6 correspond to day, month,
year, decade, and 5-decade timespans. Zooming into the day level will cause a single
day to span the full width of the timeline. Note that months, years, and decades
vary in size, so the exact width should be considered approximate.

#### center

**Arguments:**

  * `value`: (Optional) Javascript date object or timestamp on which to center the timeline

**Return:** The current center of the timeline

If supplied an argument, centers the timeline on the given date

#### focus

**Arguments:**

  * `t0`: The start date of the timespan to focus
  * `t1`: The end date of the timespan to focus

**Return:** jQuery object

Focuses the given timespan. Pass null or no arguments to clear the focused timespan.
See the section "Temporal selection and focused timespan" for more details on focused
timespans.

#### setTemporal

**Arguments:**

  * `ranges`: An array of arrays containing two UNIX timestamps that correspond to start and end dates of a temporal selection

**Return:** jQuery object

Sets the global temporal selection. This will be used as the default for any row
which has not had its temporal set using `setRowTemporal`. See the section
"Temporal selection and focused timespan" for more details on temporal selections.

#### setRowTemporal

**Arguments:**

  * `id`: The ID of the row whose temporal selections should be set
  * `ranges`: An array of arrays containing two UNIX timestamps that correspond to start and end dates of a temporal selection

**Return:** jQuery object

Sets the temporal selection for the given row. Because of the potential user confusion
prefer to set global temporal using `setTemporal` when possible. See the section
"Temporal selection and focused timespan" for more details on temporal selections.

#### loadstart

**Arguments:**

 * `id`: The ID of the row being loaded

**Return:** jQuery object

Notifies the timeline that the row with the given ID is being reloaded, allowing
it to update the display to accordingly

### Events

The following jQuery events are triggered on the timeline's root element by various
actions within the timeline

#### rangechange.timeline

**Arguments:**

  * `event`: The triggering jQuery event object
  * `start`: The start date of the new timeline range
  * `end`: The end date of the new timeline range

Triggered when the visible range of the timeline changes. Applications will typically
want to listen to this event in order to fetch more data. The start and end arguments
represent a timespan that is somewhat larger than the actual visible area, to allow
users to see data immedately when scrolling a small amount.

Note: this event may be triggered many as the user scrolls, so we recomment throttling
web requests.

#### temporalset.timeline

**Arguments:**

  * `event`: The triggering jQuery event object
  * `start`: The start date of the new temporal selection
  * `end`: The end date of the new temporal selection

Triggered when the user sets a new temporal range through the timeline interface

Note: this is not called when setting the temporal range programmatically

#### temporalremove.timeline

**Arguments:**

  * `event`: The triggering jQuery event object

Triggered when the user clears the selected temporal range through the timeline interface

Note: this is not called when setting the temporal range programmatically

#### temporalchange.timeline

**Arguments:**

  * `event`: The triggering jQuery event object
  * `start`: The start date of the new temporal selection, or undefined if temporal has been cleared
  * `end`: The end date of the new temporal selection, or undefined if temporal has been cleared

Triggered when the user changes the selected temporal range through the timeline interface, by
either setting it or clearing it.

Note: this is not called when setting the temporal range programmatically

#### focusset.timeline

**Arguments:**

  * `event`: The triggering jQuery event object
  * `start`: The start date of the new focused timespan
  * `end`: The end date of the new focused timespan

Triggered when the timeline's focused timespan is set

#### focusremove.timeline

**Arguments:**

  * `event`: The triggering jQuery event object

Triggered when the timeline's focused timespan is cleared

#### focuschange.timeline

**Arguments:**

  * `event`: The triggering jQuery event object
  * `start`: The start date of the new focused timespan, or undefined if focus has been cleared
  * `end`: The end date of the new focused timespan, or undefined if focus has been cleared

Triggered when the timeline's focused timespan changes by either being set or cleared

## Developing

To compile assets for exporting you'll need to do the following:

Download & install the installation package for node and npm from http://nodejs.org/

Make sure `./node_modules/.bin` and `/usr/local/bin` are in your path.

To compile:

    $ npm install

To watch for filesystem changes and rebuild automatically:

    $ npm start

To run the test suite

    $ npm test

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
