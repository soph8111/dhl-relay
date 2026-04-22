import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'

export const person = defineType({
  type: 'document',
  name: 'person',
  title: 'Løbere',
  icon: UserIcon,
  preview: {
    select: {firstName: 'firstName', lastName: 'lastName', media: 'image'},
    prepare({firstName, lastName, media}) {
      return {
        title: `${firstName} ${lastName}`,
        media: media || UserIcon
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
          ]
        },
    }),
    defineField({
      name: 'image',
      title: 'Billede',
      type: 'image',
      options: {
    hotspot: true
  }    }),
  ],
})
