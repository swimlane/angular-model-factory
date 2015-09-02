// keywords that are reserved for model instance
// internal usage only and to be stripped
// before sending to server
export const instanceKeywords = [ '$$array', '$save', '$destroy',
    '$pending', '$rollback', '$diff', '$update', '$commit', '$copy' ];

// keywords that are reserved for the model static
// these are used to determine if a attribute should be extended
// to the model static class for like a helper that is not a http method
export const staticKeywords = [ 'actions', 'instance', 'list', 'defaults',
    'pk', 'stripTrailingSlashes', 'map'];