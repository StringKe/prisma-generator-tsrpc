import { genEnum } from '../helpers/genEnum'
import { getSampleDMMF } from './__fixtures__/getSampleDMMF'
import { genModel } from '../helpers/genModel'
import * as fs from 'fs'
import { genRelationModel } from '../helpers/genRelationModel'

test('enum generation', async () => {
  const sampleDMMF = await getSampleDMMF()
  fs.writeFileSync(
    './src/__tests__/__fixtures__/sampleDMMF.json',
    JSON.stringify(sampleDMMF, null, 2),
  )
  const enums = sampleDMMF.datamodel.enums
    .map((enumInfo) => {
      return genEnum(enumInfo)
    })
    .join('\n')
  expect(enums).toMatchSnapshot()
})

test('model generation', async () => {
  const sampleDMMF = await getSampleDMMF()
  const models = sampleDMMF.datamodel.models
    .map((model) => {
      return genModel(model as never)
    })
    .join('\n')
  expect(models).toMatchSnapshot()
})

test('model generation not include relation', async () => {
  const sampleDMMF = await getSampleDMMF()
  const models = sampleDMMF.datamodel.models
    .map((model) => {
      return genModel(model as never, false)
    })
    .join('\n')
  expect(models).toMatchSnapshot()
})

test('relation model generation', async () => {
  const sampleDMMF = await getSampleDMMF()
  const models = sampleDMMF.datamodel.models
    .map((model) => {
      return genRelationModel(model as never)
    })
    .join('\n')
  expect(models).toMatchSnapshot()
})
