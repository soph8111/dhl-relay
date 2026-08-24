import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'

export const runner = defineType({
  type: 'document',
  name: 'runner',
  title: 'Løbere',
  icon: UserIcon,
  preview: {
    select: {firstName: 'firstName', lastName: 'lastName', media: 'image'},
    prepare({firstName, lastName, media}) {
      return {
        title: `${firstName} ${lastName}`,
        media: media || UserIcon,
      }
    },
  },
  fields: [
    defineField({
      type: 'string',
      name: 'firstName',
      title: 'Fornavn',
      validation: (rule) => rule.required().error('Fornavn er påkrævet'),
    }),
    defineField({
      type: 'string',
      name: 'lastName',
      title: 'Efternavn',
      validation: (rule) => rule.required().error('Efternavn er påkrævet'),
    }),
    defineField({
      type: 'string',
      name: 'alias',
      title: 'Alias',
      description: 'Angiv hvis personen har et alias, som skal vises i stedet for fornavnet',
    }),
    defineField({
      type: 'slug',
      name: 'slug',
      title: 'Slug',
      options: {
        source: (doc) => `${doc.firstName}-${doc.lastName}`,
        maxLength: 96,
      },
      validation: (rule) => rule.required().error('Slug er påkrævet'),
    }),
    defineField({
      name: 'age',
      title: 'Alder',
      type: 'number',
    }),
    defineField({
      name: 'gender',
      title: 'Køn',
      type: 'string',
      options: {
        list: [
          {title: 'Mand', value: 'male'},
          {title: 'Kvinde', value: 'female'},
        ],
      },
    }),
    defineField({
      name: 'image',
      title: 'Billede',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'isReferenceRunner',
      title: 'Referenceløber',
      type: 'boolean',
      initialValue: false,
      description: 'Markér denne løber som referencen (fx chefen), alle andres tid måles op imod',
      // Custom validation to ensure only one runner can be marked as reference runner
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          if (!value) return true

          const client = context.getClient({apiVersion: '2024-01-01'})
          const publishedId = context.document?._id?.replace(/^drafts\./, '')
          const draftId = `drafts.${publishedId}`

          const existing = await client.fetch(
            `*[_type == "runner" && isReferenceRunner == true && !(_id in [$publishedId, $draftId])][0]{
          firstName,
          lastName,
          alias
        }`,
            {publishedId, draftId},
          )

          if (existing) {
            const name =
              existing.firstName && existing.lastName
                ? `${existing.firstName} ${existing.lastName}`
                : existing.alias || 'en anden løber'

            return `${name} er allerede markeret som referenceløber. Fjern markeringen der først.`
          }

          return true
        }),
    }),
  ],
})
