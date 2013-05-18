# Requires
watchr = require("#{__dirname}/../lib/watchr.coffee")
assert = require('assert')
balUtil = require('bal-util')
path = require('path')
fs = require('fs')

# =====================================
# Configuration

# Test Data
outPath = "#{__dirname}/out"
writetree =
	'a': 'a content'
	'b':
		'b-a': 'b-a content'
		'b-b': 'b-b content'
	'.c':
		'c-a': 'c-a content'


# =====================================
# Tests

# -------------------------------------
# Watchr

describe 'watchr', ->
	it 'should work as expected', (done) ->
		# Prepare
		@timeout(11000)
		changesExpected = 2
		changesActual = 0
		testsHappened = false

		# Timeout
		setTimeout(
			->
				assert.equal changesActual, changesExpected, "#{changesActual} changes ran out of #{changesExpected} changes"
				done()
			10000
		)

		# Prepare handlers
		changeHappened = ->
			changesActual++

		# Write test files
		balUtil.writetree outPath, writetree, (err) ->
			throw err  if err

			# Start watching
			watchr.watch outPath, changeHappened, ->
				# Watching is now setup

				# Change a file
				filePath = "#{outPath}/a"
				fs.writeFile filePath, 'a content modified', (err) ->
					throw err  if err

					# Change a sub file
					filePath = "#{outPath}/b/b-a"
					fs.writeFile filePath, 'b-a content modified', (err) ->
						throw err  if err
							
						# Change a hidden file
						filePath = "#{outPath}/.c/c-a"
						fs.writeFile filePath, 'c-a content modified', (err) ->
							throw err  if err
