define([
    "./templates"
], function(templates){
   
   function Examples() {
        this.$exampleTemplate = $(templates.examples);
        this.$examples  = this.$exampleTemplate.find(".example-wrapper");
        this.total      = this.$examples.length;
        this.current    = null;

        this.set = function(n) {
            this.current = n;
        };

        this.get = function(n) {
            if (n >= this.total || n<0) {
                throw new Error("n out of range");
            }
            else if (n === undefined) {
                return this.$examples[this.current];
            }
            else {
                this.current = n;
                return this.$examples[n];
            }
        };

        this.next = function() {
            this.current++;
            if (this.current === this.total) {
                this.current--;
                return null;
            }
            else {
                return this.get(this.current);
            }
        };

        this.prev = function() {
            this.current--;
            if (this.current < 0) {
                this.current++;
                return null;
            }
            else {
                return this.get(this.current);
            }
        };
   }
   return Examples;
});
