import {defineField, defineType} from 'sanity'
import {UserIcon, RocketIcon} from '@sanity/icons'
import {MinutesSecondsInput} from '../components/MinutesSecondsInput'

const CURRENT_YEAR = new Date().getFullYear()

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
        subtitle: result
          ? `Resultat: ${Math.floor(result / 60)}:${String(result % 60).padStart(2, '0')} min`
          : 'Intet resultat endnu',
        media: media || UserIcon,
      }
    },
  },
  fields: [
    defineField({
      name: 'team',
      title: 'Hold',
      type: 'reference',
      to: [{type: 'team'}],
      validation: (rule) => rule.required(),
      options: {
        filter: `year == $year`,
        filterParams: {year: CURRENT_YEAR},
      },
    }),
    defineField({
      name: 'runner',
      title: 'Løber',
      type: 'reference',
      to: [{type: 'runner'}],
      hidden: ({document}) => !(document as any)?.team,
      validation: (rule) => rule.required(),
      options: {
        filter: ({document}) => {
          const teamRef = (document as any)?.team?._ref
          if (!teamRef) return {filter: 'false'}
          return {
            filter: '_id in *[_type == "team" && _id == $teamId][0].runners[]._ref',
            params: {teamId: teamRef},
          }
        },
      },
    }),
    defineField({
      name: 'cutoff',
      title: 'Forventet tid / Cut-off',
      type: 'number',
      components: {input: MinutesSecondsInput},
      description: 'Angiv den forventede tid i formatet mm:ss, f.eks. 22:15',
    }),
    defineField({
      name: 'result',
      title: 'Resultat',
      type: 'number',
      components: {input: MinutesSecondsInput},
      description:
        'Resultatet udfyldes automatisk, når en løber er i mål. Skulle der ske en fejl, kan resultatet indtastes manuelt i formatet mm:ss, f.eks. 22:15',
    }),
  ],
})
