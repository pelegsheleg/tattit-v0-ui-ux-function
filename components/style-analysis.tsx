import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function StyleAnalysis({ analysis }) {
  if (!analysis) {
    return (
      <div className="text-center py-12 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No style analysis available</p>
      </div>
    )
  }

  // Parse technique strengths from JSON string if needed
  let techniqueStrengths = analysis.technique_strengths
  if (typeof techniqueStrengths === "string") {
    try {
      techniqueStrengths = JSON.parse(techniqueStrengths)
    } catch (e) {
      techniqueStrengths = {}
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Primary Style</h2>
        <p className="text-lg">{analysis.primary_style}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Style Tags</h2>
        <div className="flex flex-wrap gap-2">
          {analysis.style_tags?.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Color Palette</h2>
        <div className="flex gap-2">
          {analysis.color_palette?.map((color, index) => (
            <div key={index} className="w-12 h-12 rounded-full" style={{ backgroundColor: color }} title={color} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Technique Strengths</h2>
        <div className="space-y-4">
          {Object.entries(techniqueStrengths).map(([technique, score]) => (
            <div key={technique}>
              <div className="flex justify-between mb-1">
                <span className="capitalize">{technique.replace(/([A-Z])/g, " $1").trim()}</span>
                <span>{score}/100</span>
              </div>
              <Progress value={score} className="h-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
