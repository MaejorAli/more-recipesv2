module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('votes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      recipeId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      voteType: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['upvote', 'downvote'],
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface) => {
    queryInterface.dropTable('votes');
  },
};
