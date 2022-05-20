module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  plugins: ["@typescript-eslint", "react"],
  parser: "@typescript-eslint/parser",
  rules: {
    "react/prop-types": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "react/display-name": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/no-explicit-any": "off",
    "react/react-in-jsx-scope": "off"
  },
  ignorePatterns: ["**/*rc.js", "**/*.config.js"]
};
