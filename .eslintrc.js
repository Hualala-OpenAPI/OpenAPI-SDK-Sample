module.exports = {
  plugins: ["prettier"],
  extends: ["airbnb", "alloy", "alloy/react", "plugin:prettier/recommended"],
  rules: {
    // 0禁止规则 1警告 2错误
    "no-nested-ternary": 0, // 禁止嵌套三元表达式
    "array-callback-return": 0, // 循环数组必须有返回值
    "no-var": "error", // 禁止使用 var
    "no-unused-vars": 0, // 关闭eslint的[禁止未使用的变量]
    "prefer-template": 2, // 建议使用模板文字而不是字符串连接
    "max-params": 0, // 方法参数不能>3个
    "no-return-assign": 0,
    "jsx-a11y/click-events-have-key-events": 0, // 强制可单击的非交互式元素至少具有一个键盘事件侦听器。
    "jsx-a11y/no-static-element-interactions": 0, // 强制具有单击处理程序的非交互式、可见元素(如<div>)使用role属性。
    "jsx-a11y/label-has-for": 0,
    "jsx-a11y/label-has-associated-control": 0,
    "jsx-a11y/no-noninteractive-element-interactions": 0,
    "prettier/prettier": [
      "error",
      {
        printWidth: 140, // 最大长度140个字符
        tabWidth: 2, // 缩进为2个空格
        useTabs: false, // 使用tab
        semi: true, // 末尾自动添加分号
        bracketSpacing: false,
        trailingComma: "none", // 结尾尾随逗号
        arrowParens: "avoid", // 尽可能省略括号
        singleQuote: false // 使用单引号而不是双引号。
      }
    ]
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  // 自动发现React的版本，从而进行规范react代码
  settings: {
    react: {
      pragma: "React",
      version: "detect"
    }
  },
  // 指定ESLint可以解析JSX语法
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  }
};
