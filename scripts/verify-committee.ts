import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { CommitteeSelection } from '../src/data/committee'

type Assignment = {
  index: number
  position: number
  role: string
  witness: boolean
}

type Case = {
  tie_breaker_nodes: number
  witness_nodes: number
  verification_percent: number
  total_nodes: number
  random_seed: string
  verifier_nodes: number
  assignments: Assignment[]
}

const here = dirname(fileURLToPath(import.meta.url))
const vectors: Case[] = JSON.parse(
  readFileSync(join(here, '../src/data/committee_vectors.json'), 'utf8'),
)

if (vectors.length === 0) {
  console.error('committee_vectors.json is empty')
  process.exit(1)
}

const failures: string[] = []

for (const testCase of vectors) {
  const label = `total=${testCase.total_nodes} tie=${testCase.tie_breaker_nodes} witness=${testCase.witness_nodes} pct=${testCase.verification_percent}`

  const selection = CommitteeSelection.create({
    tieBreakerNodes: testCase.tie_breaker_nodes,
    witnessNodes: testCase.witness_nodes,
    verificationPercent: testCase.verification_percent,
    totalNodes: testCase.total_nodes,
    randomSeed: BigInt(testCase.random_seed),
  })

  if (!selection) {
    failures.push(`${label}: rejected a selection Rust accepted`)
    continue
  }

  if (Number(selection.verifierNodes) !== testCase.verifier_nodes) {
    failures.push(
      `${label}: verifier count ${selection.verifierNodes}, Rust said ${testCase.verifier_nodes}`,
    )
  }

  for (const expected of testCase.assignments) {
    const actual = selection.assign(expected.index)
    if (Number(actual.position) !== expected.position) {
      failures.push(
        `${label} index=${expected.index}: position ${actual.position}, Rust said ${expected.position}`,
      )
    }
    if (actual.role !== expected.role) {
      failures.push(
        `${label} index=${expected.index}: role ${actual.role}, Rust said ${expected.role}`,
      )
    }
    if (actual.witness !== expected.witness) {
      failures.push(
        `${label} index=${expected.index}: witness ${actual.witness}, Rust said ${expected.witness}`,
      )
    }
  }
}

if (failures.length > 0) {
  console.error('committee port does not match the protocol:')
  for (const failure of failures.slice(0, 20)) console.error(`  ${failure}`)
  if (failures.length > 20) {
    console.error(`  and ${failures.length - 20} more`)
  }
  process.exit(1)
}

const indices = vectors.reduce((sum, c) => sum + c.assignments.length, 0)
console.log(
  `committee port matches the protocol across ${vectors.length} shapes and ${indices} indices`,
)
