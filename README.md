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
      
      // objArrConverter mixin
      // converts objs to array and vice versus
      
      static get defaults() {
        return {
          type: 'panda'
        };
      }
      
      static get mappings(){
        return {
          food: (type) => { 
            return type === 'milk' ? 'cow' : 'panda';
          },
          zoo: this.hasMany(Zoo)
        };
      }
      
    }
    
    export class Zoo extends ServiceModelFactory {
      // - $save
      // - $destroy
    }
    
    export function ZooService($model){
      return $model('zoo', {
        mixins: [ History, Diff, ObjArrConverter ],
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


### Research Item

- https://nvbn.github.io/2015/03/13/angular-without-callbacks/
- https://github.com/nvbn/ng-gen/blob/master/dist/ng-gen.js
- https://github.com/jeffmo/es-class-static-properties-and-fields



## Credits

`angular-model-factory` is a [Swimlane](http://swimlane.com) open-source project; we believe in giving back to the open-source community by sharing some of the projects we build for our application. Swimlane is an automated cyber security operations and incident response platform that enables cyber security teams to leverage threat intelligence, speed up incident response and automate security operations.
