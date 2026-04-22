import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'
import {RocketIcon} from '@sanity/icons'

export const result = defineType({
  type: 'document',
  name: 'result',
  title: 'Resultater',
  icon: RocketIcon,
  preview: {
    select: {
      firstName: 'runner.firstName',
      lastName: 'runner.lastName',
      media: 'runner.image',
      result: 'result',
    },
    prepare({firstName, lastName, media, result}) {
      return {
        title: [firstName, lastName].filter(Boolean).join(' ') || 'Ukendt løber',
        subtitle: result ? `Resultat: ${result}` : 'Intet resultat',
        media: media || UserIcon,
      }
    },
  },
  fields: [
    defineField({
      name: 'year',
      title: 'DHL år',
      type: 'number',
      validation: (Rule) =>
        Rule.min(2016)
          .max(new Date().getFullYear())
          .error('Angiv et gyldigt årstal mellem 2016 og det nuværende år, f.eks. 2026.'),
      description: 'Angiv gældede DHL år (f.eks. 2026)',
    }),
    defineField({
      name: 'runner',
      title: 'Løber',
      type: 'reference',
      to: [{type: 'person'}],
    }),
    defineField({
      name: 'cutoff',
      title: 'Forventet tid / Cut-off',
      type: 'string',
      description: 'Angiv den tid, som personen forventer at bruge på løbet',
    }),
    defineField({
      name: 'result',
      title: 'Resultat',
      type: 'string',
      description:
        'Resultatet udfyldes automatisk, når en løber er i mål. Skulle der ske en fejl, kan resultatet indtastes manuelt',
    }),
  ],
})
