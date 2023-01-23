const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists,
} = require('sequelize-test-helpers');

const MemberModel = require('../../../models/member.model');

describe('Member model', () => {
  const Member = MemberModel(sequelize, dataTypes);
  describe('Has correct model name', () => {
    checkModelName(Member)('Member');
  });

  describe('Contains all properties', () => {
    const member = new Member();
    [
      'first_name',
      'second_name',
      'email',
      'telephone',
      'address',
      'gender',
      'joinDate',
      'renewalDate',
    ].forEach(checkPropertyExists(member));
  });
});
