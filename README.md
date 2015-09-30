![](http://www.clker.com/cliparts/5/u/N/P/P/S/factory-hi.png)
# modelFactory 

### API 

    export class Animal extends BaseModelFactory {
    
      // diff mixin
      // - $diff
      
      // history mixin
      // - $commit
      // - $rollback
      // - $update
      
      // @default(false)
      // bar
      
      //static get defaults(){
      //  return {
      //    bar: true,
      //    foo: false
      //  }
      //}
      
      // static get mappings(){
      //  if(this.food === 1) return 'meat';
      //  if(this.food === 2) return 'bamboo';
      // }
      
    }
    
    export class Zoo extends ServiceModelFactory {
      // - $save
      // - $destroy
    }
    
    function ZooService($model){
      return $model('zoo', {
        mixins: [ History, Diff ],
        actions: {
         getAnimals { 
            asClass: Animal,
            url: '/animals' 
          }
        },
        asClass: Zoo // if not defined, uses base service
      })
    }
  

### Example Usage 

    let module = angular.module('app', []);
    module.factory('ZooModel', ZooService);
    module.controller((ZooModel) => {
      let model = new ZooModel({ location: 'San Diego' });
      let result = yield model.$save();
    });


## Credits

`angular-model-factory` is a [Swimlane](http://swimlane.com) open-source project; we believe in giving back to the open-source community by sharing some of the projects we build for our application. Swimlane is an automated cyber security operations and incident response platform that enables cyber security teams to leverage threat intelligence, speed up incident response and automate security operations.
