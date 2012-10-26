
DIR_DIST=./dist
DIR_SRC=./src
DIR_UTIL=./util

GETMETA=$(DIR_UTIL)/getmeta
MKNAME=$(DIR_UTIL)/mkname
COMPRESS=$(DIR_UTIL)/compress

SRC=$(DIR_SRC)/main-dev.user.js
OUT=$(DIR_DIST)/`$(MKNAME) $(SRC)`
LATEST=$(DIR_DIST)/latest

default:
	$(COMPRESS) $(SRC) > $(OUT)
	cp $(OUT) $(LATEST).user.js
	$(GETMETA) $(LATEST).user.js > $(LATEST).meta.js
