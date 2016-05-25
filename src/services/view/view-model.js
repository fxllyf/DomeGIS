'use strict';

var Sequelize = require('sequelize');

module.exports = function(sequelize) {
  var view = sequelize.define('views', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV1, primaryKey: true},
    name: { type: Sequelize.STRING, required: true},
    fields: { type: Sequelize.ARRAY(Sequelize.STRING), defaultValue: []},
    style: { type: Sequelize.JSON, required: true},
    cartocss: { type: Sequelize.TEXT, required: true},
    layergroupId: { type: Sequelize.STRING },
    previewCartoCss: { type: Sequelize.TEXT },
    previewLayergroupId: { type: Sequelize.STRING }
  }, {
    freezeTableName: true,
    classMethods: {
      associate: function(models){
        view.belongsTo(models.layers);
      }
    }
  });

  return view;
};
