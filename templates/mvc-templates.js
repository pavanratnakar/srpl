YUI.add('<%= namespace %>-<%= module %>-templates', function(Y){
// DO NOT EDIT THIS FILE
// this should be automatically generated by using the .*.html files in templates
Y.namespace('<%= namespace %>.<%= MODULE %>');
Y.<%= namespace %>.<%= MODULE %>.templates = {
    <% var strings = []; _.each(scripts, function(script, name){         
        strings.push(name + ":Y.template('" + script.replace(/\r?\n/g, '\\n').replace(/'/g, '\\\'') + "')");
    });print(strings.join(',\n\t\t'));%>
};
}, '@VERSION@',{
    // [bug 5892107] no need to require assets     
    requires:['<%= namespace %>-template']
});