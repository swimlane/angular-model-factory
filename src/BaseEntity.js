import angular from 'angular';

export class BaseEntity {

  constructor(data){

    // copy values to the instance
    angular.extend(this, data);
  }

  $diff(){

  }

  $commit(){

  }

  $rollback(){

  }

  $copy(){
    
  }

  toJSON () {
    return this//.attributes;
  }

}
