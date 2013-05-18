YUI.add('<%=module%>-view-tests', function(Y){
	Y.Test.Runner.add(new Y.Test.Case({
		name:'Basic <%=MODULE%>View Tests',
		'should be initialized properly': function(){

		},
		'should be detroyed properly': function(){

		}
	}));
}, '@VERSION', {
	requires:['test', '<%=module%>-view']
});

YUI.add('<%=module%>-model-tests', function(Y){
	Y.Test.Runner.add(new Y.Test.Case({
		name:'Basic <%=MODULE%>Model Tests',
		'should be initialized properly': function(){

		},
		'should be detroyed properly': function(){

		}
	}));
}, '@VERSION', {
	requires:['test', '<%=module%>-model']
});

YUI.add('<%=module%>-model-list-tests', function(Y){
	Y.Test.Runner.add(new Y.Test.Case({
		name:'Basic <%=MODULE%>ModelList Tests',
		'should be initialized properly': function(){

		},
		'should be detroyed properly': function(){

		}
	}));
}, '@VERSION', {
	requires:['test', '<%=module%>-model-list']
});

// simple rollup
YUI.add('<%=module%>-tests', function(Y){},'@VERSION@',{
	requires:['<%=module%>-view-tests', '<%=module%>-model-tests', '<%=module%>-model-list-tests']
});

