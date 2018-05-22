# Address Book


Address Book is a web component build upon the following UI technologies.

  - Backbone for the views
  - Jquery for some DOM handlings
  - Underscore for template parsing
  - requireJS for module loading
  - text to process the HTML
  - gulp, gulp-less, gulp-cssmin, gulp watch are using for packaging and development.
 
  All above modules are loaded from the corresponding CDN.

# Prerequisites
  - npm
  - node

# Start Node server

 ```sh
$ cd AddressBookServer
$ node AddressBookServer
```

# Development Set Up 

The below setup will convert the less files to css, minify them and keeps watching them for continuous development.
  ```sh
$ cd webroot
$ npm install
$ npm -g install gulp
$ gulp package
```
# TO DO

 - Web responsiveness
 - Styling of the select dropdown