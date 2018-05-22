requirejs.config({
    "baseUrl": "js",
    "paths": {
      "jquery": "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min",
      "backbone": "https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone-min",
      "underscore": "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.0/underscore-min",
      "text": "https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min"
    },
    "shim": {
        "jquery.alpha": ["jquery"],
        "jquery.beta": ["jquery"]
    }
});
requirejs(["addressbook/mainView"]);
