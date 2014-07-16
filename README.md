nino
====

Command line tool for arduino.  This is a standalone project, so the Arduino IDE is *not* required.

**warning**:  This is not yet a 1.0 release.  It should not be considered stable.  Right now only 64 bit Mac is supported.

### Commands

``` code
$ nino init
```

Create a new nino project.  This command will set up the correct directory structure in the current directory.


``` code
$ nino build
```

Build the sketch in your src/ folder.  This will look for a main file called driver.c.  Alternatively, you can pass in the name of the main file of your project.


``` code
$ nino clean
```

Delete all files in the bin/ directory.


``` code
$ nino upload
```

This command will look for a connected arduino and upload the compiled sketch in the bin/ directory, unless a different sketch name is passed in.

``` code
$ nino serial
```

This command will find a connected arduino device and log whatever it sends in over serial.


``` code
$ nino list
```

List all Arduino devices currently connected to your computer.


``` code
$ nino erase
```

Clear the sketch currently on the connected Arduino device.
