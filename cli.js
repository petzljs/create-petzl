#!/usr/bin/env node
"use strict";
const createPetzl = require(".");

const args = process.argv.slice(2);

createPetzl({ args });
