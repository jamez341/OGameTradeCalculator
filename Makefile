
DIR_DIST = ./dist
DIR_SRC  = ./src
DIR_UTIL = ./util

GETMETA  = $(DIR_UTIL)/getmeta
MKNAME   = $(DIR_UTIL)/mkname
COMPRESS = $(DIR_UTIL)/compress

SRC = $(DIR_SRC)/main-dev.user.js
OUT = $(DIR_DIST)/`$(MKNAME) $(SRC)`
LATEST_USER = $(DIR_DIST)/latest.user.js
LATEST_META = $(DIR_DIST)/latest.meta.js
LATEST = $(LATEST_USER) $(LATEST_META)

$(LATEST): $(SRC)
	$(GETMETA) $(SRC) > $(LATEST_META)
	$(COMPRESS) $(SRC) > $(OUT)
	cp $(OUT) $(LATEST_USER)
	git add $(OUT)

commit:
	git commit -a

push: commit
	git push

default: $(LATEST)
