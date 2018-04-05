/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// [START app]
const express = require('express');
const _ = require('lodash');
const bodyParser = require("body-parser");

const handler = (req, res) => {
    try{
        let body = JSON.parse(_.get(req, 'body'));
        console.log('request body ------------- ' + JSON.stringify(body));
        let payload = _.get(body, 'payload');
        if(payload && _.isArray(payload)){
            let filteredItems = _.filter(payload, (item) => {
                return _.get(item, 'drm') === true && _.get(item, 'episodeCount') > 0;
            });
            let mappedItems = _.map(filteredItems, (item) => {
                return {
                    image: _.get(item, 'image.showImage'),
                    slug: _.get(item, 'slug'),
                    title: _.get(item, 'title')
                }
            });
            res.status(200).json({
                response: mappedItems
            }).end();
            return;
        }

        res.status(200).json({
            response: []
        }).end();
    } catch (err) {
        console.log('parse failed, request body --------- ' + _.get(req, 'body'));
        res.status(400).json({
            "error": "Could not decode request: JSON parsing failed"
        }).end();
    }
};


const app = express();
app.use(bodyParser.text({type: '*/*'}));
app.post('/', handler);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
