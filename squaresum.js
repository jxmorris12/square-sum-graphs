// jack morris, 02/28/18, theta chi house

let borderStyle = '2px solid';

let max_square = 100; // graph max is max_square ** 2
let squares = [];
for(let i = 0; i <= max_square; i++) {
	squares.push(i * i);
}

// setup initial graph
let graph_max = 4;

let staticGraphElements = [
	// nodes
	{
		data: { id: '1' }
	},
	{
		data: { id: '3' }
	},
	{
		data: { id: '6' }
	},
	{
		data: { id: '8' }
	},
	{
		data: { id: '10' }
	},
	// edges
	{
		data: { id: '1-3', source: '1', target: '3' }
	},
	{
		data: { id: '1-8', source: '1', target: '8' }
	},
	{
		data: { id: '3-6', source: '3', target: '6' }
	},
	{
		data: { id: '6-10', source: '6', target: '10' }
	}
];

let elements = [
	// nodes
	{
		data: { id: '1' }
	},
	{
		data: { id: '2' }
	},
	{
		data: { id: '3' }
	},
	{
		data: { id: '4' }
	},
	// edges
	{
		data: { id: '1-3', source: '1', target: '3' }
	},
];

// https://stackoverflow.com/questions/9960908/permutations-in-javascript
var permutations = function(arr) {
    return (arr.length === 1) ? arr :
    arr.reduce((acc, cv, index) => {
        let remaining = [...arr];
        remaining.splice(index, 1);
        return acc.concat(permutations(remaining).map(a => [].concat(cv,a)));
    }, []);
}

var find_h_path = function() {
	// disable buttons and make border gray
	$('#square-sum-graph').css('border', `${borderStyle} gray`);
	$('#inc-graph-btn').prop('disabled', true);
	$('#h-path-btn').prop('disabled', true);
	// generate list of nodes
	let graphNodes = elements
		.filter(x => !x.data.source)
		.map(x => x.data.id);

	// generate all permutations
	let nodePermutations = permutations(graphNodes);

	// iterate through each permutation
	let pathFound = false;
	nodePermutations.forEach(permutation => {
		let valid = true;
		for(let i = 1; i < permutation.length; i++) {
			let edgeName1 = permutation[i-1] + '-' + permutation[i];
			let edgeName2 = permutation[i] + '-' + permutation[i-1];

			let someEdgesMatch = elements.some(x => x.data.id == edgeName1 || x.data.id == edgeName2);

			// no edge found between these nodes
			if(!someEdgesMatch) {
				console.log('failed', permutation.join(','));
				valid = false;
				break;
			}
		}


		if(valid) {
			// found a path!
			pathFound = true;
			$('#square-sum-graph').css('border', `${borderStyle} green`);
			$('#inc-graph-btn').prop('disabled', false);
			let pathText = `{${permutation.join(",")}}`;
			$('#h-path-text').text(pathText);
			return;
		}
	});

	if(!pathFound) {
		// if made it this far, no path exists
		$('#square-sum-graph').css('border', `${borderStyle} red`);
		$('#inc-graph-btn').prop('disabled', false);
		$('#h-path-text').text(`no path exists for graph_max=${graph_max}`);
	}
}

/*  

	// sample elements

	elements: [ // list of graph elements to start with
	    { // node a
	      data: { id: 'a' }
	    },
	    { // node b
	      data: { id: 'b' }
	    },
	    { // edge ab
	      data: { id: 'ab', source: 'a', target: 'b' }
	    }
	  ],

  */

// add a number to the graph and remake it
var increment_graph = function() {
	// add vertex
	let new_graph_max = graph_max + 1;
	let tsn = new_graph_max.toString();
	let newVertex = {
		data: { id: new_graph_max.toString() }
	};
	cy.add(newVertex);
	elements.push(newVertex);

	for(let i = 1; i <= graph_max; i++) {
		if(squares.includes(i + new_graph_max)) {
			// add edge
			let tsi = i.toString();
			let newEdgeName = tsi + '-' + tsn;
			let newEdge = {
				data: { id: newEdgeName, source: tsi, target: tsn }
			};
			cy.add(newEdge);
			elements.push(newEdge);
		}
	}

	// update graph fit & layout
	let newLayout = cy.layout({
		name: 'cose',
		animate: 'true'
	});
	newLayout.run();
	cy.fit();
	graph_max = new_graph_max;
	resetGraphMaxSpan();

	$('#square-sum-graph').css('border', '');
	$('#h-path-btn').prop('disabled', false);
}

function resetGraphMaxSpan() {
	$('#graph-max').text(`graph max: ${graph_max}`);
}

let layout = {
  name: 'cose',
  idealEdgeLength: 100,
  nodeOverlap: 20,
  refresh: 20,
  fit: true,
  padding: 30,
  randomize: false,
  componentSpacing: 100,
  nodeRepulsion: 400000,
  edgeElasticity: 100,
  nestingFactor: 5,
  gravity: 80,
  numIter: 1000,
  initialTemp: 200,
  coolingFactor: 0.95,
  minTemp: 1.0
};

// style info (stored)
let style = [ // the stylesheet for the graph
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        'label': 'data(id)'
      }
    },

    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle'
      }
    }
  ];


// initialize cytoscape.js for graphs
var cy = window.cy = cytoscape({
  container: $('#square-sum-graph'),

  layout: layout,
  style: style,
  elements: elements
});

// initialize cytoscape.js
var cy_static = cytoscape({
  container: $('#square-sum-graph-static'),
  layout: layout,
  style: style,
  elements: staticGraphElements,
  userZoomingEnabled: false,
  userPanningEnabled: false
});


resetGraphMaxSpan();