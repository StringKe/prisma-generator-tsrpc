import { DMMF } from '@prisma/generator-helper'
import * as ts from 'typescript'

export const genEnum = ({
  name,
  values,
  documentation,
}: DMMF.DatamodelEnum) => {
  const enumValues = values.map((value) => {
    return ts.factory.createPropertySignature(
      undefined,
      ts.factory.createIdentifier(value.name),
      undefined,
      ts.factory.createLiteralTypeNode(
        ts.factory.createStringLiteral(value.name),
      ),
    )
  })

  const enumDeclaration = ts.factory.createVariableStatement(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          ts.factory.createIdentifier(name),
          undefined,
          ts.factory.createTypeLiteralNode(enumValues),
        ),
      ],
      ts.NodeFlags.Const,
    ),
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

  const typeDeclaration = ts.factory.createTypeAliasDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(name),
    [],
    ts.factory.createIndexedAccessTypeNode(
      ts.factory.createParenthesizedType(
        ts.factory.createTypeQueryNode(ts.factory.createIdentifier(name)),
      ),
      ts.factory.createTypeOperatorNode(
        ts.SyntaxKind.KeyOfKeyword,
        ts.factory.createTypeQueryNode(ts.factory.createIdentifier(name)),
      ),
    ),
  )

  const typeStr = printer.printNode(
    ts.EmitHint.Unspecified,
    typeDeclaration,
    ts.createSourceFile('', '', ts.ScriptTarget.Latest),
  )

  return `${enumStr}\n\n${typeStr}\n\n`
}
