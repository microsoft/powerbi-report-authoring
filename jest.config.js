module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: [
    'js',
    'ts',
    'json',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverage: true,
  coverageReporters: ['cobertura', 'text-summary'],
  coverageDirectory: 'coverage',
  reporters: [
      'default',
      [
          'jest-junit',
          {
              suiteName: 'Powerbi client vue js tests',
              outputDirectory: './test-results',
              outputName: 'test-results.xml'
          },
      ],
  ]
}