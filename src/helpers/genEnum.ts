import { DMMF } from '@prisma/generator-helper'
import * as ts from 'typescript'

export const genEnum = ({
  name,
  values,
  documentation,
}: DMMF.DatamodelEnum) => {
  const enumValues: ts.EnumMember[] = values.map((value) => {
    return ts.factory.createEnumMember(ts.factory.createIdentifier(value.name))
  })

  const enumDeclaration = ts.factory.createEnumDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(name),
    enumValues,
  )

  ts.addSyntheticLeadingComment(
    enumDeclaration,
    ts.SyntaxKind.MultiLineCommentTrivia,
    ` Enum ${documentation} `,
    true,
  )

  const printer = ts.createPrinter()
  return printer.printNode(
    ts.EmitHint.Unspecified,
    enumDeclaration,
    ts.createSourceFile('', '', ts.ScriptTarget.Latest),
  )
}
