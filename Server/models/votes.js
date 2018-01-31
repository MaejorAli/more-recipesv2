export default (sequelize, DataTypes) => {
  const votes = sequelize.define('votes', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Recipes',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    recipeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Recipes',
        key: 'id',
      },
    },
    voteType: {
      type: DataTypes.ENUM,
      values: ['upvote', 'downvote'],
    },
  }, {
    classMethods: {
      associate: () => {
        // associations can be defined here
      },
    },
  });
  votes.associate = (models) => {
    votes.belongsTo(models.Users, { foreignKey: 'userId' });
    votes.belongsTo(models.Recipes, { foreignKey: 'userId' });
  };
  return votes;
};
