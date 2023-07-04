export const serializedTest = {
  name: 'blog',
  models: [
    {
      name: 'User',
      fields: [
        {
          name: 'id',
          type: 'Int',
          attributes: [{ name: 'id' }],
        },
      ],
    },
    {
      name: 'Post',
      fields: [
        {
          name: 'userId',
          type: 'Int',
          attributes: [],
          references: {
            model: 'User',
            field: 'id',
          },
        },
      ],
    },
  ],
};
export const schemaResult = `model User {
  id   Int    @id
  Post Post[]
}

model Post {
  userId Int
  user   User @relation(fields: [userId], references: [id])
}
`;
