import { DMMF } from '@prisma/generator-helper'
import * as ts from 'typescript'

export const genEnum = ({
  name,
  values,
  documentation,
}: DMMF.DatamodelEnum) => {
  const enumValues = values.map((value) => {
    return ts.factory.createEnumMember(
      ts.factory.createIdentifier(value.name),
      ts.factory.createStringLiteral(value.name),
    )
  })

  const enumDeclaration = ts.factory.createEnumDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    name,
    enumValues,
  )

  ts.addSyntheticLeadingComment(
    enumDeclaration,
    ts.SyntaxKind.MultiLineCommentTrivia,
    ` Enum ${documentation} `,
    true,
  )

  const printer = ts.createPrinter()
  const enumStr = printer.printNode(
    ts.EmitHint.Unspecified,
    enumDeclaration,
    ts.createSourceFile('', '', ts.ScriptTarget.Latest),
  )

  return `${enumStr}\n\n`
}
