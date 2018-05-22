/* 
 * @author Mohamed Abdul Nasar (abdul.nasar85@gmail.com)
 * Summary: Model to handle phones for the contact
 ******************************************************************
 */
define([
    'backbone'
], function(Backbone) {
    return Backbone.Model.extend({
        idAttribute: "phoneID",
        phoneID: null,
        initialize: (props) => {
            _.extend(this, props);
        },
        url: () => {
            let url = "/contacts";
            if (!this.contactID) {
                return url;
            }
            let contactID = this.contactID.toString();
            url = url + "/" + contactID + "/phones";
            if (this.phoneID) {
                url = url + "/" + this.phoneID;
            }
            return url;
        },
        parse: (data) => {
            console.debug(data);
            return data;
        }

    });
});