module.exports = {
  extends: [
    "eslint:recommended", 
    "plugin:@typescript-eslint/recommended",
    "next",
    "prettier"
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ],
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-explicit-any": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}; 