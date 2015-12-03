define(["dojo/_base/declare"], function(declare) {
    return declare(null, { 
        constructor: function(options) {
            this.privateValue = options.privateValue || 0;
        },

        increment: function(){
            return this.privateValue++;
        },
 
        decrement: function(){
            return this.privateValue--;
        },

        getValue: function(){
            return this.privateValue;
        },

        alertValue: function(){
            alert(this.privateValue);
        }
    });
});