<h1>Earthdata Search Components:<br>Timeline</h1>

A jQuery plugin implementing a timeline view of data, allowing
time range selection as well as keyboard and touch interaction
For a basic usage example and a testbed for changes,
see demo/index.html

The edsc-timeline plugin was developed as a component of
[Earthdata Search](https://github.com/nasa/earthdata-search).

## Installation

Copy the contents of the `dist/` folder to your site. Include jQuery,
the Javascript, and the CSS on a page, for instance:

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
    <script src="edsc-timeline/js/edsc-timeline.min.js"></script>
    <link rel="stylesheet" href="edsc-timeline/css/edsc-timeline.css">

## Developing

### Building

To compile assets for exporting you'll need to do the following:
Download & install the installation package for node and npm from http://nodejs.org/ (it's one package for both npm and node.js)

Then set up your npm repo list with the latest files:

    $ cd /path/to/plugin/source/
    $ npm install

make sure `./node_modules/.bin` and `/usr/local/bin` are in your path.

To compile:

    $ gulp

To watch for filesystem changes and rebuild automatically:

    $ gulp watch

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
