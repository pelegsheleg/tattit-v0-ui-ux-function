export function PortfolioPreview() {
  // Mock data for portfolio items
  const portfolioItems = [
    {
      id: 1,
      title: "Cyberpunk Sleeve",
      description: "Full arm cyberpunk-themed tattoo with neon elements",
      image: "/images/tattoo-cyberpunk.png",
      likes: 124,
      views: 1.2,
    },
    {
      id: 2,
      title: "Mythological Dragon",
      description: "Traditional Japanese-style dragon with modern elements",
      image: "/images/tattoo-mythological.png",
      likes: 98,
      views: 0.9,
    },
    {
      id: 3,
      title: "Geometric Wolf",
      description: "Minimalist geometric wolf design with fine line work",
      image: "/images/tattoo-geometric.png",
      likes: 156,
      views: 1.5,
    },
    {
      id: 4,
      title: "Symbolic Patchwork",
      description: "Collection of symbolic elements in a patchwork style",
      image: "/images/tattoo-symbolic-patchwork.png",
      likes: 87,
      views: 0.7,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {portfolioItems.map((item) => (
        <div key={item.id} className="bg-black/40 border border-purple-500/30 rounded-lg overflow-hidden group">
          <div className="h-48 w-full overflow-hidden">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="p-3">
            <h3 className="font-medium text-white text-sm">{item.title}</h3>
            <p className="text-xs text-purple-300 line-clamp-2 mt-1">{item.description}</p>
            <div className="flex items-center justify-between mt-2 text-xs text-purple-400">
              <span>♥ {item.likes} likes</span>
              <span>{item.views}k views</span>
            </div>
          </div>
        </div>
      ))}
      <div className="bg-purple-900/20 border border-purple-500/30 border-dashed rounded-lg flex flex-col items-center justify-center p-4 h-full">
        <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-purple-300"
          >
            <path d="M12 5v14M5 12h14"></path>
          </svg>
        </div>
        <p className="text-sm text-purple-300 text-center">Upload New Work</p>
      </div>
    </div>
  )
}

export default PortfolioPreview
