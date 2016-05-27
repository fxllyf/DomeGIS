angular.module('domegis')

.directive('layerItem', [
  'Server',
  function(Server) {
    return {
      restrict: 'A',
      scope: {
        'layer': '=layerItem'
      },
      templateUrl: '/views/layer/item.html',
      link: function(scope, element, attrs) {

        var layerService = Server.service('layers');
        var viewService = Server.service('views');

        scope.token = Server.app.get('token');

        Server.find(viewService, {
          query: {
            layerId: scope.layer.id
          }
        }).then(function(res) {
          scope.views = res.data;
        });

        Server.on(layerService, 'syncFinish', function(layerId) {
          if(scope.layer.id == layerId) {
            Server.get(layerService, layerId).then(function(data) {
              scope.layer = data;
            })
          }
        });
        Server.on(layerService, 'syncProgress', function(prog) {
          if(scope.layer.id == prog.layerId) {
            scope.progress = parseInt(prog.progress * 100) + '%';
          }
        });
        Server.on(layerService, 'updated', function(data) {
          console.log(data);
          if(scope.layer.id == data.id) {
            console.log('should replace updated', data);
            scope.layer = data;
          }
        });
        Server.on(viewService, 'created', function(data) {
          if(data.layerId == scope.layer.id)
            scope.views.push(data);
        });
        Server.on(viewService, 'removed', function(data) {
          scope.views = _.filter(scope.views, function(item) {
            return item.id !== data.id;
          });
        });

        scope.remove = function(layer) {
          Server.remove(layerService, layer.id);
        };
      }
    }
  }
]);
