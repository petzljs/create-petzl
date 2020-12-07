const path = require("path");
const fs = require("fs");
const { it } = require("quyz");
const dotProp = require("dot-prop");
const execa = require("execa");
const tempWrite = require("temp-write");
const createPetzl = require(".");
const assert = require("assert");

const { get } = dotProp;

const runWithoutInstall = async (packageJson, additionalOptions) => {
    const filePath = tempWrite.sync(
        JSON.stringify(packageJson),
        "package.json"
    );

    await createPetzl({
        cwd: path.dirname(filePath),
        skipInstall: true,
        ...additionalOptions,
    });

    return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

it("empty package.json", async () => {
    assert.strictEqual(
        get(await runWithoutInstall({}), "scripts.test"),
        "quyz"
    );
});

it("has scripts", async () => {
    const pkg = await runWithoutInstall({
        scripts: {
            start: "",
        },
    });

    assert.strictEqual(get(pkg, "scripts.test"), "quyz");
});

it("has default test", async () => {
    const pkg = await runWithoutInstall({
        scripts: {
            test: 'echo "Error: no test specified" && exit 1',
        },
    });

    assert.strictEqual(get(pkg, "scripts.test"), "quyz");
});

it("has only quyz", async () => {
    const pkg = await runWithoutInstall({
        scripts: {
            test: "quyz",
        },
    });

    assert.strictEqual(get(pkg, "scripts.test"), "quyz");
});

it("has test", async () => {
    const pkg = await runWithoutInstall({
        scripts: {
            test: "foo",
        },
    });

    assert.strictEqual(get(pkg, "scripts.test"), "foo && quyz");
});

it("has cli args", async () => {
    const args = ["--foo"];

    const pkg = await runWithoutInstall(
        {
            scripts: {
                start: "",
            },
        },
        { args }
    );

    assert.strictEqual(get(pkg, "scripts.test"), "quyz --foo");
});

it("has cli args and existing binary", async () => {
    const args = ["--foo", "--bar"];

    const pkg = await runWithoutInstall(
        {
            scripts: {
                test: "foo",
            },
        },
        { args }
    );

    assert.strictEqual(get(pkg, "scripts.test"), "foo && quyz --foo --bar");
});

it("does not remove empty dependency properties", async () => {
    const pkg = await runWithoutInstall({
        dependencies: {},
        devDependencies: {},
        optionalDependencies: {},
        peerDependencies: {},
    });

    assert(get(pkg, "dependencies"));
    assert(get(pkg, "devDependencies"));
    assert(get(pkg, "optionalDependencies"));
    assert(get(pkg, "peerDependencies"));
});

it("installs the petzl dependency", async () => {
    const filepath = tempWrite.sync(JSON.stringify({}), "package.json");

    await createPetzl({ cwd: path.dirname(filepath) });

    const installed = get(
        JSON.parse(fs.readFileSync(filepath, "utf8")),
        "devDependencies.petzl"
    );
    assert(installed);
    assert.strictEqual(installed.match(/^\^/).length, 1);
});

it("installs via yarn if there's a lockfile", async () => {
    const yarnLock = tempWrite.sync("", "yarn.lock");

    await createPetzl({ cwd: path.dirname(yarnLock) });

    assert.strictEqual(
        fs.readFileSync(yarnLock, "utf8").match(/^\^/).length,
        1
    );
});

it("invokes via cli", async () => {
    const cliFilepath = path.resolve(__dirname, "./cli.js");
    const filepath = tempWrite.sync(JSON.stringify({}), "package.json");
    await execa(cliFilepath, [], { cwd: path.dirname(filepath) });

    assert.strictEqual(
        get(JSON.parse(fs.readFileSync(filepath, "utf8")), "scripts.test"),
        "petzl"
    );
});

it("interprets cli arguments", async () => {
    const cliFilepath = path.resolve(__dirname, "./cli.js");
    const filepath = tempWrite.sync(JSON.stringify({}), "package.json");
    await execa(cliFilepath, ["--foo", "--bar"], {
        cwd: path.dirname(filepath),
    });

    assert.strictEqual(
        get(JSON.parse(fs.readFileSync(filepath, "utf8")), "scripts.test"),
        "petzl --foo --bar"
    );
});
