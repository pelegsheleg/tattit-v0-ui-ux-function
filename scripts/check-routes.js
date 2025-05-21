const fs = require("fs")
const path = require("path")

// Function to get all page routes
function getPageRoutes() {
  const pagesDir = path.join(process.cwd(), "pages")
  if (!fs.existsSync(pagesDir)) return []

  const routes = []

  function processDir(dir, basePath = "") {
    const entries = fs.readdirSync(dir)

    for (const entry of entries) {
      const fullPath = path.join(dir, entry)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        // Skip api and _* directories for comparison
        if (entry === "api" || entry.startsWith("_")) continue
        processDir(fullPath, `${basePath}/${entry}`)
      } else if (stat.isFile() && /\.(js|jsx|ts|tsx)$/.test(entry)) {
        // Skip _* files
        if (entry.startsWith("_")) continue

        // Convert filename to route
        let route = entry.replace(/\.(js|jsx|ts|tsx)$/, "")
        if (route === "index") route = ""
        routes.push(`${basePath}/${route}`.replace(/\/+/g, "/"))
      }
    }
  }

  processDir(pagesDir)
  return routes
}

// Function to get all app routes
function getAppRoutes() {
  const appDir = path.join(process.cwd(), "app")
  if (!fs.existsSync(appDir)) return []

  const routes = []

  function processDir(dir, basePath = "") {
    const entries = fs.readdirSync(dir)

    for (const entry of entries) {
      const fullPath = path.join(dir, entry)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        // Skip api directory for comparison
        if (entry === "api") continue
        processDir(fullPath, `${basePath}/${entry}`)
      } else if (
        (stat.isFile() && entry === "page.tsx") ||
        entry === "page.jsx" ||
        entry === "page.js" ||
        entry === "page.ts"
      ) {
        routes.push(basePath.replace(/\/+/g, "/"))
      }
    }
  }

  processDir(appDir)
  return routes
}

// Find duplicate routes
const pageRoutes = getPageRoutes()
const appRoutes = getAppRoutes()

console.log("Pages Routes:", pageRoutes)
console.log("App Routes:", appRoutes)

const duplicates = pageRoutes.filter((route) => appRoutes.includes(route))
if (duplicates.length > 0) {
  console.error("Duplicate routes found:")
  duplicates.forEach((route) => {
    console.error(`- "${route}" exists in both pages/ and app/`)
  })
  process.exit(1)
} else {
  console.log("No duplicate routes found!")
}
