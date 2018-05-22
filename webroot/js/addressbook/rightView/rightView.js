/* 
* @author Mohamed Abdul Nasar (abdul.nasar85@gmail.com)
* Summary: Controls the rendering of the right side view and the edit view on the address book
******************************************************************
*/
define(["jquery",
    "backbone",
    "underscore",
    "text!./rightView.html",
    "text!./editView.html",
    "text!./newPhoneView.html",
    "text!./newAddressView.html",
    "../models/ContactsModel",
    "../models/AddressTypesModel",
    "../models/PhoneTypesModel",
    "../models/ContactsAddressModel",
    "../models/ContactsPhoneModel"
], function($, Backbone, _, Template, EditTemplate, NewPhoneTemplate, NewAddressTemplate, ContactsModel, AddressTypesModel, PhoneTypesModel, ContactsAddressModel, ContactsPhoneModel) {
    return Backbone.View.extend({
        template: _.template(Template),
        editTemplate: _.template(EditTemplate),
        newPhoneTemplate: _.template(NewPhoneTemplate),
        newAddressTemplate: _.template(NewAddressTemplate),
        deletedAddresses: [],
        deletedPhones: [],
        el: ".rightArea",
        addresses: [],
        phones: [],
        isEditMode: false,
        events: {
            "click .editText": "showEditView",
            "click .addNewPhoneRow": "addNewPhone",
            "click .addNewAddressRow": "addNewAddress",
            "click .fa-minus-circle": "deleteRowElement",
            "click .doneText": "saveAddressItem",
            "click .deleteText": "showDeleteModal",
            "click #delete": "confirmDelete",
            "click #cancelDelete": "closeDeleteModal",
            "keyup #givenname": "onChangeOfGivenName",
            "keyup #surname": "onChangeOfSurName"
        },
        initialize: function(props) {
            _.extend(this, props);
        },
        render: function(isEditMode) {
            if (isEditMode) {
                this.fetchAddressAndPhoneTypes();
                return;
            }
            this.$el.html(this.template());
        },

        fetchAddressAndPhoneTypes: function() {
            this.addressTypeModel = new AddressTypesModel().fetch({
                contentType: 'application/json',
                success: _.bind((response, parsedResp) => {
                    this.addressTypes = parsedResp;
                    this.phoneTypeModel = new PhoneTypesModel().fetch({
                        contentType: 'application/json',
                        success: _.bind((response, parsedResp) => {
                            this.phoneTypes = parsedResp;
                            this.$el.html(this.editTemplate());
                        }, this),
                        error: (err) => {
                            console.error('ERROR: Could not get Data from phone type API' + err);
                        }
                    })
                }, this),
                error: (err) => {
                    console.error('ERROR: Could not get Data from address type API' + err);
                }
            });
        },

        addNewPhone: function() {
            $(this.newPhoneTemplate()).insertBefore(this.$el.find(".addNewPhoneRow"));
        },

        addNewAddress: function() {
            $(this.newAddressTemplate()).insertBefore(this.$el.find(".addNewAddressRow"));
        },

        deleteRowElement: function(e) {
            let row = $(e.currentTarget.parentNode.parentNode);
            if (row.find('[name="phoneTypes"]').length > 0) {
                let deletedItem = row.find('[name="phoneTypes"]')[0].getAttribute("phone-id");
                deletedItem !== "new" ? this.deletedPhones.push(deletedItem) : null;
            }
            if (row.find('[name="addressTypes"]').length > 0) {
                let deletedItem = row.find('[name="addressTypes"]')[0].getAttribute("address-id");
                deletedItem !== "new" ? this.deletedAddresses.push(deletedItem) : null;
            }
            row.remove();
        },

        fetchPhoneTypes: function() {
            this.addressTypeModel = new AddressTypesModel().fetch({
                contentType: 'application/json',
                success: _.bind((response, parsedResp) => {
                    this.addressTypes = parsedResp;

                }, this),
                error: (err) => {
                    console.error('ERROR: Could not get Data from address type API' + err);
                }
            })
        },

        showEditView: function() {
            this.render(true);
        },
        updateView: function(selectedContact) {
            if (!selectedContact) {
                this.contactID = null;
                this.contact.contactID = null;
                this.contact.givenName = "";
                this.contact.surname = "";
                this.addresses = [];
                this.phones = [];
                this.newRecord = true;
                this.render(true);
                return;
            }
            this.contact = selectedContact;
            this.contactsModelForAddress = new ContactsModel({
                contactID: selectedContact.contactID,
                addresses: true
            }).fetch({
                contentType: 'application/json',
                success: _.bind((response, parsedResp) => {
                    this.addresses = parsedResp;
                    this.contactsModelForPhones = new ContactsModel({
                        contactID: selectedContact.contactID,
                        addresses: false,
                        phones: true
                    }).fetch({
                        contentType: 'application/json',
                        success: _.bind((response, parsedResp) => {
                            this.phones = parsedResp;
                            this.render();
                        }, this),
                        error: (err) => {
                            console.error('ERROR: Could not get Data from contact API + err');
                        }
                    });
                }, this),
                error: (err) => {
                    console.error('ERROR: Could not get Data from contact API + err');
                }
            });
        },

        saveAddressItem: function() {
            if (!this.$el.find("#editViewForm")[0].checkValidity()) {
                return;
            }
            this.contactID = this.contact.contactID;
            this.saveContact();
        },

        saveContact: function() {
            let contactObj = {};
            contactObj.contactID = this.contactID;
            contactObj.givenName = this.$el.find('[name="givenname"]').val();
            contactObj.surname = this.$el.find('[name="surname"]').val();
            let contactsModel = new ContactsModel({
                contactID: this.contactID,
                addContact: true,
                phones: false,
                addresses: false
            });
            contactsModel.set(contactObj);
            contactsModel.save(null, {
                success: _.bind(function(model, response) {
                    this.contactID = response.contactID;
                    this.saveAddresses();
                    this.savePhones();
                    this.mainView.updateLeftView(this.contactID);
                }, this),
                error: function(model, errResponse) {
                    console.log("errorresponse" + errResponse);
                }
            });

        },

        saveAddresses: function() {
            _.each(this.$el.find('[name="addressTypes"]'), (_.bind(function(addressSelectElement) {
                let addressObj = {};
                addressObj.addressID = addressSelectElement.getAttribute("address-id");
                addressObj.addressType = addressSelectElement.value;
                let row = addressSelectElement.parentNode.parentNode;
                addressObj.street = $(row).find('[name="street"]')[0].value;
                addressObj.city = $(row).find('[name="city"]')[0].value;
                addressObj.state = $(row).find('[name="state"]')[0].value;
                addressObj.postalCode = $(row).find('[name="postalcode"]')[0].value;
                console.dir(addressObj);
                let contactsAddressModel = null;
                if (addressObj.addressID == "new") {
                    addressObj.addressID = null;
                    contactsAddressModel = new ContactsAddressModel({
                        addressID: null,
                        contactID: this.contactID
                    });
                } else {
                    contactsAddressModel = new ContactsAddressModel({
                        addressID: addressObj.addressID,
                        contactID: this.contactID
                    });
                }
                contactsAddressModel.set(addressObj);
                contactsAddressModel.save();
            }, this)));
            this.deletedAddresses.forEach((addressID) => {
                let contactsAddressModel = new ContactsAddressModel({
                    addressID: addressID,
                    contactID: this.contactID
                });
                contactsAddressModel.destroy();
            });
            this.deletedAddresses.slice(0, this.deletedAddresses.length + 1);
        },

        savePhones: function() {
            _.each(this.$el.find('[name="phoneTypes"]'), (_.bind(function(phoneSelectElement) {
                let phoneObj = {};
                phoneObj.phoneID = phoneSelectElement.getAttribute("phone-id");
                phoneObj.phoneType = phoneSelectElement.value;
                let row = phoneSelectElement.parentNode.parentNode;
                phoneObj.phoneNumber = $(row).find('[name="phonenumber"]')[0].value;
                console.dir(phoneObj);
                let contactsPhoneModel = null;
                if (phoneObj.phoneID == "new") {
                    phoneObj.phoneID = null;
                    contactsPhoneModel = new ContactsPhoneModel({
                        phoneID: null,
                        contactID: this.contactID
                    });
                } else {
                    contactsPhoneModel = new ContactsPhoneModel({
                        phoneID: phoneObj.phoneID,
                        contactID: this.contactID
                    });
                }
                contactsPhoneModel.set(phoneObj);
                contactsPhoneModel.save();
            }, this)));
            this.deletedPhones.forEach((phoneID) => {
                let contactsPhoneModel = new ContactsPhoneModel({
                    phoneID: phoneID,
                    contactID: this.contactID
                });
                contactsPhoneModel.destroy();
                this.deletedPhones.slice(0, this.deletedPhones.length + 1);
            });
        },

        showDeleteModal: function() {
            this.$el.find("#favDialog")[0].showModal();
        },

        closeDeleteModal: function() {
            this.$el.find("#favDialog")[0].close();
        },

        confirmDelete: function() {
            let contactsModel = new ContactsModel({
                contactID: this.contact.contactID,
                addresses: false,
                phones: false
            });
            contactsModel.destroy({
                success: _.bind((model, response) =>{

                }, this),
                error: _.bind((model, errResponse) => {
                    // have to handle in error response because the delete API
					// does not return a valud JSON.
                    this.mainView.leftView.removeAndHighlightNext(this.contact.contactID);
                }, this)
            });
        },

        onChangeOfGivenName: function(e) {
            console.log(e.currentTarget.value);
            this.mainView.leftView.changeListName(e.currentTarget.value, this.$el.find('[name="surname"]')[0].value);
        },

        onChangeOfSurName: function(e) {
            this.mainView.leftView.changeListName(this.$el.find('[name="givenname"]')[0].value, e.currentTarget.value);
        }
    });
});