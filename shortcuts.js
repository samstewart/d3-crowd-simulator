
function n(node_descriptor) {
	// main method for querying nodes
	// 0,1 : node with x = 0 y = 1
	// 0-2,0-3 : nodes with x in range 0,2 and y in range 0,3
	// * or *,* : all nodes
	// *,0-3 or 0-3,* : nodes with any x coordinate and y in range 0,3, likewise for x
	// 20% of [any of the above] : random 20% subset of any of the above ranges
	// todo: use a real parser to create a real grammar?	
	var ids = null;

	function parse_coordinates(values) {
		return d3.cross(parse_range(values[0]), parse_range(values[1]), (n, m) => [n,m].toString());
	}

	function random_node_subset(nodes, percentage) {
		var nodes = nodes[0];
		// two cases (this is a strange node.js design decision -- I should ask on the forums).
		// either single entry or list of entries. handle it.
		return chance.pickset(nodes, Math.round(percentage * set.length);
	}
	
	function ids_to_nodes(ids) {
		// kinda inefficient?
		d3.selectAll('g g').filter(d => ids.includes(d.index));
	}

	function exec_rule_for_string(str, rules) {
		
	}
	// so now we have two languages, a meta and a node language! cool.
	// pattern matching engine
	// * : wild card for non-greedy match
	// # : do * match but then feed it into the rule system and return the results.
	var rules = { 
		'*,*' : values => [ ids_to_nodes(parse_coordinates(values)) ],
		'\*' : values => d3.selectAll('g g'),
		'*% of #' : values => [ random_subset(values[1], Number(values[0]) / 100) ]
	}

	return exec_rule_for_string(node_descriptor, rules);
}

function dn(node_id) {
	n(node_id).each(delete_node);
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
