
Z.$package('tally', [
    'tally.controller',
    'tally.view'
], function(z){

    this.init = function(){
        tally.view.init();
        tally.controller.init();
    }
});

