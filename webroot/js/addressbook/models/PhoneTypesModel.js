/* 
 * @author Mohamed Abdul Nasar (abdul.nasar85@gmail.com)
 * Summary: Model to get all the phone types
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
            let url = "/phone-types";
            return url;
        },
        parse: (data) => {
            console.debug(data);
            return data;
        }

    });
});