export const createTaskSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1, maxLength: 255 },
    description: { type: 'string', nullable: true },
    status: {
      type: 'string',
      enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
    },
  },
  required: ['title'],
  additionalProperties: false,
};
