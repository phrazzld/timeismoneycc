/**
 * @jest-environment node
 */

import { log, LogLevel } from '../logger';

describe('Logger Module', () => {
  // Create spies for console methods
  let consoleDebugSpy: jest.SpyInstance;
  let consoleInfoSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Mock console methods before each test
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore original console methods after each test
    consoleDebugSpy.mockRestore();
    consoleInfoSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  test('calls appropriate console method based on log level', () => {
    // Call log with different levels
    log('debug', 'Debug message');
    log('info', 'Info message');
    log('warn', 'Warning message');
    log('error', 'Error message');

    // Verify each console method was called exactly once
    expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
    expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });

  test('formats log message as JSON with timestamp and level', () => {
    // Mock Date.toISOString to return a fixed timestamp for testing
    const mockDate = new Date('2023-01-01T12:00:00Z');
    const mockTimestamp = mockDate.toISOString();

    // Save original Date constructor
    const OriginalDate = global.Date;

    // Replace Date constructor with a function that returns our mock date
    global.Date = jest.fn(() => mockDate) as unknown as typeof Date;

    // Maintain static methods
    global.Date.UTC = OriginalDate.UTC;
    global.Date.parse = OriginalDate.parse;
    global.Date.now = OriginalDate.now;

    // Log a simple message
    log('info', 'Test message');

    // Get the argument passed to console.info
    const loggedValue = consoleInfoSpy.mock.calls[0][0];

    // Parse the JSON string back to an object for easier assertion
    const parsedLog = JSON.parse(loggedValue);

    // Assert log structure is correct
    expect(parsedLog).toEqual({
      timestamp: mockTimestamp,
      level: 'info',
      message: 'Test message',
    });

    // Restore original Date constructor
    global.Date = OriginalDate;
  });

  test('includes additional context in log output', () => {
    // Create a context object with various fields
    const context = {
      component: 'TestComponent',
      correlationId: 'abc-123',
      userId: 42,
      customField: 'custom value',
    };

    // Log with context
    log('error', 'Error with context', context);

    // Get the argument passed to console.error
    const loggedValue = consoleErrorSpy.mock.calls[0][0];

    // Parse the JSON string back to an object
    const parsedLog = JSON.parse(loggedValue);

    // Assert context fields are included
    expect(parsedLog).toMatchObject({
      level: 'error',
      message: 'Error with context',
      component: 'TestComponent',
      correlationId: 'abc-123',
      userId: 42,
      customField: 'custom value',
    });
  });

  test('works with all log levels', () => {
    // Define all possible log levels
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];

    // Test each level
    levels.forEach((level) => {
      log(level, `${level} level message`);

      // Get the corresponding console spy
      const spy = {
        debug: consoleDebugSpy,
        info: consoleInfoSpy,
        warn: consoleWarnSpy,
        error: consoleErrorSpy,
      }[level];

      // Verify it was called with the correct level in the JSON
      const loggedValue = spy.mock.calls[0][0];
      const parsedLog = JSON.parse(loggedValue);

      expect(parsedLog.level).toBe(level);

      // Reset the spy for the next test
      spy.mockClear();
    });
  });
});
