YUI.add('srpl-app-templates', function(Y){
// DO NOT EDIT THIS FILE
// this should be automatically generated by using the .*.html files in templates
Y.namespace('srpl.App');
Y.srpl.App.templates = {
    aria:Y.template('<div id="<%=id%>-aria-container" aria-live="polite"></div>'),
		base:Y.template('<div id="srpl-wrapper-container" class="srpl">\n	<button class="image prev overlay-button" style="display:none;">Previous</button>\n	<div class="carousel srpl-carousel">\n		<ol id="srpl-container">\n		<%\n		Y.each(businessess, function(b,i){ %>\n            <li class="srpl-business clearfix" id="srpl-<%= b %>"></li>\n        <%}); %>\n		</ol>\n	</div>\n	<button class="image next overlay-button" style="display:none;">Next</button>\n	<button class="image close overlay-button">Close</button>\n</div>'),
		fader:Y.template('<div id="srpl-fader-container">\n	<div id="srpl-fader-overlay"></div>\n</div>'),
		loader:Y.template('<div id="srpl-loader-container">\n    <div class="loader big"></div>\n</div>')
};
}, '@VERSION@',{
    // [bug 5892107] no need to require assets     
    requires:['srpl-template']
});