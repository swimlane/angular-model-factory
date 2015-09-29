/**
 * Model list instance.
 * All raw objects passed will be converted to an instance of this model.
 *
 * If we `push` a item into an existing collection, a pointer will be made
 * so on a destroy items will be removed from the array as well.
 *
 * Example usages:
 *       var zoos = new Zoo.List([ {}, ... ]);
 */
export class ArrayEntity extends Array {

  constructor(){
    // value = value || [];
    
    // wrap each obj
    // value.forEach(function(v, i){
    //    // this should not happen but prevent blow up
    //    if(v === null || v === undefined) return;
    //    // reset to new instance
    //    value[i] = wrapAsNewModelInstance(v, value);
    //});
    
    //// add list helpers
    //  if(options.list){
    //      extend(value, options.list);
    //  }

    super(...arguments);
  }

  push(val){
    var args = Array.prototype.slice.call(arguments);

    for(var i=0; i<args.length; i++){
        //args[i] = wrapAsNewModelInstance(args[i], value);
    }

    super.push(value, args);
  }

  // helper function for creating a new instance of a model from
  // a raw JavaScript obj. If it is already a model, it will be left
  // as it is
  wrapAsNewModelInstance(rawObj, arrayInst){
      // create an instance
      var inst = rawObj.constructor === Model ?
          rawObj : new Model(rawObj);

      // set a pointer to the array
      inst.$$array = arrayInst;

      return inst;
  };

}
