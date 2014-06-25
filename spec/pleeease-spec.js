// Jasmine unit tests
// To run tests, run these commands from the project root:
// 1. `npm test`

'use strict';
var fs       = require('fs'),
    pleeease = require('../lib/'),
    options  = require('../lib/options');

var __dir    = 'spec/files/cases/';

var test     = function (name, opts) {
  if (typeof opts === undefined) {
    opts = options;
  }
  // css
  var css = fs.readFileSync(__dir + name + '.css', 'utf-8');
  var expected = fs.readFileSync(__dir + name + '.out.css', 'utf-8');

  // process
  var processed = pleeease.process(css, opts);

  expect(processed).toBe(expected);
}

beforeEach(function() {
  options.optimizers.minifier = false;
});

describe('pleeease', function () {

  it('should minify when asked', function() {
    //css
    var css = '.elem {\n' +
            'color: #f39;\n' +
        '}';
    var expected = '.elem{color:#f39}';
    // options
    options.optimizers.minifier = true;
    // process
    var processed = pleeease.process(css, options);

    expect(processed).toBe(expected);
  });

  it('should generate -webkit- prefixes for calc() (support iOS6)', function () {

    // options
    options.fallbacks.autoprefixer = ['iOS 6'];
    test('prefixes', options);

  });

  it('should evaluate variables', function () {

    // options
    options.fallbacks.autoprefixer = false;
    test('variables', options);

  });

  it('should replace pseudo-elements syntax', function () {

    test('pseudoElements');

  });

  it('should combine media-queries', function () {

    // options
    options.optimizers.minifier = true;
    test('mq', options);

  });

  it('should combine files with imports', function() {
    var compile = function (inputs, options) {
      // get inputs files
      var CSS = inputs.map(function(input) {
        return fs.readFileSync(input).toString();
      });
      // options
      options.fallbacks.autoprefixer = true;
      options.optimizers.minifier = true;
      options.optimizers.import = __dir;
      // fixed CSS
      return pleeease.process(CSS.join('\n'), options);
    };

    options.in = [__dir + 'import.css', __dir + 'mq.css'];

    // process
    var processed = compile(options.in, options);
    var expected = fs.readFileSync(__dir + 'import.out.css').toString();

    expect(processed).toBe(expected);
  });

});
