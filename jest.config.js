module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js'
  ],
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/static/src/js/util/mocks/fileMock.js',
    '^.+\\.(css|less|scss)$': 'babel-jest'
  },
  coveragePathIgnorePatterns: [
    'package.json',
    'package-lock.json',
    'src/css'
  ],
  testPathIgnorePatterns: [
    'mocks.js'
  ]
}
