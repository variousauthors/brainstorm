import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";
import alias from '@rollup/plugin-alias';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import path from 'path'

const packageJson = require("./package.json");
const projectRootDir = path.resolve(__dirname);

console.log(path.resolve(projectRootDir, 'src/common'))

export default [
    {
        input: "src/index.ts",
        output: {
            file: packageJson.module,
            name: 'brainstorm',
            format: "umd",
            sourcemap: true,
        },
        plugins: [
            alias({
                resolve: ['.ts', '.tsx'],
                entries: [
                    { find: '@common', replacement: path.resolve(projectRootDir, 'src/common') }
                ]
            }),
            peerDepsExternal(),
            resolve(),
            typescript({ tsconfig: "./tsconfig.build.json" }),
            terser(),
        ],
        external: ["react", "react-dom", "styled-components"]
    },
    {
        input: "dist/types/index.d.ts",
        output: [{ file: "dist/index.d.ts", format: "esm" }],
        plugins: [dts()],
    },
];