/* 
* @author Mohamed Abdul Nasar (abdul.nasar85@gmail.com)
* Summary: Controls the rendering of the left side view on the address book
******************************************************************
*/
define(["jquery",
    "backbone",
    "underscore",
    'text!./leftView.html',
    "../models/ContactsModel"
], function($, Backbone, _, Template, ContactsModel) {
    return Backbone.View.extend({
        template: _.template(Template),
        el: ".leftArea",
        addressBookItems: [],
        prevSelected: null,
        events: {
            "click .addressBookRow": "onClickOfContactItem",
            "click .addNew": "addNewRecord"
        },
        initialize: function(props) {
            _.extend(this, props);
            this.fetchAndRender();
        },

        fetchAndRender: function(selectedId) {
            this.contactsModel = new ContactsModel({
                contactID: null
            }).fetch({
                success: _.bind((response, parsedResp) => {
                    this.addressBookItems = parsedResp;
                    this.render();
                    selectedId ? this.clickSelectedContact(selectedId) : this.clickFirstContact();
                }, this),
                error: (err) => {
                    console.error('ERROR: Could not get Data from contact API ${err}');
                }
            });
        },

        clickFirstContact: function() {
            this.$el.find(".addressBookRow")[0].click();
        },

        onClickOfContactItem: function(e) {
            this.prevSelected ? this.$el.find("#" + this.prevSelected).removeClass("selected") : null;
            $(e.currentTarget).addClass("selected");
            this.prevSelected = e.currentTarget.id;
            let selectedContact = this.addressBookItems.find((item) => {
                //user == as I have to check only the value here and currentTarget.id will be a string.
                return item.contactID == e.currentTarget.id;
            })
            this.mainView.renderRightView(selectedContact);
        },

        updateViewWithNewSelected: function(selectedId) {
            selectedId ? this.fetchAndRender(selectedId) : this.fetchAndRender();
        },

        clickSelectedContact: function(selectedId) {
            this.$el.find("#" + selectedId).click();
        },

        render: function() {
            this.$el.html(this.template());
            return this;
        },

        addNewRecord: function() {
            this.noNameli = document.createElement("li");
            this.noNameli.className = "noname addressBookRow";
            this.noNameli.innerHTML = "[No Name]";
            $(this.noNameli).insertBefore(this.$el.find(".addNew")[0]);
            this.prevSelected ? this.$el.find("#" + this.prevSelected).removeClass("selected") : null;
            this.mainView.renderRightView();
        },
        changeListName: function(givenName, surName) {
            this.noNameli.innerHTML = givenName + " " + surName;
        },

        removeAndHighlightNext: function(contactId) {
            this.$el.find("#" + contactId).next().hasClass("addNew") ? this.$el.find("#" + contactId).prev().click() : this.$el.find("#" + contactId).next().click();
            this.$el.find("#" + contactId).remove();
        }
    });
});