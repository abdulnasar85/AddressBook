/* 
 * @author Mohamed Abdul Nasar (abdul.nasar85@gmail.com)
 * Summary: View that starts the backbone lifecycle by invoking left and the right views
 ******************************************************************
 */
define(['jquery',
    'backbone',
    'underscore',
    'text!./mainView.html',
    './leftView/leftView',
    './rightView/rightView'
], function($, Backbone, _, Template, leftView, rightView) {
    var mainView = Backbone.View.extend({
        template: _.template(Template),
        el: "#addressBook",
        initialize: function(props) {
            this.render();
        },
        render: function() {
            this.$el.html(this.template());
            this.leftView = new leftView({
                mainView: this
            });
            this.rightView = new rightView({
                mainView: this
            });
            return this;
        },

        renderRightView: function(selectedContact) {
            this.rightView.updateView(selectedContact);
        },

        updateLeftView: function(selectedId) {
            this.leftView.updateViewWithNewSelected(selectedId);
        }

    });
    new mainView();
});