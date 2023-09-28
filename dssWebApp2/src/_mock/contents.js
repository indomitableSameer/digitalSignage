import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const CONTENT_INFO = ['Fra-Adv 01', 'Fra-Adv 02', 'Fra-Adv 03', 'Fra-Adv 04'];

// ----------------------------------------------------------------------

const contents = [...Array(4)].map((_, index) => {
  const setIndex = index + 1;

  return {
    id: faker.datatype.uuid(),
    cover: `/assets/images/contents/testimg.jpg`,
    name: CONTENT_INFO[index],
    description: 'This is test video which will be used for demo purposes.',
    date: '22-01-2023',
    time: '22:24',
  };
});

export default contents;
