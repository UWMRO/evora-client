CFLAGS =	-Wall -I. -I/Users/eric/include -DHAVE_CFITSIO
LIBS		= -L /Users/eric/lib -lcfitsio -lcurl -lbz2 -lz  -ldl

RM =		rm -rf

all:		listhdu

All:		listhdu

listhdu:	listhdu.o
		$(CC) $(LDFLAGS) $(CFLAGS) -o $@ $+ $(LIBS)

listhdu.o:	listhdu.c
		$(CC) -c $(CFLAGS) -DLISTHDUMAIN $^ -o $@

clean:		FORCE
		@($(RM) *{.a,.so,.so.?,.so.?.?,.o,.dylib} \
		  listhdu \
		  *.exe core core.[0-9]* errs *pure* .nfs* \
		  foo* *~ *.log \#* TAGS *.E a.out errors \
		  gmon.out *.pg *.bak \
		  config.info config.log autom4te.cache *.dSYM;)

FORCE:
