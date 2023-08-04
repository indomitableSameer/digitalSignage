CC = g++
CFLAGS = -O3
LDFLAGS =
appname = player

all: $(appname)
clean:
	rm -f $(appname) *.o
.PHONY: all clean

sdl_cflags := $(shell pkg-config --cflags sdl2 SDL2_image)
sdl_libs := $(shell pkg-config --libs sdl2 SDL2_image)
override CFLAGS += $(sdl_cflags)
override LIBS += $(sdl_libs)
#override LIBS += -lavcodec -lavformat -lavutil -lswscale -lswresample 

$(appname): player.o
	$(CC) $(LDFLAGS) -o $@ $^ $(LIBS)
