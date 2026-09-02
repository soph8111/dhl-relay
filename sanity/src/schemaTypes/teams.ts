import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export const team = defineType({
  type: 'document',
  name: 'team',
  title: 'Hold',
  icon: UsersIcon,
  preview: {
    select: {
      title: 'teamName',
    },
  },
  fields: [
    defineField({
      type: 'string',
      name: 'teamName',
      title: 'Holdnavn',
      validation: (rule) => rule.required().error('Holdnavn er påkrævet'),
    }),
    defineField({
      type: 'array',
      name: 'runners',
      title: 'Løbere',
      of: [{type: 'reference', to: [{type: 'runner'}]}],
      validation: (rule) =>
        rule.min(1).max(5).error('Et hold skal have mindst én løber og højst 5 løbere'),
    }),
  ],
})
