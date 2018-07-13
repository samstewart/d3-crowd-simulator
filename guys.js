
function move_guy_to_exit(node_data) {
	var new_guy = minNode(node_data, minNeighbor(node_data));  // we could stay put

	if (new_guy.node_type != 'guy' || new_guy.distance == 0) { // if we're moving to an exit, it's ok that there's a pile of guys 

		node_data.node_type = 'empty';
		new_guy.node_type = 'guy'; // this will turn an exit into a guy, but not a problem since we're just following the gradient field
		
	}
	
	update_node_classes()
}

function has_guys_away_from_exit() {

	return ! n('.guy').filter((d) => { return d.distance > 0; }).empty();

}


function move_guys_to_exit() {
	
	// track the types of the last nodes
	var last_state = n('*').data().map(d => d.node_type);

	if (has_guys_away_from_exit()) {
		
		n('.guy').each(move_guy_to_exit);

	} 

	return last_state;
}

