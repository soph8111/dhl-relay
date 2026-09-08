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

      // Teams, sorted by year
      S.listItem()
        .icon(team.icon)
        .title('Hold')
        .child(
          S.list()
            .title('Hold')
            .items([
              S.listItem()
                .title('Alle hold')
                .icon(team.icon)
                .child(
                  S.documentList()
                    .title('Alle hold')
                    .filter('_type == "team"')
                    .defaultOrdering([{field: 'year', direction: 'desc'}]),
                ),

              S.divider(),
              ...Array.from({length: currentYear - 2015}, (_, i) => {
                const year = currentYear - i
                return S.listItem()
                  .title(`${year}`)
                  .icon(team.icon)
                  .child(
                    S.documentList()
                      .title(`Hold ${year}`)
                      .filter('_type == "team" && year == $year')
                      .params({year})
                      .defaultOrdering([{field: 'teamName', direction: 'asc'}]),
                  )
              }),
            ]),
        ),

      // Results, sorted by team's year
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
                    .defaultOrdering([{field: 'team->year', direction: 'desc'}]),
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
                      .filter('_type == "result" && team->year == $year')
                      .params({year})
                      .defaultOrdering([{field: 'result', direction: 'asc'}]),
                  )
              }),
            ]),
        ),
    ])
}
