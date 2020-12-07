#!/usr/bin/env node
"use strict";
const createQuyz = require(".");

const args = process.argv.slice(2);

createQuyz({ args });
