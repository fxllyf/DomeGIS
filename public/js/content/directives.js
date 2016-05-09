angular.module('domegis')

.directive('contentItem', [
  'Server',
  function(Server) {
    return {
      restrict: 'A',
      scope: {
        'content': '=contentItem'
      },
      templateUrl: '/views/content/item.html',
      link: function(scope, element, attrs) {

        var contentService = Server.service('contents');
        var layerService = Server.service('layers');

        if(scope.content) {
          Server.find(layerService, {
            query: {
              contentId: scope.content.id
            }
          }).then(function(res) {
            scope.layers = res.data;
          });
        }

        Server.on(layerService, 'created', function(data) {
          if(data.contentId == scope.content.id)
            scope.layers.push(data);
        });
        Server.on(layerService, 'removed', function(data) {
          scope.layers = _.filter(scope.layers, function(item) {
            return item.id !== data.id;
          });
        });

        scope.unsyncItem = function(content) {
          Server.remove(contentService, content.id);
        };
      }
    }
  }
]);
