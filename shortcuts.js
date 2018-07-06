function n(node_descriptor) {
	var ids = null;
	
	if (node_descriptor.constructor.name == "Number") {
		node_descriptor = "" + node_descriptor; // convert to string
	}

	// range of IDs
	if (node_descriptor.match(/-/)) {
		ids = node_descriptor.match(/\d+/g).map(Number);	
		ids = d3.range(ids[0], ids[1] + 1);
	}
	
	// list of ids
	if (node_descriptor.match(/,/)) {
		ids = node_descriptor.match(/\d+/g).map(Number);	
	}
	
	// all the nodes
	if (node_descriptor == '*') {
		return d3.selectAll('g');
	}
	
	// if nothing else, then a single id?
	if (node_descriptor.match(/^\d+$/)) {
		ids = [ Number(node_descriptor) ];
	}

	// a random choice of nodes within a range
	// syntax is: 2r1-5 where first number is percentage of range 
	if (node_descriptor.match(/r/)) {
		ids = node_descriptor.match(/\d+/g).map(Number);	
		var subset = ids[0];
		ids = d3.range(ids[1], ids[2] + 1);

		ids = chance.pickset(ids, Math.round(ids.length * subset / 100));
	}
	return d3.selectAll('g').filter(function(d) { return ids.includes(d.id); });
}
function dn(node_id) {
	delete_node(n(node_id))
}
function exit(node) {
	node.datum().distance = 0;
	node.datum().node_type = 'exit';

	update_node_classes();

	compute_shortest_path_distances(d3.selectAll('g').data());

	update_text();
}

function nd(node_id) {
	var d = n(node_id).data();

	return d.length == 1 ? d[0] : d;
}
function s(selector) {
	return d3.selectAll(selector);
}

function guys(nodes) {
	nodes.each(d => d.node_type = 'guy');

	update_node_classes();
}

function reset() {
	n('*').each(d => d.node_type = d.node_type == 'exit' ? 'exit' : 'empty');

	update_node_classes();
}
function update_node_classes() {

	d3.selectAll('g circle').attr('class', d => d.node_type);

}
function update_text() {

	s('g text').text(function(d) { return d.id + ' - ' + d.distance; })
}
var high = highlight_nodes;
var unhigh = unhighlight_nodes;
