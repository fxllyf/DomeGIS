'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('layers', 'sync', Sequelize.JSON );
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('layers', 'sync');
  }
};
