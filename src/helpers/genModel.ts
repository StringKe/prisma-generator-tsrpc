import { DMMF } from '@prisma/generator-helper'
import * as ts from 'typescript'

export const genModel = ({ name, fields, documentation }: DMMF.Model) => {
  const fieldDeclarations: ts.PropertySignature[] = fields.map((field) => {
    const fieldName = field.name

    let fieldType = 'any'
    if (field.kind === 'enum') {
      fieldType = field.type
    } else if (field.kind === 'object') {
      fieldType = field.type
    } else if (field.kind === 'scalar') {
      if (['Int', 'Float', 'Decimal', 'BigInt'].includes(field.type)) {
        fieldType = 'number'
      } else if (field.type === 'Boolean') {
        fieldType = 'boolean'
      } else if (field.type === 'DateTime') {
        fieldType = 'Date'
      } else if (field.type === 'String') {
        fieldType = 'string'
      } else if (field.type === 'Bytes') {
        fieldType = 'Buffer'
      } else if (field.type === 'Json') {
        fieldType = 'any'
      }
    } else if (field.kind === 'unsupported') {
      fieldType = 'any'
    }

    const isOptional = !field.isRequired
    const isList = field.isList

    const propertySignature = ts.factory.createPropertySignature(
      undefined,
      fieldName,
      isOptional
        ? ts.factory.createToken(ts.SyntaxKind.QuestionToken)
        : undefined,
      isList
        ? ts.factory.createArrayTypeNode(
            ts.factory.createTypeReferenceNode(fieldType),
          )
        : ts.factory.createTypeReferenceNode(fieldType),
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

  const interfaceDeclaration = ts.factory.createInterfaceDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(name),
    undefined,
    undefined,
    fieldDeclarations,
  )

  ts.addSyntheticLeadingComment(
    interfaceDeclaration,
    ts.SyntaxKind.MultiLineCommentTrivia,
    ` Model ${documentation} `,
    true,
  )

  const printer = ts.createPrinter()
  return printer.printNode(
    ts.EmitHint.Unspecified,
    interfaceDeclaration,
    ts.createSourceFile('', '', ts.ScriptTarget.Latest),
  )
}
