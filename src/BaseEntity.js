import angular from 'angular';
import diff from 'deep-diff';
import rx from 'rx';
import { shallowClearAndCopy } from './utils';

export class BaseEntity {

  constructor(data){

    // copy values to the instance
    angular.extend(this, data);

    // https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/creating.md
    // rx.Observable

    this.$commits = [];
    this.$commit();
  }

  /**
   * Display the difference between the original data and the
   * current instance.
   * https://github.com/flitbit/diff
   */
  $diff(){
    return DeepDiff.deep(old, this, (path, key) => {
      // exclude $ attributes like ours or angulars
      return key[0] === '$';
    });
  }

  /**
   * Commits the change the commits bucket for rollback later if needed.
   */
  $commit(){
    // call angualar.toJson vs native
    // to prevent circular loops and such
    this.$commits.push(angular.toJson(this));
    return this;
  }

  /**
   * Reverts the current instance back either the latest instance
   * or you can pass a specific instance on the commits stack.
   */
  $rollback(version){
    var prevCommit = this.$commits[version || this.$commits.length - 1];
    this.$update(JSON.parse(prevCommit));
    return instance;
  }

  /**
   * Creates a copy by taking the raw data values and by
   * creating a new instance of the model.
   */
  $copy(){
    // get the raw data of the model
    var rawData = angular.toJson(this);
    // ..then wrap it into a new instance to create a clone
    return new this(angular.fromJson(rawData));
  }

  /**
   * Extends the properties of the new object onto
   * the current object without replacing it.  Helpful
   * when copying and then re-copying new props back
   */
  $update(n){
    shallowClearAndCopy(n, this);
    return this;
  }

  toJSON () {
    return this//.attributes;
  }

}
