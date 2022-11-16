import { DMMF } from '@prisma/generator-helper'
import _ from 'lodash'
import * as ts from 'typescript'

export const genEnum = ({ name, values }: DMMF.DatamodelEnum) => {
  const camelCaseName = _.snakeCase(name).toUpperCase()
  const enumValues: ts.EnumMember[] = values.map((value) => {
    const enumValue = _.snakeCase(value.name).toUpperCase()
    return ts.factory.createEnumMember(
      ts.factory.createIdentifier(enumValue),
      ts.factory.createStringLiteral(value.name),
    )
  })

  const enumDeclaration = ts.factory.createEnumDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(camelCaseName),
    enumValues,
  )
  const printer = ts.createPrinter()
  return printer.printNode(
    ts.EmitHint.Unspecified,
    enumDeclaration,
    ts.createSourceFile('', '', ts.ScriptTarget.Latest),
  )
}
