RM =		rm -rf

OBJS =		jsfitsio.o healpix.o idx.o
CFLAGS =	-Wall -I. -I/Users/eric/include -DHAVE_CFITSIO
LIBS		= -L /Users/eric/lib -lcfitsio -lcurl -lbz2 -lz  -ldl

all:		listhdu evcube

All:		listhdu evcube mkidx sortidx

listhdu:	listhdu.o $(OBJS)
		$(CC) $(LDFLAGS) $(CFLAGS) -o $@ $+ $(LIBS)

evcube:		evcube.o $(OBJS)
		$(CC) $(CFLAGS) $^ -o $@ $(LDFLAGS) $(LIBS)

mkidx:		mkidx.o
		$(CC) $(CFLAGS) $^ -o $@ $(LDFLAGS) $(LIBS)

sortidx:	sortidx.o
		$(CC) $(CFLAGS) $^ -o $@ $(LDFLAGS) $(LIBS)

listhdu.o:	listhdu.c
		$(CC) -c $(CFLAGS) -DLISTHDUMAIN $^ -o $@

tfits:		tfits.o $(OBJS)
		$(CC) $(CFLAGS) $^ -o $@ $(LDFLAGS) $(LIBS)

Makefile:	Makefile.in
		@(if [ -f config.status ] ; then 			\
			$(SHELL) config.status;      			\
		fi)

clean:		FORCE
		@($(RM) *{.a,.so,.so.?,.so.?.?,.o,.dylib} \
		  listhdu mkidx sortidx evcube tfits \
		  *.exe core core.[0-9]* errs *pure* .nfs* \
		  foo* *~ *.log \#* TAGS *.E a.out errors \
		  gmon.out *.pg *.bak \
		  config.info config.log autom4te.cache *.dSYM;)

FORCE:
