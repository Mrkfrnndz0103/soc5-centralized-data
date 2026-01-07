#!/usr/bin/env node

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CONFIG = {
  docsDir: path.join(__dirname, "../docs"),
  rootDir: path.join(__dirname, ".."),
  packageJson: path.join(__dirname, "../package.json"),
}

function listDocs() {
  const docs = []
  const readme = path.join(CONFIG.rootDir, "README.md")
  if (fs.existsSync(readme)) docs.push(readme)

  if (fs.existsSync(CONFIG.docsDir)) {
    for (const file of fs.readdirSync(CONFIG.docsDir)) {
      if (file.endsWith(".md")) {
        docs.push(path.join(CONFIG.docsDir, file))
      }
    }
  }

  return docs
}

function updateLastUpdated(filePath, date) {
  const content = fs.readFileSync(filePath, "utf8")
  const updatedLine = `Last Updated: ${date}`
  const patterns = [/^\*\*Last Updated\*\*:.*$/m, /^Last Updated:.*$/m]
  let next = content

  if (patterns.some((pattern) => pattern.test(content))) {
    next = next
      .replace(/^\*\*Last Updated\*\*:.*$/m, `**Last Updated**: ${date}`)
      .replace(/^Last Updated:.*$/m, updatedLine)
  } else {
    const trimmed = content.trimEnd()
    next = `${trimmed}\n\n${updatedLine}\n`
  }

  fs.writeFileSync(filePath, next)
}

function updateVersion(readmePath) {
  if (!fs.existsSync(readmePath)) return

  const pkg = JSON.parse(fs.readFileSync(CONFIG.packageJson, "utf8"))
  const content = fs.readFileSync(readmePath, "utf8")

  if (!/Current Version:\s*\*\*.*\*\*/.test(content)) return

  const next = content.replace(
    /Current Version:\s*\*\*.*\*\*/,
    `Current Version: **${pkg.version}**`
  )
  fs.writeFileSync(readmePath, next)
}

function main() {
  const date = new Date().toISOString().split("T")[0]
  const docs = listDocs()

  for (const doc of docs) {
    updateLastUpdated(doc, date)
  }

  updateVersion(path.join(CONFIG.rootDir, "README.md"))

  console.log(`Docs refreshed (${docs.length} files).`)
}

main()
