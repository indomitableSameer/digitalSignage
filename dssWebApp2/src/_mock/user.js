import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const users = [...Array(3)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  name: sample(['ab:ac:ad:ae:af', 'ab:ac:ad:ae:ag', 'ab:ac:ad:ae:ah']),
  company: 'test',
  isVerified: faker.datatype.boolean(),
  status: sample(['Online', 'Registered', 'Offline', 'Unknown']),
  role: sample(['testVid1']),
}));

export default users;
