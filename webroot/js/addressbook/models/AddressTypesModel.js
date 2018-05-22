/* 
 * @author Mohamed Abdul Nasar (abdul.nasar85@gmail.com)
 * Summary: Model to get all the address types
 ******************************************************************
 */
define([
    'backbone'
], function(Backbone) {
    return Backbone.Model.extend({

        initialize: (props) => {
            _.extend(this, props);
        },
        url: () => {
            let url = "/address-types";
            return url;
        },
        parse: (data) => {
            console.debug(data);
            return data;
        }

    });
});