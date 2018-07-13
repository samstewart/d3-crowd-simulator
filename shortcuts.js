function parse_coordinates(values) {
	var x_coords = values[0] == '*' ? all_node_indices() : parse_range(values[0]);
	var y_coords = values[1] == '*' ? all_node_indices() : parse_range(values[1]);
	
	return d3.cross(x_coords, y_coords, (n, m) => [n,m]);
}

function all_node_indices() {
	return d3.range(total_nodes());
}

function parse_range(range_str) {

	var endpoints = range_str.split('-').map(Number);
	if (endpoints.length == 2) {
		return d3.range(endpoints[0], endpoints[1] + 1);
	}
	
	// just one number
	return [ endpoints[0] ];
}

function random_node_subset(nodes, percentage) {
	var nodes = nodes[0];
	// two cases (this is a strange node.js design decision -- I should ask on the forums).
	// either single entry or list of entries. handle it.
	return chance.pickset(nodes, Math.round(percentage * set.length));
}

function total_nodes() {

	return all_nodes()[0].length;

}
function all_nodes() {

	return d3.selectAll('g g');

}

function ids_to_nodes(ids) {
	var ids = ids.map(d => d.toString());

	// kinda inefficient?
	// everything has to be converted to a string to filter this way. Better way might be to use <g> structure?
	return all_nodes().filter(function(d) {
		return ids.includes(d.index.toString())
	});
}

function rule_to_exec(rule, func, rules) {
	// makes a new rule to execute for a given match
	return {
		rule: rule,
		regex: RegExp('^' + rule.replace(/_|#/g, '(.*?)') + '$'), // thin layer on top of regex.
		matches: function(s) { 
			return this.regex.test(s); 
		},
		exec: function(s) {
			var matches = s.match(this.regex); 

			matches.splice(0, 1); // the first entry is just the whole string, *then* the capture groups. 

			var parsed_results = null;
			var processed_results = null;

			if (matches.length > 0) { // if we have any parameters

				var match_types = rule.match(/_|#/g) // the corresponding match type to every match 
				// where ever we find a #, feed back into the parser
				var matches_and_types = d3.zip(matches, match_types);
				parsed_results = matches_and_types.map(m => m[1] == '#' ? exec_rule_for_string(m[0], rules) : m[0] );
				processed_results = func(parsed_results);

			} else {
				processed_results = func();
			}

			return processed_results; 
		}

	};
}

function exec_rule_for_string(str, rules) {

	for (rule in rules) {

		rule = rule_to_exec(rule, rules[rule], rules); // turn into a rule object

		if (rule.matches(str)) {

			return rule.exec(str);
		}
	}

	return null;

}

// warning: there are confusing rules based on the greediness of the regex
//var rule = rule_to_exec('_% of #', values => console.log(values), rules);
//var result = rule.exec('20% of 1,2')

function n(node_descriptor) {
	// main method for querying nodes
	// 0,1 : node with x = 0 y = 1
	// 0-2,0-3 : nodes with x in range 0,2 and y in range 0,3
	// * or *,* : all nodes
	// *,0-3 or 0-3,* : nodes with any x coordinate and y in range 0,3, likewise for x
	// 20% of [any of the above] : random 20% subset of any of the above ranges
	// todo: use a real parser to create a real grammar?	
	var ids = null;

	
	// so now we have two languages, a meta and a node language! cool.
	// pattern matching engine
	// * : wild card for non-greedy match
	// # : do * match but then feed it into the rule system and return the results.
	var rules = {};

	// simon venmo
	rules[ '_,_' ] = values => ids_to_nodes( parse_coordinates(values) );
	rules[ 	'\\*' ] = values => d3.selectAll('g g'); // need to escape because valid regex
	rules[ 	'_% of #' ] = values => [ random_subset(values[1], Number(values[0]) / 100) ];
	rules[ '\\._'] = values => d3.selectAll('.' + values[0]);
	// TODO: add filtering by data attribute

	return exec_rule_for_string(node_descriptor, rules);
}

function nd(node_id) {
	var d = n(node_id).data();

	return d.length == 1 ? d[0] : d;
}
function dn(node_id) {
	n(node_id).each(delete_node);
}

function exit(node) {
	node.datum().distance = 0;
	node.datum().node_type = 'exit';

	compute_shortest_path_distances(nd('*'));

	update_node_classes();
	update_text();
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

	n('*').attr('class', d => d.node_type);

}
function update_text() {

	n('*').select('text').text(d => d.node_label());
}

var high = highlight_nodes;
var unhigh = unhighlight_nodes;
