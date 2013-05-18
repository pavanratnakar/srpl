YUI.add('<%=module%>-view', function(Y){

    var defaults = {
        
    };

	var <%=MODULE%>View = function(){
		<%=MODULE%>View.superclass.constructor.apply(this, arguments);
	};

	Y.extend(<%=MODULE%>View, Y.View, {
		template: Y.<%=namespace%>.<%=MODULE%>.templates.base,
		events:{

		},
		initializer: function(config){

		},
		destructor: function(){

		},
		render: function(){

		}
	});

	Y.namespace('<%=namespace%>.<%=MODULE%>');
	Y.<%=namespace%>.<%=MODULE%>.View = <%=MODULE%>View;
	// protip, if you want, you can hook this up straight to the module like so - 
	// Y.<%=namespace%>.<%=MODULE%> = <%=MODULE%>View;
	// so then all you'll need to do is new Y.<%=namespace%>.<%=MODULE%>()

}, '@VERSION@',{
    requires:['view', '<%=module%>-templates','<%=module%>-model-list']
});