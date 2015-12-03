require(["extras/SampleModule"], function(SampleModule) {
  describe("SampleModule", function() {
    var counter;
    counter = new SampleModule({});      

    it("get the private value", function() {
      expect(counter.getValue()).toEqual(0);
    });

    it("increments the private value", function() {
      counter.increment();
      expect(counter.getValue()).toEqual(1);      
    });

    it("decrements the private value", function() {
      counter.decrement();
      expect(counter.getValue()).toEqual(0);
    });
  });  
});