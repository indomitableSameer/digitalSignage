import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const users = [...Array(1)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  name: 'ab:ac:ad:ae:af',
  company: 'test',
  isVerified: faker.datatype.boolean(),
  status: sample(['Online', 'Registered', 'Offline', 'Unknown']),
  role: sample(['testVid1']),
}));

export default users;
