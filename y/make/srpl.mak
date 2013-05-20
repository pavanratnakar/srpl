#-----------------------------------------------------------------------------
# SRPL (onebox, et al)
# assumption is you're running this at maps root dir
#-----------------------------------------------------------------------------

SRPL_ENV ?= ydev

SRPL_BASE := $(SRCTOP)/srpl/
SRPL_TARGET := /home/y/share/htdocs/static.srpl/


# not sure about these...
SRPL_BUILD := $(SRPL_TMP)build/
SRPL_SRC := $(SRPL_TMP)src/
SRPL_SAMPLES := $(SRPL_TMP)samples/


SRPL_build:
	#[ -e /home/y/bin/node ] || $(YINST_BIN) install -branch current ynodejs06
	# cd $(SRPL_BASE); exec /home/y/bin/node --file_accessdir=$(SRPL_BASE) --open_basedir=$(SRPL_BASE) scripts/srpl.js -build --env $(SRPL_ENV)
	# todo - builds for ALL environments
	$(YROOT_BIN) $(YROOT_RUNTIME) --cmd 'sudo rm -rf $(SRPL_TARGET)'
	$(YROOT_BIN) $(YROOT_RUNTIME) --cmd 'sudo mkdir $(SRPL_TARGET)'
	$(YROOT_BIN) $(YROOT_RUNTIME) --cmd 'cd $(SRPL_TARGET); sudo ln -s $(SRPL_BASE)build/'
	$(YROOT_BIN) $(YROOT_RUNTIME) --cmd 'cd $(SRPL_TARGET); sudo ln -s $(SRPL_BASE)src/'