/* 
 * @author Mohamed Abdul Nasar (abdul.nasar85@gmail.com)
 * Summary: Model to get contact info along with phones and addresses
 ******************************************************************
 */
define([
    'backbone'
], function(Backbone) {
    return Backbone.Model.extend({
        addresses: false,
        phones: false,
        idAttribute: "contactID",
        contactID: null,
        initialize: (props) => {
            _.extend(this, props);
        },
        url: () => {
            let url = "/contacts";
            if (!this.contactID) {
                return url;
            }
            let contactID = this.contactID.toString();
            url = url + "/" + contactID;
            if (contactID && this.addresses) {
                url = url + "/addresses";
            } else if (contactID && this.phones) {
                url = url + "/phones";
            }
            return url;
        },
        parse: (data) => {
            console.debug(data);
            return data;
        }

    });
});