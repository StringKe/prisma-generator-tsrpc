import { DMMF } from '@prisma/generator-helper'
import * as ts from 'typescript'

function fcUpperFirst(str: string) {
  return str[0].toUpperCase() + str.slice(1)
}

export const genRelationModel = ({
  name,
  fields,
  documentation,
}: DMMF.Model) => {
  const fieldDeclarations: ts.PropertySignature[] = fields
    .filter((field) => field.kind === 'object')
    .map((field) => {
      const fieldName = field.name

      let fieldType = field.type

      const isOptional = !field.isRequired
      const isList = field.isList

      const nodes = [
        isList
          ? ts.factory.createArrayTypeNode(
              ts.factory.createTypeReferenceNode(fieldType),
            )
          : ts.factory.createTypeReferenceNode(fieldType),
        isOptional ? ts.factory.createNull() : undefined,
      ].filter(Boolean) as ts.TypeNode[]

      const propertySignature = ts.factory.createPropertySignature(
        undefined,
        fieldName,
        isOptional
          ? ts.factory.createToken(ts.SyntaxKind.QuestionToken)
          : undefined,
        ts.factory.createUnionTypeNode(nodes),
      )

      if (field.documentation) {
        ts.addSyntheticLeadingComment(
          propertySignature,
          ts.SyntaxKind.MultiLineCommentTrivia,
          ` ${field.documentation} `,
          true,
        )
      }
      return propertySignature
    })

  const strs = []

  const interfaceDeclaration = ts.factory.createTypeAliasDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(`${name}Relation`),
    [],
    ts.factory.createTypeLiteralNode(fieldDeclarations),
  )

  ts.addSyntheticLeadingComment(
    interfaceDeclaration,
    ts.SyntaxKind.MultiLineCommentTrivia,
    ` Model ${name} Relation All `,
    true,
  )

  const printer = ts.createPrinter()
  const str = printer.printNode(
    ts.EmitHint.Unspecified,
    interfaceDeclaration,
    ts.createSourceFile('', '', ts.ScriptTarget.Latest),
  )
  strs.push(str)

  for (const field of fieldDeclarations) {
    const filedName = field.name as ts.Identifier

    const interfaceDeclaration = ts.factory.createTypeAliasDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier(
        `${name}${fcUpperFirst(filedName.escapedText as string)}Relation`,
      ),
      [],
      ts.factory.createTypeLiteralNode([field]),
    )

    ts.addSyntheticLeadingComment(
      interfaceDeclaration,
      ts.SyntaxKind.MultiLineCommentTrivia,
      ` Model ${name} Relation ${fcUpperFirst(
        filedName.escapedText as string,
      )} `,
      true,
    )

    const printer = ts.createPrinter()
    const str = printer.printNode(
      ts.EmitHint.Unspecified,
      interfaceDeclaration,
      ts.createSourceFile('', '', ts.ScriptTarget.Latest),
    )
    strs.push(str)
  }

  return strs.join('\n\n')
}
