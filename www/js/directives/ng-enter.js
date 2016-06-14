// http://stackoverflow.com/questions/15417125/submit-form-on-pressing-enter-with-angularjs
angular.module('todo').directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
              console.log(event.which);
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });
                    event.preventDefault();
                }
            });
        };
    });