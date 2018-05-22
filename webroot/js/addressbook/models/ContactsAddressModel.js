/* 
 * @author Mohamed Abdul Nasar (abdul.nasar85@gmail.com)
 * Summary: Model to handle addresses for a contact
 ******************************************************************
 */
define([
    'backbone'
], function(Backbone) {
    return Backbone.Model.extend({
        idAttribute: "addressID",
        addressID: null,
        initialize: (props) => {
            _.extend(this, props);
        },
        url: () => {
            let url = "/contacts";
            if (!this.contactID) {
                return url;
            }
            let contactID = this.contactID.toString();
            url = url + "/" + contactID + "/addresses";
            if (this.addressID) {
                url = url + "/" + this.addressID;
            }
            return url;
        },
        parse: (data) => {
            console.debug(data);
            return data;
        }

    });
});