import {StructureResolver} from 'sanity/structure'
import {runner} from '../schemaTypes/runner'
import {result} from '../schemaTypes/result'
import {team} from '../schemaTypes/teams'

export const structure: StructureResolver = (S, context) => {
  const currentYear = new Date().getFullYear()

  return S.list()
    .title('Indhold')
    .id('test')
    .items([
      // Runners
      S.listItem().icon(runner.icon).title('Løbere').child(S.documentTypeList(runner.name)),
      // Teams
      S.listItem().icon(team.icon).title('Hold').child(S.documentTypeList(team.name)),

      // Results, sortet by year
      S.listItem()
        .icon(result.icon)
        .title('Resultater')
        .child(
          S.list()
            .title('Resultater')
            .items([
              S.listItem()
                .title('Alle resultater')
                .icon(result.icon)
                .child(
                  S.documentList()
                    .title('Alle resultater')
                    .filter('_type == "result"')
                    .defaultOrdering([{field: 'year', direction: 'desc'}]),
                ),

              S.divider(),
              ...Array.from({length: currentYear - 2015}, (_, i) => {
                const year = currentYear - i
                return S.listItem()
                  .title(`${year}`)
                  .icon(result.icon)
                  .child(
                    S.documentList()
                      .title(`Resultater ${year}`)
                      .filter('_type == "result" && year == $year')
                      .params({year})
                      .defaultOrdering([{field: 'result', direction: 'asc'}]),
                  )
              }),
            ]),
        ),
    ])
}
