import angular from 'angular';
import { ModelFactoryProvider } from './ModelFactoryProvider';

export default angular
	.module('modelFactory', [])
	.provider('$modelFactory', ModelFactoryProvider);
