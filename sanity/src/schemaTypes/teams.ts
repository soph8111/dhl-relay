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
      name: 'year',
      title: 'DHL år',
      type: 'number',
      validation: (Rule) =>
        Rule.required()
          .min(2016)
          .max(new Date().getFullYear() + 1)
          .error('Angiv et gyldigt årstal mellem 2016 og frem til næste år, f.eks. 2026.'),
      description: 'Angiv hvilket år dette hold deltager i (f.eks. 2026)',
    }),
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
        rule
          .length(5)
          .error(
            'Et hold skal have præcis 5 løbere. En løber kan godt være på et hold flere gange.',
          ),
    }),
  ],
})
