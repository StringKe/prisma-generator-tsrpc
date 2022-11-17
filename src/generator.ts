import {
  EnvValue,
  generatorHandler,
  GeneratorOptions,
} from '@prisma/generator-helper'
import { logger, parseEnvValue } from '@prisma/internals'
import { GENERATOR_NAME } from './constants'
import { promises as fs } from 'fs'
import { genEnum } from './helpers/genEnum'
import { genModel } from './helpers/genModel'

const { version } = require('../package.json')

generatorHandler({
  onManifest() {
    logger.info(`${GENERATOR_NAME}:Registered`)
    return {
      version,
      defaultOutput: '../generated',
      prettyName: GENERATOR_NAME,
    }
  },
  onGenerate: async (options: GeneratorOptions) => {
    const outputDir = parseEnvValue(options.generator.output as EnvValue)
    await fs.mkdir(outputDir, { recursive: true })

    const enums = options.dmmf.datamodel.enums
      .map((enumInfo) => {
        return genEnum(enumInfo)
      })
      .join('\n\n')
    const models = options.dmmf.datamodel.models
      .map((model) => {
        return genModel(model)
      })
      .join('\n\n')

    await fs.writeFile(
      `${outputDir}/index.ts`,
      `// Generated by ${GENERATOR_NAME} v${version}\n\n${enums}\n${models}`,
    )
  },
})
