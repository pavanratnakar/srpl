YUI.add('<%= namespace %>-<%= module %>-assets', function(Y){
	/* DO NOT EDIT MANUALLY . --build should generate this */
	Y.namespace('<%= namespace %>._assets');
	Y.myc._assets["<%= module %>"] = <%= JSON.stringify(assets, null, '    ') || '{}' %>;
},'@VERSION@',{requires:['oop']});