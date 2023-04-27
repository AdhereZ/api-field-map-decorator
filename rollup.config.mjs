import resolve from '@rollup/plugin-node-resolve'; // 解析 node_modules 中的依赖
import commonjs from '@rollup/plugin-commonjs'; // 将 CommonJS 模块转换成 ES6 模块
import json from '@rollup/plugin-json'; // 将 JSON 文件转换成 ES6 模块
import terser from '@rollup/plugin-terser'; // 压缩代码
import size from 'rollup-plugin-sizes'; // 在控制台中显示包的大小信息
import esbuild from 'rollup-plugin-esbuild'; // 使用 esbuild 编译 TypeScript 或 JavaScript
import nodePolyfills from 'rollup-plugin-polyfill-node'; // 提供 Node.js 环境的 polyfill

export default [
  {
    input: `src/index.ts`, // 入口文件路径
    output: {
      name: `TYPE_JSON_MAPPER`, // UMD 模块的全局变量名称
      file: 'dist/index.umd.js', // 输出文件路径
      format: 'umd', // 模块格式
      footer: '/* follow me on Github! @LuciferHuang */', // 在输出文件末尾添加注释
    },
    plugins: [
      esbuild({
        include: /\.[jt]sx?$/, // 需要处理的文件扩展名
        exclude: /node_modules/, // 不需要处理的文件夹路径
        minify: process.env.NODE_ENV === 'production', // 是否压缩代码
        target: 'es2015', // 编译的目标 JavaScript 版本
        jsx: 'transform', // 支持 JSX 语法
        jsxFactory: 'React.createElement', // 指定 React.createElement 方法的名称
        jsxFragment: 'React.Fragment', // 指定 React.Fragment 的名称
        define: {
          __VERSION__: '"x,y,z"', // 定义全局变量 __VERSION__
        },
        tsconfig: 'tsconfig.json', // TypeScript 配置文件路径
        loaders: {
          '.json': 'json', // 使用 json-loader 加载 JSON 文件
          '.js': 'jsx', // 使用 jsx-loader 加载 JavaScript 文件
        },
      }), // 可以用于编译typescript
      resolve(), // 解析第三方依赖
      commonjs(), // 将 CommonJS 模块转换成 ES6 模块，有些导入的模块可能是cjs写的，rollup只能处理es6
      nodePolyfills(), // 提供 Node.js 环境的 polyfill
      json(), // 将 JSON 文件转换成 ES6 模块
      size(), // 在控制台中显示包的大小信息
      terser(), // 压缩代码
    ],
  },
];
