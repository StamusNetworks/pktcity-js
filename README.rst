=======
pktcity
=======

Test it
=======

Copy a alerts.data file containing JSON alerts events in the src directory, then ::

 cd src
 python -m SimpleHTTPServer 8000

You can now open http://localhost:8000/base.html

Concept
=======

Objective is to visualize interaction between systems in a network.
First modelization will cover the alerts.


Global design
=============

The big picture
---------------

On the plan we have the IP. The y scale is the time. y = 0 is current time. the higher we get the sooner
we are.

One IP is a shape (initialy is a cylinder) starting at time = now and finishing at initial time the IP has been seen.

Per network class representation
--------------------------------

We represent IP inside rectangular (plane). Each plane is a class C network, so we can put 256 addresses
on a plane. We use a simple position with a 16 x 16 partition of the plane and a position of IP from x = 0, z = 0
increment on x then increment on z.

We may have to limit this per network representation on assets. We possibly could have too much external netwotks.
In this case another mapping has to be used.
We could simply use a plane for non local IPs.

Per scene representation
------------------------

We sort the IP by their corresponding number.
We count the number of IPs and this defined the grid size, then we put the IP on the grid/plane.

This is simple and we will have IP of the same network in a pair of street.


Alert View Design
=================

An alert links the 2 IPs.  Path using source/target can be highlighted.

Implementation
==============

Algorithm
---------

Given a set of events we must:

* Do a pass to get each IP and get initial time.
* Loop on IPs, put them on the grid
* Loop on events that add them to the scene


Object Classes
---------------

We need an Network class.
