import angular from 'angular';
import { BaseEntity } from './BaseEntity'
import uriTemplates from 'uri-templates';
import { BuildRequest } from '../builder';

export class ServiceEntity extends BaseEntity {

  constructor(data){
    super(...arguments);

    // build instance level actions
    angular.forEach(ServiceEntity.actions, (v, k) => {
      if(k[0] !== '$') return;
      this[k] = function(){
        return BuildRequest(k, v, this);
      };
    });
  }

  * $save (options) {
    let actionType = this[options.pk] ? 'update' : 'post',
        promise = ServiceEntity[actionType](this);

    this.$pending = true;

    promise.then((data) => {
      this.$pending = false;

      // extend the value from the server to me
      if (data) {
        this.$update(data);
      }

      //var broadcastName = actionType === 'post' ? 'created' : 'updated';
      //$rootScope.$broadcast(prettyName + '-' + broadcastName, instance);

      // commit the change for reversion
      this.$commits.push(angular.toJson(this));
    }, (data) => {
      // rejected
      this.$pending = false;
      //console.warn('', data)
    });

    return promise;
  }

  * $update(){

  }

  * $destroy(){

  }

}
