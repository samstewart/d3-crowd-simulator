Notes on time dependent shortest path:

Same algorithm as we currently have (via iteration):

Recursive definition:
shortest time to exit from node at iteration k = minimum over neighors of (time to neighbor (steps) + shortest time to exit from neighbor in world at (current time + travel time to neighbor) in iteration k - 1)

add "self loops" to allow waiting strategy (or just zero cost when computing minimum of waiting)

each node should have a list of costs, one for each time.

How to pick termination time? The article has some upper bounds but given our edge weight scheme, you shouldn't need more than the number of nodes. Should relate to length of longest possible path?

Convergence happens when you see two identical sets of predictions for all nodes. You can also just go until you hit the termination time.

 


