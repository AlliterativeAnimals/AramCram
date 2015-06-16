SHELL=/bin/bash
PASSWORD=swordfish
DIR=$(shell pwd)
NGINXPORT=8064
HOSTNAME=$(shell if hash boot2docker 2>/dev/null; then boot2docker ip; else echo localhost; fi)
UUID=$(shell uuidgen)
DEFAULTS=swordfish80645984$(shell if hash boot2docker 2>/dev/null; then boot2docker ip; else echo localhost; fi)

default: install start

install:
	@npm install; \
	${DIR}/node_modules/bower/bin/bower install;

start: gulp nginx useage

useage:
	@echo; \
    if test "${DEFAULTS}" == "${PASSWORD}${NGINXPORT}${HOSTNAME}" ; \
    then \
         echo "By default:"; \
    fi; \
    echo "Nginx is hosted on http://${HOSTNAME}:${NGINXPORT}";

gulp:
	@echo -n "Running gulp scripts..."; \
    rand=`uuidgen`; \
    node_modules/gulp/bin/gulp.js > /tmp/$${rand}_gulp 2>&1; \
    if [[ $$? -ne 0 ]]; \
    then \
        echo "ERR"; \
        cat /tmp/$${rand}_gulp; \
    else \
        echo "OK"; \
    fi; \
    touch /tmp/$${rand}_gulp; \
    rm /tmp/$${rand}_gulp;

nginx:
	@echo -n "Checking for nginx..."; \
	if ! docker ps | grep -q aramcramnginx; \
	then \
        echo "Not started"; \
		echo "Starting nginx..."; \
		docker run -d -p ${NGINXPORT}:80 -v ${DIR}/www:/usr/share/nginx/html:ro --name aramcramnginx nginx; \
	else \
        echo "OK"; \
	fi;

clean: clean-nginx

clean-nginx:
	@echo -n "Stopping nginx..."; \
    if docker ps | grep -q aramcramnginx; \
    then \
        docker stop aramcramnginx >/dev/null; \
        echo "OK"; \
    else \
        echo "Not started"; \
    fi; \
    echo -n "Removing nginx.."; \
    if docker ps -a | grep -q aramcramnginx; \
    then \
        docker rm aramcramnginx >/dev/null; \
        echo "OK"; \
    else \
        echo "Not found"; \
    fi; 
