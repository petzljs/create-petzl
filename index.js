"use strict";
const path = require("path");
const execa = require("execa");
const hasYarn = require("has-yarn");
const readPkgUp = require("read-pkg-up");
const writePkg = require("write-pkg");

const DEFAULT_TEST_SCRIPT = 'echo "Error: no test specified" && exit 1';

module.exports = async (options = {}) => {
    const packageResult =
        readPkgUp.sync({
            cwd: options.cwd,
            normalize: false,
        }) || {};
    const packageJson = packageResult.package || {};
    const packagePath =
        packageResult.path ||
        path.resolve(options.cwd || process.cwd(), "package.json");
    const packageCwd = path.dirname(packagePath);
    const args = options.args || [];
    const cmd = "quyz" + (args.length > 0 ? " " + args.join(" ") : "");

    packageJson.scripts = packageJson.scripts ? packageJson.scripts : {};

    const s = packageJson.scripts;
    if (s.test && s.test !== DEFAULT_TEST_SCRIPT) {
        s.test = s.test.replace(/\bnode (test\/)?test\.js\b/, cmd);

        if (!/\bquyz\b/.test(s.test)) {
            s.test += ` && ${cmd}`;
        }
    } else {
        s.test = cmd;
    }

    writePkg.sync(packagePath, packageJson, { normalize: false });

    if (options.skipInstall) {
        return;
    }

    const quyzTag = "quyz";

    if (hasYarn(packageCwd)) {
        const yarnArguments = [
            "add",
            quyzTag,
            "--dev",
            "--ignore-workspace-root-check"
        ];

        try {
            await execa("yarn", yarnArguments, {
                cwd: packageCwd,
                stdio: "inherit",
            });
        } catch (error) {
            if (error.code === "ENOENT") {
                console.error(
                    "This project uses Yarn but you don't seem to have Yarn installed.\nRun `npm install --global yarn` to install it."
                );
                return;
            }

            throw error;
        }

        return;
    }

    const npmArguments = ["install", "--save-dev", quyzTag];

    await execa("npm", npmArguments, {
        cwd: packageCwd,
        stdio: "inherit",
    });
};
