x * deploy locally with comboserver

x srpl --setup				(one time only - install dependencies and/or make stubs)
x srpl --server
x srpl --build
x srpl --create @module@
x srpl --templates

srpl --docs

npm dependencies - 
comboserver
underscore/ejs

- simpleyui should be generated with build script, not by hand.
- use node-burrito to autogenerate manifests

setup instructions 

*install node*
you can install node in one of many ways
- use an installer, or get the source from http://nodejs.org/#download
- (mac) install brew (http://mxcl.github.com/homebrew/ ) and then $ > brew install node (recommended)
- (mac) install macports (http://mxcl.github.com/homebrew/ ) and then $ > port install nodejs
- (y!) http://twiki.corp.yahoo.com/view/Devel/NodeJS#Documentation (short version - $ > yinst install -branch current ynodejs

*install npm* 
- if you used an installer, no need for this
- else, http://npmjs.org/ (short version - $ > curl http://npmjs.org/install.sh | sh )

*extras*
- $ > brew install phantomjs
- $ > npm install grover -g
- $ > npm install jslint -g
- $ > npm install csslint -g
- you're now good to run tests/lint

*get the source*
- if you're reading this, you probably have it. else - svn co $ > svn+ssh://<SVN PATH>

*setup* 
- $ > cd srpl
- $ > npm install

*that's it!*
- to see all available options, $ > node scripts/srpl-js --help 

FUTURE :
x * tests via yuitest/grover/phantomjs - not yet done
x * templating engines supported: ejs (eventually - handlebars, etc) - future

x srpl --lint
x srpl --tests

srpl --mobify

yuitest/grover/phantomjs

- generate intl specific strings




