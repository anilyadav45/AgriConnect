"use client"

import { useEffect, useRef } from "react"

interface PriceChartProps {
  data: number[]
  trend: string
}

export default function PriceChart({ data, trend }: PriceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const padding = 20
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Find min and max values
    const minValue = Math.min(...data) * 0.98
    const maxValue = Math.max(...data) * 1.02
    const valueRange = maxValue - minValue

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#e5e7eb" // gray-200
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Draw grid lines
    ctx.beginPath()
    ctx.strokeStyle = "#f3f4f6" // gray-100
    for (let i = 1; i < 5; i++) {
      const y = padding + (chartHeight / 5) * i
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
    }
    ctx.stroke()

    // Draw data points and line
    if (data.length > 1) {
      ctx.beginPath()

      // Set line color based on trend
      if (trend === "up") {
        ctx.strokeStyle = "#10b981" // green-500
      } else if (trend === "down") {
        ctx.strokeStyle = "#ef4444" // red-500
      } else {
        ctx.strokeStyle = "#6b7280" // gray-500
      }

      ctx.lineWidth = 2

      // Calculate x and y coordinates for each data point
      data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index
        const y = height - padding - ((value - minValue) / valueRange) * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Draw points
      data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index
        const y = height - padding - ((value - minValue) / valueRange) * chartHeight

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = "#ffffff"
        ctx.fill()
        ctx.strokeStyle = trend === "up" ? "#10b981" : trend === "down" ? "#ef4444" : "#6b7280"
        ctx.lineWidth = 2
        ctx.stroke()
      })

      // Add area under the curve
      ctx.beginPath()

      // Start from the bottom left
      ctx.moveTo(padding, height - padding)

      // Draw the line to each data point
      data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index
        const y = height - padding - ((value - minValue) / valueRange) * chartHeight
        ctx.lineTo(x, y)
      })

      // Complete the path to the bottom right
      ctx.lineTo(width - padding, height - padding)
      ctx.closePath()

      // Fill with a gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      if (trend === "up") {
        gradient.addColorStop(0, "rgba(16, 185, 129, 0.2)") // green-500 with opacity
        gradient.addColorStop(1, "rgba(16, 185, 129, 0.05)")
      } else if (trend === "down") {
        gradient.addColorStop(0, "rgba(239, 68, 68, 0.2)") // red-500 with opacity
        gradient.addColorStop(1, "rgba(239, 68, 68, 0.05)")
      } else {
        gradient.addColorStop(0, "rgba(107, 114, 128, 0.2)") // gray-500 with opacity
        gradient.addColorStop(1, "rgba(107, 114, 128, 0.05)")
      }

      ctx.fillStyle = gradient
      ctx.fill()
    }

    // Add day labels
    const days = ["सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि", "रवि"]
    ctx.fillStyle = "#6b7280" // gray-500
    ctx.font = "10px Arial"
    ctx.textAlign = "center"

    data.forEach((_, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index
      const y = height - padding + 15
      ctx.fillText(days[index % 7], x, y)
    })
  }, [data, trend])

  return (
    <div className="w-full h-40 relative">
      <canvas ref={canvasRef} width={400} height={160} className="w-full h-full" />
    </div>
  )
}
