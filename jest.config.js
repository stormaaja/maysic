module.exports = {
  transform: { "^.+\\.ts?$": "ts-jest" },
  testEnvironment: "node",
  testRegex: "/tests/.*\\.(test|spec)?\\.ts$",
  moduleFileExtensions: ["ts", "js"],
  collectCoverageFrom: [
    "src/**/*.(js|ts)",
    "lib/**/{!(yyparse.js),}.(js|ts)"
  ]
}
