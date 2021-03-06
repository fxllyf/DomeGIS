'use strict';

var _ = require('underscore');

module.exports = function(hook) {
  var sequelize = hook.app.get('sequelize_readonly');
  var Analyses = hook.app.service('analyses');
  var layerId = hook.id || hook.result.id;
  var avoidQuery = false;
  var results;

  function executeQuery(doneExecuteQuery){
    var query = hook.data.query;
    var task = hook.data.task;

    function runQuery() {
      sequelize.query(query)
        .then(function(results){
          doneExecuteQuery(null, {
            task: task,
            results: results[0]
          });
        })
        .catch(function(err){
          doneExecuteQuery(err, {
            task: task,
            results: null
          });
        })
    }

    if (!query) {
      Analyses.get(layerId).then(function(result){
        query = result.query;
        runQuery();
      }).catch(function(err){
        console.log('erro');
        console.log(err);
      })
    } else runQuery();

  }

  function updateAnalysisStatus(err, queryResults){
    var task = queryResults.task;
    var results = queryResults.results;

    if (!err) {
      task.status = 'finished';
    } else {
      task.status = 'failed';
      task.message = err.message;
    }

    task.finishedAt = Date.now();

    Analyses.patch(layerId, {
      results: results,
      task: task
    }, {
      bypassRunQuery: true
    }).catch(function(err){
      console.log('path error');
      console.log(err);
    });
  }

  if (!hook.params.bypassRunQuery && ( hook.data.query || hook.data.forceExecution )) {
    executeQuery(updateAnalysisStatus)
  }

  return hook;
}
